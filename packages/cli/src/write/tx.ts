import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, rmdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { z } from "zod";
import { ancestors } from "../project/fs.ts";
import { relativeTo, STATE_DIR, sha256 } from "./lock.ts";

/** One file to write, or delete when `content` is null. */
export interface FileOp {
	readonly path: string;
	readonly content: string | null;
}

const SideSchema = z.object({ exists: z.boolean(), hash: z.string().optional() });

const JournalSchema = z.object({
	id: z.string(),
	command: z.string(),
	createdAt: z.string(),
	ops: z.array(
		z.object({
			path: z.string(),
			before: SideSchema.extend({ snapshot: z.string().optional() }),
			after: SideSchema,
		}),
	),
	/** Root-relative dirs this transaction created, removed again on revert if empty. */
	createdDirs: z.array(z.string()),
	revertOf: z.string().optional(),
	revertedBy: z.string().optional(),
});

export type Journal = z.infer<typeof JournalSchema>;

export const KEEP = 20;
const historyDir = (root: string) => join(root, STATE_DIR, "history");

async function readText(path: string): Promise<string | undefined> {
	try {
		return await readFile(path, "utf8");
	} catch {
		return undefined;
	}
}

const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:T.Z]/g, "");

// Millisecond stamps, bumped past the newest journal so ids always sort in commit order.
async function newId(root: string): Promise<string> {
	let ids: string[] = [];
	try {
		ids = await readdir(historyDir(root));
	} catch {}
	const newest = ids.sort().at(-1);
	let ms = Date.now();
	while (newest && stamp(ms) <= newest) ms++;
	return stamp(ms);
}

async function ensureStateDir(root: string): Promise<void> {
	const ignore = join(root, STATE_DIR, ".gitignore");
	if (existsSync(ignore)) return;
	await mkdir(dirname(ignore), { recursive: true });
	await writeFile(
		ignore,
		"# Undo snapshots stay local; lock.json is committed.\nhistory/\n",
	);
}

function missingDirs(root: string, file: string): string[] {
	const out: string[] = [];
	for (const dir of ancestors(dirname(file))) {
		if (existsSync(dir) || resolve(dir) === resolve(root)) break;
		out.push(dir);
	}
	return out;
}

async function apply(op: FileOp): Promise<void> {
	if (op.content === null) await rm(op.path, { force: true });
	else {
		await mkdir(dirname(op.path), { recursive: true });
		await writeFile(op.path, op.content);
	}
}

/**
 * Snapshots every target, applies all ops, and journals them so `revert` can undo. A failure
 * midway restores what was already written.
 */
export async function commit(
	root: string,
	command: string,
	ops: readonly FileOp[],
	extra: Pick<Journal, "revertOf"> = {},
): Promise<Journal> {
	await ensureStateDir(root);
	const id = await newId(root);
	const dir = join(historyDir(root), id);
	await mkdir(join(dir, "files"), { recursive: true });

	const createdDirs = new Set<string>();
	const entries: Journal["ops"] = [];
	const before: Array<string | undefined> = [];
	for (const [index, op] of ops.entries()) {
		const previous = await readText(op.path);
		before.push(previous);
		for (const created of missingDirs(root, op.path)) {
			createdDirs.add(relativeTo(root, created));
		}
		let snapshot: string | undefined;
		if (previous !== undefined) {
			snapshot = `files/${index}`;
			await writeFile(join(dir, snapshot), previous);
		}
		entries.push({
			path: relativeTo(root, op.path),
			before: {
				exists: previous !== undefined,
				hash: previous === undefined ? undefined : sha256(previous),
				snapshot,
			},
			after: {
				exists: op.content !== null,
				hash: op.content === null ? undefined : sha256(op.content),
			},
		});
	}

	const journal: Journal = {
		id,
		command,
		createdAt: new Date().toISOString(),
		ops: entries,
		createdDirs: [...createdDirs].sort((a, b) => b.length - a.length),
		...extra,
	};

	const done: number[] = [];
	try {
		for (const [index, op] of ops.entries()) {
			await apply(op);
			done.push(index);
		}
	} catch (error) {
		for (const index of done.reverse()) {
			const op = ops[index];
			if (op) await apply({ path: op.path, content: before[index] ?? null });
		}
		await removeEmptyDirs(root, journal.createdDirs);
		await rm(dir, { recursive: true, force: true });
		throw error;
	}

	await writeFile(join(dir, "journal.json"), `${JSON.stringify(journal, null, "\t")}\n`);
	await prune(root);
	return journal;
}

async function removeEmptyDirs(root: string, dirs: readonly string[]): Promise<void> {
	for (const dir of dirs) {
		try {
			await rmdir(join(root, dir));
		} catch {}
	}
}

export async function listJournals(root: string): Promise<Journal[]> {
	let ids: string[];
	try {
		ids = await readdir(historyDir(root));
	} catch {
		return [];
	}
	const journals = await Promise.all(ids.map((id) => readJournal(root, id)));
	return journals
		.filter((j): j is Journal => j !== undefined)
		.sort((a, b) => b.id.localeCompare(a.id));
}

export async function readJournal(
	root: string,
	id: string,
): Promise<Journal | undefined> {
	const text = await readText(join(historyDir(root), id, "journal.json"));
	if (text === undefined) return undefined;
	const parsed = JournalSchema.safeParse(JSON.parse(text));
	return parsed.success ? parsed.data : undefined;
}

async function prune(root: string): Promise<void> {
	const journals = await listJournals(root);
	for (const old of journals.slice(KEEP)) {
		await rm(join(historyDir(root), old.id), { recursive: true, force: true });
	}
}

export interface Conflict {
	readonly path: string;
	readonly reason: "edited" | "deleted" | "recreated";
}

/** Files changed after the journal wrote them; reverting would discard those edits. */
export async function conflicts(root: string, journal: Journal): Promise<Conflict[]> {
	const found: Conflict[] = [];
	for (const op of journal.ops) {
		const current = await readText(join(root, op.path));
		if (op.after.exists && current === undefined)
			found.push({ path: op.path, reason: "deleted" });
		else if (!op.after.exists && current !== undefined) {
			found.push({ path: op.path, reason: "recreated" });
		} else if (current !== undefined && sha256(current) !== op.after.hash) {
			found.push({ path: op.path, reason: "edited" });
		}
	}
	return found;
}

/** Re-hashes files changed after commit by a tool we ran (the package manager on package.json). */
export async function amend(root: string, journal: Journal, paths: readonly string[]) {
	const ops = await Promise.all(
		journal.ops.map(async (op) => {
			if (!paths.includes(op.path)) return op;
			const current = await readText(join(root, op.path));
			return {
				...op,
				after: {
					exists: current !== undefined,
					hash: current === undefined ? undefined : sha256(current),
				},
			};
		}),
	);
	const next: Journal = { ...journal, ops };
	const file = join(historyDir(root), journal.id, "journal.json");
	await writeFile(file, `${JSON.stringify(next, null, "\t")}\n`);
	return next;
}

/** Restores every file the journal touched, as a new journal that can itself be reverted. */
export async function revert(root: string, journal: Journal): Promise<Journal> {
	const dir = join(historyDir(root), journal.id);
	const ops: FileOp[] = [];
	for (const op of [...journal.ops].reverse()) {
		const content = op.before.snapshot
			? await readFile(join(dir, op.before.snapshot), "utf8")
			: null;
		ops.push({ path: join(root, op.path), content });
	}
	const result = await commit(root, `revert ${journal.id}`, ops, {
		revertOf: journal.id,
	});
	await removeEmptyDirs(root, journal.createdDirs);
	// The commit may have pruned this journal if it was the oldest one kept.
	if (existsSync(dir)) {
		const marked: Journal = { ...journal, revertedBy: result.id };
		await writeFile(join(dir, "journal.json"), `${JSON.stringify(marked, null, "\t")}\n`);
	}
	return result;
}
