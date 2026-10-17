import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
	type ComponentSpec,
	docsPath,
	type Framework,
	REGISTRY_ITEM_SCHEMA_URL,
	type RegistryItem,
	RegistryItemSchema,
} from "@baby-ui/registry-schema";
import { cssFor } from "./component-css";
import { FRAMEWORK, REGISTRY_URL, SITE_URL } from "./config";
import type { InstallLayout } from "./layout";
import { COMPONENTS_DIR, readSource, sourcePath } from "./sources";
import { bareVars, tokenLayerUrls, tokensUrl } from "./theme";
import { jsPath, toJavaScript } from "./tojs";

/** A bare slug in a spec's `registryDependencies` resolves to that item's own URL,
 * so `add command` also fetches `shortcut`; an already-qualified URL passes through. */
function resolveRegistryDep(framework: Framework, dep: string): string {
	return dep.startsWith("http")
		? dep
		: `${REGISTRY_URL}/${FRAMEWORK[framework].routePrefix}/${dep}.json`;
}

// `./button` is the port's own file, `../variants` the shared one; both install as `<folder>/<file>`.
const EXPORT_LINE = /export\s+\{([^}]*)\}\s+from\s+"\.\.?\/([^"]+)";/g;
const FACADE_LINE =
	/export\s+\{([^}]*)\}\s+from\s+"@baby-ui\/components\/(?:react|svelte)\/([a-z0-9-]+)";/g;

/** `type Foo` and `default as Foo` both export `Foo`. */
const exportedName = (spec: string) =>
	spec.replace(/^type\s+/, "").replace(/^default\s+as\s+/, "");

// The package barrel gives a name two folders both export to one of them; item barrels keep
// that choice, so they export exactly what the package barrel credits to their folder.
const owners = new Map<Framework, Promise<Map<string, Set<string>>>>();
function packageOwners(framework: Framework): Promise<Map<string, Set<string>>> {
	const found =
		owners.get(framework) ??
		readFile(resolve(FRAMEWORK[framework].srcDir, "index.ts"), "utf8").then((text) => {
			const byFolder = new Map<string, Set<string>>();
			for (const [, list = "", folder = ""] of text.matchAll(FACADE_LINE)) {
				const names = byFolder.get(folder) ?? new Set<string>();
				for (const spec of list.split(",")) names.add(exportedName(spec.trim()));
				byFolder.set(folder, names);
			}
			return byFolder;
		});
	owners.set(framework, found);
	return found;
}

/** The item folder's `index.ts`: its `components/<folder>/<framework>/index.ts` barrel, limited
 * to files this item ships, so `@/components/<dir>/<slug>` resolves. */
async function barrelFor(
	framework: Framework,
	folder: string,
	shipped: Set<string>,
): Promise<string | null> {
	const index = await readFile(
		resolve(COMPONENTS_DIR, folder, framework, "index.ts"),
		"utf8",
	).catch(() => "");
	const owned = (await packageOwners(framework)).get(folder) ?? new Set<string>();
	const lines: string[] = [];
	for (const match of index.matchAll(EXPORT_LINE)) {
		const [, list = "", file = ""] = match;
		const module = `${folder}/${file}`;
		if (![module, `${module}.ts`, `${module}.tsx`].some((f) => shipped.has(f))) continue;
		const specs = list
			.split(",")
			.map((s) => s.trim())
			.filter((s) => owned.has(exportedName(s)));
		if (specs.length) lines.push(`export { ${specs.join(", ")} } from "./${file}";`);
	}
	if (!lines.length) return null;
	const compat = [
		...(framework === "svelte" ? namespaceAliases(lines, folder) : []),
		...shadcnNames(lines, folder, framework),
	];
	return `${[...lines, ...compat].join("\n")}\n`;
}

const pascal = (slug: string) =>
	slug.replace(/(^|-)([a-z0-9])/g, (_m, _dash, c: string) => c.toUpperCase());

const exportedNames = (lines: string[]) =>
	new Set(
		lines.flatMap((line) =>
			(line.match(/\{([^}]*)\}/)?.[1] ?? "").split(",").map(
				(spec) =>
					spec
						.trim()
						.replace(/^type\s+/, "")
						.split(/\s+as\s+/)
						.pop() ?? "",
			),
		),
	);

/**
 * shadcn-svelte barrels also export short part names (`Root`, `Header`, `Provider`), so
 * `import * as Card from ...` then `<Card.Root>` works as it does with shadcn's own items.
 */
function namespaceAliases(lines: string[], folder: string): string[] {
	const prefix = pascal(folder);
	const taken = exportedNames(lines);
	const out: string[] = [];
	for (const line of lines) {
		const from = line.match(/from\s+"([^"]+)"/)?.[1];
		const specs = line.match(/\{([^}]*)\}/)?.[1];
		if (!from || !specs) continue;
		for (const spec of specs.split(",")) {
			const name = spec.trim().match(/^default as (\w+)$/)?.[1];
			if (!name) continue;
			// Case-insensitive, so shadcn's InputOTPSlot still shortens under the input-otp folder.
			const rest = name.slice(prefix.length);
			const same = name.slice(0, prefix.length).toLowerCase() === prefix.toLowerCase();
			const short =
				name.toLowerCase() === prefix.toLowerCase()
					? "Root"
					: same && /^[A-Z]/.test(rest)
						? rest
						: null;
			if (!short || taken.has(short)) continue;
			taken.add(short);
			out.push(`export { default as ${short} } from "${from}";`);
		}
	}
	return out;
}

type ShadcnName = { from: string; name: string; as: string; type?: boolean };

/** shadcn's names for our tv() configs and prop types, which its blocks import by name. */
const SHADCN_NAMES: Record<string, ShadcnName[]> = {
	button: [
		{ from: "./variants", name: "button", as: "buttonVariants" },
		{ from: "./button.svelte", name: "ButtonProps", as: "ButtonProps", type: true },
		{ from: "./button.svelte", name: "ButtonProps", as: "Props", type: true },
	],
	badge: [{ from: "./variants", name: "badge", as: "badgeVariants" }],
	toggle: [{ from: "./variants", name: "toggleButton", as: "toggleVariants" }],
};

function shadcnNames(lines: string[], folder: string, framework: Framework): string[] {
	const taken = exportedNames(lines);
	return (SHADCN_NAMES[folder] ?? [])
		.filter((n) => framework === "svelte" || !n.from.endsWith(".svelte"))
		.filter((n) => !taken.has(n.as))
		.map((n) => {
			taken.add(n.as);
			const spec = n.name === n.as ? n.name : `${n.name} as ${n.as}`;
			return `export ${n.type ? "type " : ""}{ ${spec} } from "${n.from}";`;
		});
}

/** Runtime packages that ship no types of their own; strict TS projects need these to compile. */
const TYPES: Record<string, string[]> = {
	"d3-array": ["@types/d3-array"],
	"d3-geo": ["@types/d3-geo", "@types/geojson"],
	"d3-sankey": ["@types/d3-sankey"],
	"d3-scale": ["@types/d3-scale"],
	"d3-shape": ["@types/d3-shape"],
	"topojson-client": ["@types/topojson-client", "@types/geojson"],
};

function typesFor(dependencies: string[]): string[] | undefined {
	const types = [
		...new Set(dependencies.flatMap((dep) => TYPES[dep.replace(/@[^@/]*$/, "")] ?? [])),
	];
	return types.length ? types.sort() : undefined;
}

export async function buildItem(
	spec: ComponentSpec,
	framework: Framework,
	layout: InstallLayout,
): Promise<RegistryItem | null> {
	const impl = spec.impl[framework];
	if (!impl) return null;

	const files = await Promise.all(
		impl.files.map(async (file) => {
			const raw = await readSource(framework, file.path).catch(() => {
				throw new Error(
					`${spec.slug} (${framework}): spec lists ${file.path}, which does not exist at ${sourcePath(framework, file.path)}`,
				);
			});
			return {
				path: file.path,
				content: layout.rewriteImports(raw),
				type: file.type,
				target: file.target ?? layout.target(spec, file.path, file.type),
			};
		}),
	);

	const own = files.some((f) => f.path.startsWith(`${spec.slug}/`)) ? spec.slug : null;
	const barrel =
		own && !files.some((f) => f.path === `${own}/index.ts`)
			? await barrelFor(framework, own, new Set(files.map((f) => f.path)))
			: null;
	if (own && barrel) {
		files.push({
			path: `${own}/index.ts`,
			content: layout.rewriteImports(barrel),
			type: "registry:ui",
			target: layout.target(spec, `${own}/index.ts`, "registry:ui"),
		});
	}

	return RegistryItemSchema.parse({
		$schema: REGISTRY_ITEM_SCHEMA_URL[framework],
		name: spec.slug,
		type: "registry:ui",
		title: spec.name,
		description: spec.description,
		dependencies: impl.dependencies,
		devDependencies: typesFor(impl.dependencies),
		// Every component reads the motion variables, so the CLI has to bring them along.
		registryDependencies: [
			...impl.registryDependencies.map((dep) => resolveRegistryDep(framework, dep)),
			tokensUrl(framework),
			...tokenLayerUrls(
				framework,
				files.map((f) => f.content),
			),
		],
		files,
		cssVars: Object.keys(spec.cssVars).length
			? bareVars({ theme: spec.cssVars })
			: undefined,
		css: await cssFor(files.map((f) => f.content)),
		categories: [spec.category],
		meta: {
			tier: spec.tier,
			status: spec.status,
			frameworks: Object.keys(spec.impl),
			docs: `${SITE_URL}${docsPath(spec)}`,
			// Agents that fetched the item jump straight to the page built for them.
			markdown: `${SITE_URL}${docsPath(spec)}.md`,
			tags: spec.keywords,
		},
	});
}

/** The same item with every file transpiled. Null when any file has no JS counterpart. */
export async function toJsItem(item: RegistryItem): Promise<RegistryItem | null> {
	const files = await Promise.all(
		item.files.map(async (file) => {
			const content = await toJavaScript(file.content, file.path).catch(() => null);
			if (!content) return null;
			return {
				...file,
				path: jsPath(file.path),
				target: file.target ? jsPath(file.target) : undefined,
				content,
			};
		}),
	);
	if (files.some((file) => file === null)) return null;
	return { ...item, files: files as RegistryItem["files"] };
}
