import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { CliError } from "../errors.ts";
import type { Project } from "./detect.ts";

export const ALIAS_KEYS = ["components", "ui", "lib", "hooks", "utils"] as const;
export type AliasKey = (typeof ALIAS_KEYS)[number];

export interface InstallConfig {
	readonly project: Project;
	readonly framework: "react" | "svelte";
	readonly typescript: boolean;
	readonly srcDir: boolean;
	/** Alias strings as written in components.json, with each CLI's defaults filled in. */
	readonly aliases: Readonly<Record<AliasKey, string>>;
	/** Only the aliases components.json sets; shadcn's import rewrite branches on absence. */
	readonly declaredAliases: Readonly<Partial<Record<AliasKey, string>>>;
	readonly paths: Readonly<Record<AliasKey, string>> & {
		readonly css: string | undefined;
	};
}

/** Resolves an import alias (`@/components`, `$lib/hooks`, `#lib/ui`) to a directory. */
export function resolveAlias(alias: string, project: Project): string | undefined {
	const sorted = [...project.aliases].sort((a, b) => b.prefix.length - a.prefix.length);
	for (const { prefix, dir } of sorted) {
		if (alias === prefix.slice(0, -1)) return dir;
		if (alias.startsWith(prefix)) return join(dir, alias.slice(prefix.length));
	}
	if (project.dollarLib && (alias === "$lib" || alias.startsWith("$lib/"))) {
		return join(project.root, "src", "lib", alias.slice("$lib".length));
	}
	return undefined;
}

function svelteAliases(raw: Record<string, string>): Record<AliasKey, string> {
	const lib = raw.lib ?? "$lib";
	return {
		components: raw.components ?? `${lib}/components`,
		ui: raw.ui ?? `${raw.components ?? `${lib}/components`}/ui`,
		lib,
		hooks: raw.hooks ?? `${lib}/hooks`,
		utils: raw.utils ?? `${lib}/utils`,
	};
}

function reactAliases(raw: Record<string, string>): Record<AliasKey, string> {
	const components = raw.components ?? "@/components";
	const utils = raw.utils ?? "@/lib/utils";
	return {
		components,
		ui: raw.ui ?? `${components}/ui`,
		lib: raw.lib ?? utils.replace(/\/[^/]+$/, ""),
		hooks: raw.hooks ?? `${components.replace(/\/[^/]+$/, "")}/hooks`,
		utils,
	};
}

/** The resolved install config for a project that has a components.json. */
export function installConfig(project: Project): InstallConfig {
	const config = project.config;
	const framework = project.framework;
	if (!config || !framework) {
		throw new CliError(`${project.root} has no components.json.`, {
			hint: "Run `baby-ui init` there first.",
		});
	}
	const aliases =
		framework === "svelte" ? svelteAliases(config.aliases) : reactAliases(config.aliases);
	const missing: string[] = [];
	const need = (key: AliasKey) => {
		const dir = resolveAlias(aliases[key], project);
		if (!dir) missing.push(`${key} (${aliases[key]})`);
		return dir ?? "";
	};
	const paths = {
		components: need("components"),
		ui: need("ui"),
		lib: need("lib"),
		hooks: need("hooks"),
		utils: need("utils"),
	};
	if (missing.length) {
		throw new CliError(
			`Could not resolve aliases in ${project.root}: ${missing.join(", ")}.`,
			{
				hint: "Map them in tsconfig.json `paths` or package.json `imports`.",
			},
		);
	}
	const raw = config.raw;
	const typescript =
		framework === "svelte" ? raw.typescript !== false : raw.tsx !== false;
	return {
		project,
		framework,
		typescript,
		srcDir: existsSync(join(project.root, "src")),
		aliases,
		declaredAliases: Object.fromEntries(
			ALIAS_KEYS.flatMap((key) => {
				const value = config.aliases[key];
				return value ? [[key, value]] : [];
			}),
		),
		paths: { ...paths, css: config.css ? resolve(project.root, config.css) : undefined },
	};
}
