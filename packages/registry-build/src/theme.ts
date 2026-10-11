import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import {
	type Framework,
	REGISTRY_ITEM_SCHEMA_URL,
	type RegistryItem,
	RegistryItemSchema,
} from "@baby-ui/registry-schema";
import postcss, {
	type AtRule,
	type ChildNode,
	type Declaration,
	type Rule,
} from "postcss";
import { FRAMEWORK, REGISTRY_URL, SITE_URL } from "./config";

type Vars = Record<string, string>;
type Css = { [key: string]: string | Css };

/** Variables a shadcn project already defines; `tokens` must not overwrite them. */
const SHADCN_VARS = new Set(
	[
		"background",
		"foreground",
		"card",
		"card-foreground",
		"popover",
		"popover-foreground",
		"primary",
		"primary-foreground",
		"secondary",
		"secondary-foreground",
		"muted",
		"muted-foreground",
		"accent",
		"accent-foreground",
		"destructive",
		"destructive-foreground",
		"border",
		"input",
		"ring",
		"radius",
		"chart-1",
		"chart-2",
		"chart-3",
		"chart-4",
		"chart-5",
	].flatMap((n) => [`--${n}`, `--color-${n}`]),
);
const SHADCN_THEME = new Set([
	"--radius-sm",
	"--radius-md",
	"--radius-lg",
	"--radius-xl",
	"--font-sans",
	"--font-mono",
]);

const tokensDir = dirname(
	createRequire(import.meta.url).resolve("@baby-ui/tokens/theme.css"),
);

function decls(node: Rule | AtRule): Vars {
	const out: Vars = {};
	node.each((child) => {
		if (child.type === "decl") out[child.prop] = value(child);
	});
	return out;
}

function value(decl: Declaration): string {
	const v = decl.value.replace(/\s+/g, " ");
	return decl.important ? `${v} !important` : v;
}

function nested(node: Rule | AtRule): Css {
	const out: Css = {};
	node.each((child) => {
		if (child.type === "decl") out[child.prop] = value(child);
		else if (child.type === "rule" || child.type === "atrule")
			merge(out, key(child), nested(child));
	});
	return out;
}

function key(node: Rule | AtRule): string {
	const raw = node.type === "rule" ? node.selector : `@${node.name} ${node.params}`;
	return raw.replace(/\s+/g, " ").trim();
}

function merge(into: Css, k: string, value: Css) {
	const prev = into[k];
	into[k] = prev && typeof prev === "object" ? { ...prev, ...value } : value;
}

type Split = { light: Vars; dark: Vars; theme: Vars; css: Css };

// :root and .dark become cssVars, @theme becomes cssVars.theme, everything else is css.
async function split(file: string): Promise<Split> {
	const root = postcss.parse(await readFile(resolve(tokensDir, file), "utf8"));
	const out: Split = { light: {}, dark: {}, theme: {}, css: {} };
	root.each((node: ChildNode) => {
		if (node.type === "rule" && node.selector === ":root")
			Object.assign(out.light, decls(node));
		else if (node.type === "rule" && node.selector === ".dark")
			Object.assign(out.dark, decls(node));
		else if (node.type === "atrule" && node.name === "theme")
			Object.assign(out.theme, decls(node));
		else if (node.type === "atrule" && ["import", "custom-variant"].includes(node.name))
			return;
		else if (node.type === "rule" || node.type === "atrule")
			merge(out.css, key(node), nested(node));
	});
	return out;
}

function pick(vars: Vars, keep: (name: string) => boolean): Vars {
	return Object.fromEntries(Object.entries(vars).filter(([name]) => keep(name)));
}

type VarGroups = Record<string, Record<string, string> | undefined>;

/** shadcn adds the `--` itself; a key that already has one installs as `var(----name)`. */
export function bareVars<T extends VarGroups>(groups: T): T {
	return Object.fromEntries(
		Object.entries(groups).map(([group, vars]) => [
			group,
			vars &&
				Object.fromEntries(
					Object.entries(vars).map(([k, v]) => [k.replace(/^--/, ""), v]),
				),
		]),
	) as T;
}

function item(
	framework: Framework,
	partial: Partial<RegistryItem> & { name: string },
): RegistryItem {
	return RegistryItemSchema.parse({
		$schema: REGISTRY_ITEM_SCHEMA_URL[framework],
		files: [],
		meta: { docs: `${SITE_URL}/docs/installation` },
		...partial,
		cssVars: partial.cssVars && bareVars(partial.cssVars as VarGroups),
	});
}

export function tokensUrl(framework: Framework, name = "tokens"): string {
	return `${REGISTRY_URL}/${FRAMEWORK[framework].routePrefix}/${name}.json`;
}

/** Opt-in token layers: `vars` picks a layer's variables, `uses` spots them in a component's
 * source, so one button never pulls chart scales or glass. */
export const TOKEN_LAYERS = [
	{
		name: "tokens-charts",
		title: "Chart tokens",
		description: "Sequential scales and positive/negative colours for charts.",
		vars: /^--(color-)?chart-(scale-\d|positive|negative)$/,
		uses: /chart-(scale-\d|positive|negative)/,
	},
	{
		name: "tokens-effects",
		title: "Effect tokens",
		description: "Glass, brand gradients and the neon and violet highlights.",
		vars: /^--(color-)?(glass-|gradient-|neon$|violet$)|^--background-image-brand-/,
		uses: /glass-(bg|border)|gradient-(bg|accent)|brand-(bg|accent)|(?:-|var\(--)(?:neon|violet)(?![\w-])/,
	},
] as const;

/** The opt-in layers a component's shipped sources read. */
export function tokenLayerUrls(framework: Framework, sources: string[]): string[] {
	const text = sources.join("\n");
	return TOKEN_LAYERS.filter((layer) => layer.uses.test(text)).map((layer) =>
		tokensUrl(framework, layer.name),
	);
}

/**
 * `tokens`: the motion layer and the variables shadcn lacks, which every component
 * depends on. `theme`: the full palette, for projects adopting the look wholesale.
 */
export async function buildThemeItems(framework: Framework): Promise<RegistryItem[]> {
	const palette = await split("tokens.css");
	const motion = await split("motion.css");
	const theme = await split("theme.css");
	const tailwind = await tailwindThemeKeys();

	// Fonts travel with the theme: a project keeps its own type stack until it adopts the look.
	const layered = (name: string) => TOKEN_LAYERS.some((layer) => layer.vars.test(name));
	const additive = (name: string) =>
		!SHADCN_VARS.has(name) && !name.startsWith("--font-") && !tailwind.has(name);
	const extension = (name: string) => additive(name) && !layered(name);
	// `@layer base` (cursor) restyles the host's own buttons, so only `theme` carries it.
	const { "@layer base": base, ...additiveCss } = palette.css;
	const tokens = item(framework, {
		name: "tokens",
		type: "registry:style",
		title: "Tokens",
		description:
			"Motion variables, keyframes and the colour names components use beyond shadcn's set.",
		cssVars: {
			theme: pick({ ...theme.theme }, (n) => extension(n) && !SHADCN_THEME.has(n)),
			light: { ...pick(palette.light, extension), ...motion.light },
			dark: pick(palette.dark, extension),
		},
		// Class rules travel with the component that uses them (see cssFor); only the
		// global bits stay here.
		css: { ...additiveCss, ...globalOnly(motion.css) },
	});
	assertAdditive(tokens, tailwind);

	const layers = TOKEN_LAYERS.map((layer) => {
		const inLayer = (name: string) => additive(name) && layer.vars.test(name);
		const built = item(framework, {
			name: layer.name,
			type: "registry:style",
			title: layer.title,
			description: layer.description,
			registryDependencies: [tokensUrl(framework)],
			cssVars: {
				theme: pick({ ...theme.theme }, inLayer),
				light: pick(palette.light, inLayer),
				dark: pick(palette.dark, inLayer),
			},
		});
		assertAdditive(built, tailwind);
		return built;
	});

	const standard = (name: string) => SHADCN_VARS.has(name) || name.startsWith("--font-");
	const full = item(framework, {
		name: "theme",
		type: "registry:theme",
		title: "Theme",
		description: "The full palette, radius and type stack, replacing shadcn's defaults.",
		registryDependencies: [
			tokensUrl(framework),
			...TOKEN_LAYERS.map((layer) => tokensUrl(framework, layer.name)),
		],
		cssVars: {
			// The whole @theme block, so bg-popover and friends exist even without `shadcn init`.
			theme: { ...theme.theme },
			light: pick(palette.light, standard),
			dark: pick(palette.dark, standard),
		},
		css: base && typeof base === "object" ? { "@layer base": base } : undefined,
	});

	return [tokens, ...layers, full];
}

let tailwindKeys: Promise<Set<string>> | undefined;

/** Every variable Tailwind's default theme defines; `tokens` must leave all of them alone. */
export function tailwindThemeKeys(): Promise<Set<string>> {
	tailwindKeys ??= readFile(
		createRequire(import.meta.url).resolve("tailwindcss/theme.css"),
		"utf8",
	).then(
		(css) => new Set([...css.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map((m) => m[1] ?? "")),
	);
	return tailwindKeys;
}

function declared(css: Css, out: string[] = []): string[] {
	for (const [k, v] of Object.entries(css)) {
		if (typeof v === "object") declared(v, out);
		else if (k.startsWith("--")) out.push(k);
	}
	return out;
}

/** `tokens` installs into apps that already have a theme: it may add variables, never redefine
 * shadcn's or Tailwind's. Throws so a regression fails the build, not a consumer's app. */
export function assertAdditive(tokens: RegistryItem, tailwind: Set<string>): void {
	const vars = Object.values(tokens.cssVars ?? {}).flatMap((group) =>
		Object.keys(group ?? {}).map((k) => `--${k}`),
	);
	const clashes = [...vars, ...declared((tokens.css ?? {}) as Css)].filter(
		(name) => SHADCN_VARS.has(name) || tailwind.has(name),
	);
	if (clashes.length)
		throw new Error(
			`tokens redefines host variables: ${[...new Set(clashes)].join(", ")}`,
		);
}

// Class rules ship with the component that uses them; only the :root overrides stay global.
function globalOnly(css: Css): Css {
	const out: Css = {};
	for (const [k, v] of Object.entries(css)) {
		if (k.startsWith("@media") && typeof v === "object" && v[":root"])
			out[k] = { ":root": v[":root"] };
	}
	return out;
}
