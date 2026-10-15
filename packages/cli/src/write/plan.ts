import { existsSync, readFileSync } from "node:fs";
import {
	basename,
	dirname,
	extname,
	isAbsolute,
	join,
	relative,
	resolve,
	sep,
} from "node:path";
import { CliError } from "../errors.ts";
import { toPosix } from "../project/fs.ts";
import { type InstallConfig, resolveAlias } from "../project/paths.ts";
import type { ResolvedItem } from "../registry/graph.ts";
import { registryOrigin } from "../registry/resolve.ts";
import type { RegistryFile, RegistryItem } from "../registry/schema.ts";
import { type CssPatch, patchCss } from "../transform/css.ts";
import { transformScript } from "../transform/imports.ts";
import { replacePlaceholders } from "../transform/svelte.ts";

export interface PlannedFile {
	readonly path: string;
	readonly content: string;
	readonly itemUrl: string;
	/** The project the file belongs to: the app, or the workspace ui package. */
	readonly root: string;
}

/** npm packages to add to one project's package.json. */
export interface PackageInstall {
	readonly config: InstallConfig;
	readonly dependencies: readonly string[];
	readonly devDependencies: readonly string[];
}

export interface Plan {
	readonly config: InstallConfig;
	readonly items: readonly ResolvedItem[];
	readonly files: readonly PlannedFile[];
	readonly css:
		| { readonly path: string; readonly content: string; readonly root: string }
		| undefined;
	readonly installs: readonly PackageInstall[];
	readonly warnings: readonly string[];
}

const WORKSPACE_TYPES = new Set(["registry:ui", "registry:lib", "registry:hook"]);

const SCRIPT = new Set([".ts", ".tsx", ".js", ".jsx"]);
const THEME_TYPES = new Set(["registry:style", "registry:theme"]);

function aliasDirFor(type: string, cfg: InstallConfig): string {
	const { paths, project } = cfg;
	if (type === "registry:ui") return paths.ui;
	if (type === "registry:lib") return paths.lib;
	if (type === "registry:hook") return paths.hooks;
	if (cfg.framework === "svelte") {
		if (["registry:file", "registry:font", "registry:base"].includes(type))
			return project.root;
		if (type === "registry:page" && project.meta === "sveltekit") {
			return join(project.root, "src", "routes");
		}
	}
	return paths.components;
}

// shadcn keeps the part of `path` after the last segment of the target dir's name.
function nestedPath(filePath: string, targetDir: string): string {
	const segments = filePath.replace(/^\/|\/$/g, "").split("/");
	const last = targetDir
		.replace(/[\\/]+$/, "")
		.split(/[\\/]/)
		.at(-1);
	const index = segments.indexOf(last ?? "");
	return index === -1
		? (segments.at(-1) ?? filePath)
		: segments.slice(index + 1).join("/");
}

function nextRouter(cfg: InstallConfig): "next-app" | "next-pages" {
	const root = cfg.project.root;
	const app = ["app", join("src", "app")].some((dir) => existsSync(join(root, dir)));
	return app ? "next-app" : "next-pages";
}

function pageTarget(target: string, cfg: InstallConfig): string | undefined {
	const meta = cfg.project.meta;
	const router = meta === "next" ? nextRouter(cfg) : meta;
	if (router === "next-app") return target;
	const strip = (t: string) => t.replace(/\/page(\.[jt]sx?)$/, "$1");
	if (router === "next-pages") return strip(target.replace(/^app\//, "pages/"));
	if (router === "react-router") return strip(target.replace(/^app\//, "app/routes/"));
	return undefined;
}

const ALIAS_TARGET = /^@(components|ui|lib|hooks)\/(.+)$/;

function reactPath(file: RegistryFile, cfg: InstallConfig): string | undefined {
	const cwd = cfg.project.root;
	if (!file.target) {
		const dir = aliasDirFor(file.type, cfg);
		return join(dir, nestedPath(file.path, dir));
	}
	if (file.target.startsWith("~/")) return join(cwd, file.target.slice(2));
	const alias = ALIAS_TARGET.exec(file.target);
	if (alias?.[1] && alias[2]) {
		const key = alias[1];
		const base =
			key === "components" || key === "ui" || key === "lib"
				? cfg.paths[key]
				: cfg.paths.hooks;
		const path = resolve(base, alias[2]);
		if (!path.startsWith(`${resolve(base)}${sep}`)) {
			throw new CliError(`Target ${file.target} escapes the ${key} alias.`);
		}
		return path;
	}
	let target = file.target.replace(/^@/, "");
	if (file.type === "registry:page") {
		const page = pageTarget(target, cfg);
		if (!page) return undefined;
		target = page;
	}
	const rest = target.replace("src/", "");
	return cfg.srcDir ? join(cwd, "src", rest) : join(cwd, rest);
}

function sveltePath(item: RegistryItem, file: RegistryFile, cfg: InstallConfig): string {
	const cwd = cfg.project.root;
	const target = file.target ?? basename(file.path);
	if (target.startsWith("~/")) return resolve(cwd, target.slice(2));
	if (item.name === "utils") {
		return /\.(ts|js)$/.test(cfg.paths.utils) ? cfg.paths.utils : `${cfg.paths.utils}.ts`;
	}
	const type = file.type === "registry:file" ? item.type : file.type;
	return resolve(aliasDirFor(type, cfg), target);
}

function transformFile(
	file: RegistryFile,
	path: string,
	cfg: InstallConfig,
	resolve: (original: string, rewritten: string) => string,
): string {
	const content = file.content ?? "";
	if (cfg.framework === "svelte") return replacePlaceholders(content, cfg.aliases);
	if (file.type === "registry:file" || file.type === "registry:item") return content;
	if (!SCRIPT.has(extname(path))) return content;
	return transformScript(content, file.path, {
		aliases: { ...cfg.declaredAliases, components: cfg.aliases.components },
		stripUseClient: !cfg.rsc,
		resolve,
	});
}

const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];
const stripExt = (p: string) => p.replace(/\.[cm]?[jt]sx?$/, "");

/** The `@/` id other registry files import this file by: its target, minus `src/` and extension. */
function moduleId(file: RegistryFile): string {
	return stripExt((file.target ?? file.path).replace(/^~\//, "").replace(/^src\//, ""));
}

function candidates(base: string): string[] {
	return [
		base,
		...EXTENSIONS.map((e) => base + e),
		...EXTENSIONS.map((e) => join(base, `index${e}`)),
	];
}

function aliasedImport(target: string, cfg: InstallConfig): string | undefined {
	const match = [...cfg.project.aliases]
		.filter((a) => {
			const rest = relative(a.dir, target);
			return !rest.startsWith("..") && !isAbsolute(rest);
		})
		.sort((a, b) => b.dir.length - a.dir.length)[0];
	if (!match) return undefined;
	const rest = toPosix(relative(match.dir, target));
	return `${match.prefix}${match.withExtension ? rest : stripExt(rest)}`;
}

// shadcn's planned-path pass: an `@/` import that no longer lands on a file is re-pointed at the
// file this install places for it (our targets keep folders a workspace ui alias flattens).
function repoint(
	original: string,
	rewritten: string,
	importer: string,
	cfg: InstallConfig,
	modules: Map<string, string>,
	planned: Set<string>,
): string {
	if (!original.startsWith("@/") || original === rewritten) return rewritten;
	const base = resolveAlias(rewritten, cfg.project);
	if (base && candidates(base).some((c) => planned.has(c) || existsSync(c)))
		return rewritten;
	const id = original.slice(2);
	const target = modules.get(id) ?? modules.get(`${id}/index`);
	if (!target) return rewritten;
	const aliased = aliasedImport(target, cfg);
	if (aliased) return aliased;
	const rel = toPosix(relative(dirname(importer), stripExt(target)));
	return rel.startsWith(".") ? rel : `./${rel}`;
}

const fromUs = (url: string) =>
	url.startsWith(registryOrigin()) || url.startsWith("file:");

function stylesheet(
	cfg: InstallConfig,
	patches: CssPatch[],
	cssSource: string | undefined,
	warnings: string[],
): Plan["css"] {
	const path = cfg.paths.css;
	const root = cfg.project.root;
	const exists = path !== undefined && existsSync(path);
	if (path && !exists && cssSource !== undefined) {
		return { path, root, content: patchCss(cssSource, patches, cfg.framework) };
	}
	if (!patches.length) return undefined;
	if (!path || !exists) {
		warnings.push(`CSS changes skipped: tailwind.css (${path ?? "unset"}) not found.`);
		return undefined;
	}
	const source = readFileSync(path, "utf8");
	const next = patchCss(source, patches, cfg.framework);
	return next === source ? undefined : { path, root, content: next };
}

/**
 * Computes every write an install would make. With `workspace`, ui/lib/hook files, their
 * packages and the CSS go to the ui package, like shadcn; `cssSource` seeds init's stylesheet.
 */
export function planInstall(
	cfg: InstallConfig,
	items: readonly ResolvedItem[],
	cssSource?: string,
	workspace?: InstallConfig,
): Plan {
	const files: PlannedFile[] = [];
	const patches: CssPatch[] = [];
	const warnings: string[] = [];
	const placed: Array<{
		file: RegistryFile;
		path: string;
		cfg: InstallConfig;
		url: string;
	}> = [];
	const buckets = new Map<InstallConfig, { deps: Set<string>; devDeps: Set<string> }>();
	const cfgFor = (type: string) =>
		workspace && WORKSPACE_TYPES.has(type) ? workspace : cfg;
	const styleOwner = workspace ?? cfg;

	for (const { url, item } of items) {
		if (!cfg.typescript && !fromUs(url) && item.files?.length) {
			throw new CliError(
				`${item.name} ships TypeScript; JavaScript projects need our JS route.`,
				{
					hint: `Only Baby UI items have a JS build. Source: ${url}`,
				},
			);
		}
		const owners = (item.files ?? []).map((f) => cfgFor(f.type));
		const owner = owners.includes(styleOwner) || !owners.length ? styleOwner : cfg;
		const bucket = buckets.get(owner) ?? { deps: new Set(), devDeps: new Set() };
		buckets.set(owner, bucket);
		for (const dep of item.dependencies ?? []) bucket.deps.add(dep);
		for (const dep of item.devDependencies ?? []) bucket.devDeps.add(dep);
		if (item.cssVars || item.css) {
			patches.push({
				cssVars: item.cssVars,
				css: item.css,
				overwriteVars: THEME_TYPES.has(item.type),
			});
		}
		for (const file of item.files ?? []) {
			if (file.content === undefined) continue;
			const fileCfg = cfgFor(file.type);
			const path =
				fileCfg.framework === "react"
					? reactPath(file, fileCfg)
					: sveltePath(item, file, fileCfg);
			if (!path) {
				warnings.push(`Skipped ${file.path}: no page route for this framework.`);
				continue;
			}
			placed.push({ file, path, cfg: fileCfg, url });
		}
	}

	const modules = new Map(placed.map((p) => [moduleId(p.file), p.path]));
	const planned = new Set(placed.map((p) => p.path));
	for (const { file, path, cfg: fileCfg, url } of placed) {
		const fix = (original: string, rewritten: string) =>
			repoint(original, rewritten, path, fileCfg, modules, planned);
		files.push({
			path,
			content: transformFile(file, path, fileCfg, fix),
			itemUrl: url,
			root: fileCfg.project.root,
		});
	}

	return {
		config: cfg,
		items,
		files: dedupe(files),
		css: stylesheet(styleOwner, patches, cssSource, warnings),
		installs: [...buckets].map(([config, b]) => ({
			config,
			dependencies: [...b.deps],
			devDependencies: [...b.devDeps],
		})),
		warnings,
	};
}

// Two items shipping the same file (a shared lib) keep the last writer, like shadcn.
function dedupe(files: PlannedFile[]): PlannedFile[] {
	return [...new Map(files.map((f) => [f.path, f])).values()];
}
