import { existsSync } from "node:fs";
import { join } from "node:path";
import { CliError } from "../errors.ts";
import { c } from "../logger.ts";
import { parseComponentsConfig } from "../project/config.ts";
import type { Json } from "../project/fs.ts";
import { installConfig, resolveAlias } from "../project/paths.ts";
import { selectTargets } from "../project/select.ts";
import {
	discoverTargets,
	findWorkspace,
	type Target,
	targetAt,
} from "../project/targets.ts";
import { BABY_UI_ORIGIN } from "../registry/resolve.ts";
import { intro, message, outro, text } from "../ui/index.ts";
import type { FileOp } from "../write/tx.ts";
import { installInto } from "./add.ts";
import type { CommonOptions } from "./shared.ts";

export interface InitOptions extends CommonOptions {
	readonly css?: string;
	readonly base?: boolean;
	readonly install?: boolean;
	readonly dryRun?: boolean;
	readonly force?: boolean;
}

const CSS_CANDIDATES = {
	react: [
		"src/app/globals.css",
		"app/globals.css",
		"src/index.css",
		"src/styles/globals.css",
		"styles/globals.css",
		"app/app.css",
	],
	svelte: ["src/app.css", "src/routes/layout.css", "src/styles/app.css", "src/index.css"],
} as const;

const REACT_UTILS = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
`;

const JS_UTILS = `import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}
`;

// shadcn-svelte components import these helper types from utils as well as cn.
const SVELTE_UTILS = `${REACT_UTILS}
export type WithoutChild<T> = T extends { child?: unknown } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: unknown } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
`;

async function pickTarget(options: InitOptions): Promise<Target> {
	const workspace = await findWorkspace(options.cwd);
	const all = await discoverTargets(workspace);
	const here = targetAt(all, options.cwd);
	if (here && !options.target?.length) return here;
	const pool = options.target?.length ? all : all.filter((t) => !t.config);
	const [picked] = await selectTargets(pool.length ? pool : all, options.cwd, options);
	if (!picked) throw new CliError("No project selected.");
	return picked;
}

function reactConfig(target: Target, css: string): Json {
	const alias =
		target.aliases.find((a) => a.prefix === "@/") ??
		target.aliases.find((a) => !a.withExtension);
	if (!alias) {
		throw new CliError("No import alias found for React components.", {
			hint: 'Add `"paths": { "@/*": ["./src/*"] }` to tsconfig.json compilerOptions.',
		});
	}
	const p = alias.prefix.replace(/\/$/, "");
	const app = ["app", join("src", "app")].some((d) => existsSync(join(target.root, d)));
	return {
		$schema: "https://ui.shadcn.com/schema.json",
		style: "new-york",
		rsc: target.meta === "next" && app,
		tsx: existsSync(join(target.root, "tsconfig.json")),
		tailwind: { config: "", css, baseColor: "neutral", cssVariables: true, prefix: "" },
		iconLibrary: "lucide",
		aliases: {
			components: `${p}/components`,
			utils: `${p}/lib/utils`,
			ui: `${p}/components/ui`,
			lib: `${p}/lib`,
			hooks: `${p}/hooks`,
		},
		// Lets the stock shadcn CLI install Baby UI (and, with a token, Pro) items too.
		registries: {
			"@baby-ui": `${BABY_UI_ORIGIN}/r/{name}.json`,
			"@baby-ui-pro": {
				url: `${BABY_UI_ORIGIN}/pro/r/{name}.json`,
				// biome-ignore lint/suspicious/noTemplateCurlyInString: shadcn expands ${VAR} itself
				headers: { Authorization: "Bearer ${BABY_UI_TOKEN}" },
			},
		},
	};
}

function svelteConfig(target: Target, css: string): Json {
	const hashLib = target.aliases.some((a) => a.prefix === "#lib/");
	const lib = hashLib ? "#lib" : "$lib";
	return {
		$schema: "https://shadcn-svelte.com/schema.json",
		tailwind: { css, baseColor: "neutral" },
		aliases: {
			components: `${lib}/components`,
			utils: `${lib}/utils`,
			ui: `${lib}/components/ui`,
			hooks: `${lib}/hooks`,
			lib,
		},
		typescript: existsSync(join(target.root, "tsconfig.json")),
		registry: "https://shadcn-svelte.com/registry",
	};
}

export async function init(options: InitOptions, version: string): Promise<void> {
	const { printBanner } = await import("../ui/banner.ts");
	printBanner(version);
	const target = await pickTarget(options);
	const framework = target.framework;
	if (!framework) throw new CliError(`${target.path} is not a React or Svelte project.`);
	intro(
		`baby-ui init ${c.dim(`${target.path} (${framework}, ${target.meta ?? "unknown"})`)}`,
	);

	if (target.config && !options.force) {
		message(
			`components.json already exists; installing the theme only. ${c.dim("--force rewrites it")}`,
		);
		if (options.base !== false) {
			await installInto(target, {
				...options,
				items: ["theme"],
				command: "init (theme)",
			});
		}
		outro("Done");
		return;
	}

	const found = CSS_CANDIDATES[framework].find((p) => existsSync(join(target.root, p)));
	const css =
		options.css ??
		(await text({
			message: "Where is your global CSS file?",
			defaultValue: found ?? CSS_CANDIDATES[framework][0],
			placeholder: found ?? CSS_CANDIDATES[framework][0],
		}));
	const raw =
		framework === "react" ? reactConfig(target, css) : svelteConfig(target, css);
	const project: Target = { ...target, config: parseComponentsConfig(raw) };
	const cfg = installConfig(project);

	const base = options.base !== false;
	if (!target.dependencies.has("tailwindcss")) {
		message(c.yellow("Tailwind CSS v4 is not installed; components need it."));
	}

	const ext = cfg.typescript ? ".ts" : ".js";
	const utils = `${resolveAlias(cfg.aliases.utils, project) ?? cfg.paths.utils}${ext}`;
	const preOps: FileOp[] = [
		{
			path: join(target.root, "components.json"),
			content: `${JSON.stringify(raw, null, 2)}\n`,
		},
	];
	if (!existsSync(utils)) {
		const content = !cfg.typescript
			? JS_UTILS
			: framework === "svelte"
				? SVELTE_UTILS
				: REACT_UTILS;
		preOps.push({ path: utils, content });
	}

	await installInto(
		project,
		{ ...options, items: base ? ["theme"] : [], command: "init" },
		{
			preOps,
			dependencies: ["clsx", "tailwind-merge"],
			cssSource: '@import "tailwindcss";\n',
		},
	);
	outro(`Ready. Add components with ${c.brand("baby-ui add button")}`);
}
