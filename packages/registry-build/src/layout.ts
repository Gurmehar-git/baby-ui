import { existsSync, statSync } from "node:fs";
import { basename, posix } from "node:path";
import { type ComponentSpec, type Framework, installDir } from "@baby-ui/registry-schema";
import { FRAMEWORK } from "./config";
import { sourcePath } from "./sources";

/** Where a framework's installed files land and how shipped files import each other. */
export interface InstallLayout {
	/** The registry `target` for one of `spec`'s files, in the form that framework's CLI expects. */
	target(spec: ComponentSpec, path: string, type: string): string;
	/** Project-relative path of an installed file, for the Manual install view. */
	projectPath(target: string, type: string): string;
	/** Rewrites monorepo-relative imports (`../dialog/dialog`) to the consumer's aliases. */
	rewriteImports(source: string): string;
	/** Shipped source as a reader copies it: alias placeholders resolved to the default aliases. */
	display(source: string): string;
	/** Import path a reader uses for an installed item, e.g. `@/components/og/og-blog-post`. */
	itemImport(slug: string): string;
}

const RELATIVE_IMPORT = /(from\s+|import\s+)(["'])(\.[^"']+)\2/g;
const isLib = (type: string) => type === "registry:lib" || type === "registry:hook";

/** Built from every spec, so an import into another item's folder finds that item's category. */
export function installLayout(
	framework: Framework,
	specs: readonly ComponentSpec[],
): InstallLayout {
	const {
		uiTarget,
		libTarget,
		uiAlias,
		libAlias,
		componentsAlias,
		readerAliases = {},
		aliasRelativeTargets,
		aliasExtensions,
	} = FRAMEWORK[framework];
	// Imports arrive one folder deep (`../x/y`), whichever layout the file was read from.
	const isFolder = (rest: string) => {
		const abs = sourcePath(framework, rest);
		return existsSync(abs) && statSync(abs).isDirectory();
	};
	const withExtension = (rest: string) => {
		if (isFolder(rest)) return `${rest}/index.js`;
		return existsSync(sourcePath(framework, rest)) ? rest : `${rest}.js`;
	};
	// shadcn resolves an import with no exact file by basename, turning `chart` into `chart/chart`.
	const toBarrel = (rest: string) => (isFolder(rest) ? `${rest}/index` : rest);
	const componentsTarget = uiTarget.replace(/\/ui$/, "");
	const alias = (dir: string) => (dir === "ui" ? uiAlias : `${componentsAlias}/${dir}`);
	const display = (source: string) =>
		Object.entries(readerAliases).reduce(
			(text, [placeholder, path]) => text.replaceAll(placeholder, path),
			source,
		);

	const folderDir = new Map<string, string>();
	const slugDir = new Map<string, string>();
	for (const spec of specs) {
		slugDir.set(spec.slug, installDir(spec));
		for (const impl of [spec.impl.react, spec.impl.svelte])
			for (const file of impl?.files ?? []) {
				const [folder] = file.path.split("/");
				if (folder && folder !== "lib" && file.path.includes("/"))
					folderDir.set(folder, installDir(spec));
			}
	}

	return {
		target(spec, path, type) {
			if (isLib(type))
				return aliasRelativeTargets ? basename(path) : `${libTarget}/${basename(path)}`;
			const dir = installDir(spec);
			// shadcn-svelte resolves a target from the ui alias; shadcn from the project root.
			if (aliasRelativeTargets) return dir === "ui" ? path : `../${dir}/${path}`;
			return `${componentsTarget}/${dir}/${path}`;
		},
		projectPath(target, type) {
			if (!aliasRelativeTargets) return target;
			return posix.normalize(`${isLib(type) ? libTarget : uiTarget}/${target}`);
		},
		rewriteImports(source) {
			return source.replace(
				RELATIVE_IMPORT,
				(_m, keyword: string, q: string, spec: string) => {
					let next = spec.replace(/\.js$/, "");
					if (next.startsWith("../")) {
						const raw = next.slice("../".length);
						const rest = aliasExtensions ? withExtension(raw) : toBarrel(raw);
						next = raw.startsWith("lib/")
							? `${libAlias}/${rest.slice("lib/".length)}`
							: `${alias(folderDir.get(raw.split("/")[0] ?? "") ?? "ui")}/${rest}`;
					}
					return `${keyword}${q}${next}${q}`;
				},
			);
		},
		display,
		itemImport(slug) {
			const path = `${alias(slugDir.get(slug) ?? "ui")}/${slug}`;
			return display(aliasExtensions ? `${path}/index.js` : path);
		},
	};
}
