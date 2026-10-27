import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
	ComponentDocRequiredSchema,
	type ComponentSpec,
	type Framework,
} from "@baby-ui/registry-schema";
import { type SpringName, spring } from "@baby-ui/tokens";
import { parse as parseYaml } from "yaml";
import { COMPONENTS_DIR, readSource, sourcePath } from "./sources";

const ENTRY = /\b(snappy|gentle|bouncy)\s*:\s*\{([^}]*)\}/g;
const FIELD = /(\w+)\s*:\s*(-?[\d.]+)/g;

/**
 * Registry components are copied out standalone, so they inline their spring values
 * instead of importing @baby-ui/tokens. This is what keeps those copies honest.
 */
export async function verifySprings(
	specs: ComponentSpec[],
	framework: Framework,
): Promise<string[]> {
	const errors: string[] = [];

	for (const spec of specs) {
		const impl = spec.impl[framework];
		if (!impl) continue;

		for (const file of impl.files) {
			const source = await readSource(framework, file.path).catch(() => null);
			if (!source) continue;

			for (const [, name, body] of source.matchAll(ENTRY)) {
				const expected =
					spring[name as SpringName][framework === "react" ? "motion" : "svelte"];
				const actual = Object.fromEntries(
					[...(body ?? "").matchAll(FIELD)].map(([, k, v]) => [k, Number(v)]),
				);
				for (const [key, value] of Object.entries(expected)) {
					if (actual[key] !== value) {
						errors.push(
							`${spec.slug} (${framework}) ${file.path}: spring.${name}.${key} is ${actual[key]}, tokens say ${value}`,
						);
					}
				}
			}
		}
	}
	return errors;
}

const SIBLING_IMPORT = /(?:from\s+|import\s+)["']\.\.\/([^/"']+)/g;
const LOCAL_IMPORT = /(?:from\s+|import\s+)["']\.\/([^"']+)["']/g;
const LOCAL_EXTENSIONS = ["", ".ts", ".tsx", ".svelte", "/index.ts"];

/** Every folder a shipped file imports from must come with it, or the install breaks. */
export async function verifyRegistryDependencies(
	specs: ComponentSpec[],
	framework: Framework,
): Promise<string[]> {
	const errors: string[] = [];
	// A folder belongs to the spec named after it; other specs that list its files only borrow them.
	const owner = new Map<string, string>();
	for (const spec of specs)
		for (const file of spec.impl[framework]?.files ?? []) {
			const [folder] = file.path.split("/");
			if (!folder || folder === "lib" || !file.path.includes("/")) continue;
			if (folder === spec.slug || !owner.has(folder)) owner.set(folder, spec.slug);
		}

	const sources = await Promise.all(
		specs.map((spec) =>
			Promise.all(
				(spec.impl[framework]?.files ?? []).map((f) =>
					readSource(framework, f.path).catch(() => ""),
				),
			),
		),
	);
	for (const [index, spec] of specs.entries()) {
		const impl = spec.impl[framework];
		if (!impl) continue;
		const shipped = new Set(impl.files.map((f) => f.path.split("/")[0]));
		const shippedFiles = new Set(impl.files.map((f) => f.path));
		const declared = new Set(impl.registryDependencies ?? []);
		for (const [fileIndex, file] of impl.files.entries()) {
			const source = sources[index]?.[fileIndex] ?? "";
			const dir = file.path.split("/").slice(0, -1).join("/");
			for (const [, name = ""] of source.matchAll(LOCAL_IMPORT)) {
				const candidates = LOCAL_EXTENSIONS.map((ext) =>
					dir ? `${dir}/${name}${ext}` : `${name}${ext}`,
				);
				if (candidates.some((path) => shippedFiles.has(path))) continue;
				const onDisk = candidates.find((path) => existsSync(sourcePath(framework, path)));
				if (onDisk)
					errors.push(
						`${spec.slug} (${framework}) ${file.path}: imports ./${name}, so files needs "${onDisk}"`,
					);
			}
			for (const [, folder = ""] of source.matchAll(SIBLING_IMPORT)) {
				const dep = owner.get(folder);
				if (folder === "lib" || shipped.has(folder) || !dep || declared.has(dep))
					continue;
				errors.push(
					`${spec.slug} (${framework}) ${file.path}: imports ../${folder}, so registryDependencies needs "${dep}"`,
				);
			}
		}
	}
	return [...new Set(errors)];
}

/** A "When not to use" alternative must be another component that exists. */
export function verifyGuidance(specs: ComponentSpec[]): string[] {
	const known = new Set(specs.map((s) => s.slug));
	return specs.flatMap((spec) =>
		spec.guidance.whenNot.flatMap(({ use }) =>
			!use
				? []
				: use === spec.slug
					? [`${spec.slug}: guidance.whenNot points at itself`]
					: known.has(use)
						? []
						: [`${spec.slug}: guidance.whenNot uses "${use}", which is not a component`],
		),
	);
}

/** Cross-checks component docs against the specs (docvia validates the fields, not that a spec
 * exists or agrees). `missing` lists specs with no page yet. */
export async function verifyComponentDocs(
	specs: ComponentSpec[],
): Promise<{ errors: string[]; missing: string[] }> {
	const errors: string[] = [];
	const missing: string[] = [];
	const known = new Set(specs.map((s) => s.slug));
	const seen = new Set<string>();

	const dirs = await readdir(COMPONENTS_DIR).catch(() => [] as string[]);
	for (const dir of dirs) {
		const file = `components/${dir}/index.md`;
		const raw = await readFile(resolve(COMPONENTS_DIR, dir, "index.md"), "utf8").catch(
			() => null,
		);
		if (raw === null) continue;
		const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
		if (!match?.[1]) {
			errors.push(`${file}: no frontmatter`);
			continue;
		}

		const parsed = ComponentDocRequiredSchema.safeParse(parseYaml(match[1]));
		if (!parsed.success) {
			for (const issue of parsed.error.issues) {
				errors.push(`${file}: ${issue.path.join(".") || "(root)"} ${issue.message}`);
			}
			continue;
		}

		const { component, category } = parsed.data;
		seen.add(component);
		// docvia takes the page slug from the folder, so the two must agree.
		if (component !== dir) errors.push(`${file}: component is "${component}"`);
		if (!known.has(component)) {
			errors.push(`${file}: no spec for component "${component}"`);
			continue;
		}
		const spec = specs.find((s) => s.slug === component);
		if (spec && spec.category !== category) {
			errors.push(`${file}: category is "${category}", spec says "${spec.category}"`);
		}
	}

	for (const spec of specs) {
		if (!seen.has(spec.slug))
			missing.push(`${spec.slug}: no doc page at components/${spec.slug}/index.md`);
	}
	return { errors, missing };
}

const NAMED_IMPORT =
	/import\s+(?:type\s+)?(?:(\w+)\s*,\s*)?(?:\{([^}]*)\})?\s*(?:(\w+)\s+)?from\s+["'](@\/[^"']+)["']/g;
const DECLARED =
	/export\s+(?:declare\s+)?(?:async\s+)?(?:function\*?|const|let|var|class|interface|type|enum)\s+(\w+)/g;
const LISTED = /export\s+(?:type\s+)?\{([^}]*)\}(?:\s*from\s+["']([^"']+)["'])?/g;
const STAR = /export\s+\*\s+from\s+["']([^"']+)["']/g;

const names = (list: string) =>
	list
		.split(",")
		.map((part) => part.replace(/^\s*type\s+/, "").trim())
		.filter(Boolean)
		.map(
			(part) =>
				part
					.split(/\s+as\s+/)
					.pop()
					?.trim() ?? part,
		);

/**
 * Every named import between shipped React files must resolve to an emitted file that exports
 * it, or a consumer's `tsc` fails after install even though our monorepo builds.
 */
export function verifyEmittedImports(
	items: { name: string; files: { target?: string; content?: string }[] }[],
): string[] {
	const files = new Map<string, string>();
	for (const item of items)
		for (const file of item.files)
			if (file.target) files.set(file.target, file.content ?? "");

	const find = (path: string) =>
		[`${path}.tsx`, `${path}.ts`, `${path}/index.ts`, `${path}/index.tsx`, path].find(
			(p) => files.has(p),
		);
	const exportsOf = (target: string, seen = new Set<string>()): Set<string> => {
		const out = new Set<string>();
		if (seen.has(target)) return out;
		seen.add(target);
		const source = files.get(target) ?? "";
		for (const [, name = ""] of source.matchAll(DECLARED)) out.add(name);
		if (/export\s+default\b/.test(source)) out.add("default");
		for (const [, list = ""] of source.matchAll(LISTED))
			for (const n of names(list)) out.add(n);
		for (const [, from = ""] of source.matchAll(STAR)) {
			const dir = target.slice(0, target.lastIndexOf("/"));
			const next = find(`${dir}/${from.replace(/^\.\//, "")}`);
			if (next) for (const n of exportsOf(next, seen)) out.add(n);
		}
		return out;
	};

	const errors: string[] = [];
	for (const item of items)
		for (const file of item.files) {
			for (const [, first, list, only, spec = ""] of (file.content ?? "").matchAll(
				NAMED_IMPORT,
			)) {
				const path = spec.replace(/^@\//, "");
				const target = find(path);
				// The shadcn CLI resolves a bare folder by basename, so `chart` would become `chart/chart`.
				if (target?.startsWith(`${path}/index.`)) {
					errors.push(
						`${item.name} ${file.target}: "${spec}" is a folder; import "${spec}/index"`,
					);
					continue;
				}
				if (!target) {
					errors.push(`${item.name} ${file.target}: "${spec}" matches no shipped file`);
					continue;
				}
				const wanted = [...names(list ?? ""), ...(first || only ? ["default"] : [])];
				const available = exportsOf(target);
				for (const name of wanted)
					if (!available.has(name))
						errors.push(`${item.name} ${file.target}: "${spec}" has no export "${name}"`);
			}
		}
	return [...new Set(errors)];
}
