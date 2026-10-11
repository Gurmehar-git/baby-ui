import { createHash } from "node:crypto";
import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	renameSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const HEADER =
	"# Written by scripts/generate.mjs (pnpm gen). Edit the sources, not these.";
const MANIFEST = ".generated.json";

export const read = (path) => (existsSync(path) ? readFileSync(path, "utf8") : null);
export const posix = (path) => path.replaceAll("\\", "/");
export const rel = (path) => posix(relative(ROOT, path));
const hash = (text) => createHash("sha1").update(text).digest("hex");

/** Collects generated files; each lands under exactly one root, which lists it in a .gitignore. */
export class Output {
	constructor(roots) {
		this.roots = roots.map((root) => join(ROOT, root));
		this.files = new Map();
		this.keep = new Set();
		this.yielding = new Set();
		this.sources = new Map();
	}

	/** `yieldToHand`: a hand-written file at this path wins (usage). Every other path the generator owns.
	 * `source`: the file to edit instead, named when a hand edit here gets overwritten. */
	add(path, content, { yieldToHand = false, source } = {}) {
		this.files.set(path, content);
		if (yieldToHand) this.yielding.add(path);
		if (source) this.sources.set(path, source);
	}

	/** A path that must survive even though this run no longer generates it (port-specific files). */
	protect(path) {
		this.keep.add(path);
	}

	rootOf(path) {
		const root = this.roots
			.filter((r) => path.startsWith(r + sep))
			.sort((a, b) => b.length - a.length)[0];
		if (!root) throw new Error(`gen: ${rel(path)} is outside every root`);
		return root;
	}
}

// Two gen runs at once (dev server plus a manual run) interleaved plain writes and left a
// shorter manifest over a longer one's tail; a rename swaps the whole file in one step.
function writeAtomic(file, content) {
	const tmp = `${file}.${process.pid}.tmp`;
	writeFileSync(tmp, content);
	try {
		renameWithRetry(tmp, file);
	} catch (error) {
		rmSync(tmp, { force: true });
		throw error;
	}
}

// Windows refuses to replace a file another process holds open without delete sharing (Biome's
// language server keeps indexed files open). Retry briefly, then overwrite in place.
const LOCKED = new Set(["EPERM", "EACCES", "EBUSY"]);
const pause = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
function renameWithRetry(from, to) {
	for (let attempt = 0; ; attempt++) {
		try {
			return renameSync(from, to);
		} catch (error) {
			if (!LOCKED.has(error.code)) throw error;
			if (attempt >= 4) {
				copyFileSync(from, to);
				return rmSync(from);
			}
			pause(10 * 2 ** attempt);
		}
	}
}

/** What the previous run generated under a root, path to content hash (null when unknown). */
export function previousFor(root) {
	const manifest = read(join(root, MANIFEST));
	if (manifest) {
		return new Map(
			Object.entries(JSON.parse(manifest)).map(([path, sum]) => [join(root, path), sum]),
		);
	}
	const ignore = read(join(root, ".gitignore"));
	if (!ignore) return new Map();
	return new Map(
		ignore
			.split(/\r?\n/)
			.filter(
				(line) =>
					line.startsWith("/") && line !== "/.gitignore" && line !== `/${MANIFEST}`,
			)
			.map((line) => [join(root, line.slice(1)), null]),
	);
}

/** Writes changed files and prunes ones it no longer generates. Prunes skip hand-edited files
 * (conflicts); rewrites of an owned file report the lost hand edit (overwritten). */
export function flush(output, { check }) {
	const stale = [];
	const conflicts = [];
	const overwritten = [];
	const byRoot = new Map(output.roots.map((root) => [root, []]));
	for (const path of output.files.keys()) byRoot.get(output.rootOf(path))?.push(path);

	for (const [root, paths] of byRoot) {
		const before = previousFor(root);
		const written = {};
		for (const path of paths) {
			const content = output.files.get(path);
			const current = read(path);
			// A fresh checkout has no manifest, so owned paths are always rewritten; only yielding ones
			// (usage) back off from a file they cannot prove they wrote.
			if (
				current !== null &&
				current !== content &&
				!before.has(path) &&
				output.yielding.has(path)
			) {
				conflicts.push(`${rel(path)} exists and was not generated; not overwriting it`);
				continue;
			}
			written[posix(relative(root, path))] = hash(content);
			if (current === content) continue;
			const sum = before.get(path);
			// Owned paths still regenerate, but a silent overwrite reads as a lost edit.
			if (current !== null && sum && hash(current) !== sum) {
				const source = output.sources.get(path);
				overwritten.push(
					source
						? `${rel(path)} was edited by hand; it is copied from ${rel(source)}, edit that`
						: `${rel(path)} was edited by hand; it is generated, edit its source`,
				);
			}
			stale.push(path);
			if (!check) {
				mkdirSync(dirname(path), { recursive: true });
				writeAtomic(path, content);
			}
		}
		for (const [old, sum] of before) {
			if (output.files.has(old) || output.keep.has(old) || !existsSync(old)) continue;
			const current = read(old);
			if (sum && current !== null && hash(current) !== sum) {
				conflicts.push(`${rel(old)} was generated, then edited; left in place`);
				continue;
			}
			stale.push(old);
			if (!check) rmSync(old);
		}

		const lines = Object.keys(written)
			.map((path) => `/${path}`)
			.sort();
		const ignore = lines.length
			? [HEADER, "/.gitignore", `/${MANIFEST}`, ...lines, ""].join("\n")
			: null;
		const manifest = lines.length
			? `${JSON.stringify(Object.fromEntries(Object.entries(written).sort()), null, "\t")}\n`
			: null;
		for (const [file, content] of [
			[join(root, ".gitignore"), ignore],
			[join(root, MANIFEST), manifest],
		]) {
			const current = read(file);
			if (current === content) continue;
			stale.push(file);
			if (check) continue;
			if (content === null) rmSync(file);
			else writeAtomic(file, content);
		}
	}
	return { generated: [...output.files.keys()], stale, conflicts, overwritten };
}
