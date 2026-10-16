import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./core.mjs";
import { exportsOf } from "./exports.mjs";
import { specFiles } from "./specs.mjs";

const COMPONENTS = join(ROOT, "components");
/** The `@baby-ui/react` / `@baby-ui/svelte` packages: generated facades over `components/`. */
const FACADE = {
	react: join(ROOT, "packages/ui-react/src"),
	svelte: join(ROOT, "packages/ui-svelte/src/lib"),
};
const DEMOS_REACT = join(ROOT, "packages/demos/src/react");
const DEMOS_SVELTE = join(ROOT, "packages/demos/src/svelte");

// From lib/ only `cn` is public; the other helpers are internal to the components that use them.
const LIB_PUBLIC = ["cn.ts"];
// Filenames whose PascalCase differs from the component's established name.
const NAME_OVERRIDES = {
	// shadcn spells the one-time-code parts InputOTP*; match it so its blocks import cleanly.
	"input-otp": "InputOTP",
	"input-otp-group": "InputOTPGroup",
	"input-otp-slot": "InputOTPSlot",
	"input-otp-separator": "InputOTPSeparator",
};
// Svelte parts published under a second name too (Combobox shares Command's parts).
const EXTRA_DEFAULTS = {
	"command/command-empty.svelte": ["ComboboxEmpty"],
	"command/command-group.svelte": ["ComboboxGroup"],
	"command/command-input.svelte": ["ComboboxInput"],
	"command/command-item.svelte": ["ComboboxItem"],
	"command/command-list.svelte": ["ComboboxList"],
};
const EXTERNAL = {
	svelte: ['export { type ToasterProps, toast } from "svelte-sonner";'],
	react: [],
};

export const pascal = (name) =>
	NAME_OVERRIDES[name] ?? name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const quote = (key) => (/^[a-z_$][\w$]*$/i.test(key) ? key : JSON.stringify(key));
const dirs = (root) =>
	readdirSync(root, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => d.name)
		.sort();
const isTs = (f) => f.endsWith(".ts") && !f.endsWith(".d.ts") && f !== "index.ts";
/** Folders under `components/` with a port for `framework` (`lib` included; `_tools` has none). */
const portDirs = (framework) =>
	dirs(COMPONENTS).filter((dir) => existsSync(join(COMPONENTS, dir, framework)));

/** Primary file first (`<dir>.<ext>`), then the rest alphabetically. */
function ordered(dir, files, ext) {
	return files.sort((a, b) => {
		const pa = a === `${dir}${ext}` ? 0 : 1;
		const pb = b === `${dir}${ext}` ? 0 : 1;
		return pa - pb || a.localeCompare(b);
	});
}

/** A facade re-exports a component's barrel, where a Svelte default export already has its name. */
const facadeSpec = (n) => (n.isDefault ? n.name : n.spec);

/**
 * Explicit named re-exports, so a duplicate name is resolved here and never becomes an ambiguous
 * `export *`. The file that declares a name wins over files that only re-export it.
 */
function reexports(modules, from, external = [], specOf = (n) => n.spec) {
	const owner = new Map();
	for (const [index, mod] of modules.entries()) {
		for (const n of mod.names) {
			const current = owner.get(n.name);
			const rank = n.declared ? (n.isDefault ? 1 : 2) : 0;
			if (!current || rank > current.rank)
				owner.set(n.name, { index, rank, declared: n.declared });
		}
	}
	const collisions = [];
	let text = external.map((line) => `${line}\n`).join("");
	for (const [index, mod] of modules.entries()) {
		const specs = mod.names.filter((n) => owner.get(n.name)?.index === index).map(specOf);
		for (const n of mod.names) {
			const won = owner.get(n.name);
			if (won?.index !== index && n.declared && won?.declared)
				collisions.push(`${n.name}: ${from(mod)}`);
		}
		if (specs.length) text += `export { ${specs.join(", ")} } from "${from(mod)}";\n`;
	}
	return { text, collisions };
}

/**
 * One port's barrels: each component's own (`components/<dir>/<fw>/index.ts`), and the package
 * facade that re-exports them by name from `@baby-ui/components/<fw>/<dir>`.
 */
function uiIndex({ framework, componentExts, defaults, external }) {
	const folderOf = (dir) => join(COMPONENTS, dir, framework);
	const modules = [];
	for (const dir of portDirs(framework)) {
		const files = readdirSync(folderOf(dir));
		const pick = dir === "lib" ? (f) => LIB_PUBLIC.includes(f) : () => true;
		if (defaults) {
			for (const file of ordered(
				dir,
				files.filter((f) => f.endsWith(".svelte")).filter(pick),
				".svelte",
			)) {
				const aliases = [
					pascal(file.replace(/\.svelte$/, "")),
					...(EXTRA_DEFAULTS[`${dir}/${file}`] ?? []),
				];
				modules.push({
					dir,
					file,
					names: [
						...aliases.map((name) => ({
							name,
							spec: `default as ${name}`,
							declared: true,
							isDefault: true,
						})),
						...exportsOf(join(folderOf(dir), file)).map((n) => ({
							...n,
							spec: n.type ? `type ${n.name}` : n.name,
						})),
					],
				});
			}
		}
		const sources = [
			...componentExts.flatMap((ext) =>
				ordered(dir, files.filter((f) => f.endsWith(ext)).filter(pick), ext),
			),
			...files.filter(isTs).filter(pick).sort(),
		];
		for (const file of sources) {
			modules.push({
				dir,
				file: file.replace(/\.tsx?$/, ""),
				names: exportsOf(join(folderOf(dir), file)).map((n) => ({
					...n,
					spec: n.type ? `type ${n.name}` : n.name,
				})),
			});
		}
	}

	const facadeFrom = (m) =>
		m.dir === "lib"
			? `@baby-ui/components/lib/${framework}/${m.file}`
			: `@baby-ui/components/${framework}/${m.dir}`;
	const barrel = reexports(modules, facadeFrom, external, facadeSpec);
	const folders = new Map();
	const facades = new Map();
	for (const dir of new Set(modules.map((m) => m.dir))) {
		if (dir === "lib") continue;
		const own = modules.filter((m) => m.dir === dir);
		folders.set(dir, reexports(own, (m) => `./${m.file}`).text);
		facades.set(dir, reexports(own, facadeFrom, [], facadeSpec).text);
	}
	return { ...barrel, folders, facades };
}

/** Every `lib/` file, so `@baby-ui/<fw>/lib/<file>` keeps resolving (Pro uses them directly). */
function libFacades(framework) {
	const dir = join(COMPONENTS, "lib", framework);
	return readdirSync(dir)
		.filter(isTs)
		.map((file) => {
			const base = file.replace(/\.ts$/, "");
			const names = exportsOf(join(dir, file)).map((n) =>
				n.type ? `type ${n.name}` : n.name,
			);
			return [
				file,
				`export { ${names.join(", ")} } from "@baby-ui/components/lib/${framework}/${base}";\n`,
			];
		});
}

// Package export subpaths outside `<item>/index.ts`; each gets a facade file of its own.
const EXTRA_ENTRIES = [["data-table", "worker"]];

export function indexes(output, report) {
	const ports = {
		react: uiIndex({
			framework: "react",
			componentExts: [".tsx"],
			external: EXTERNAL.react,
		}),
		svelte: uiIndex({
			framework: "svelte",
			componentExts: [],
			defaults: true,
			external: EXTERNAL.svelte,
		}),
	};
	for (const [framework, port] of Object.entries(ports)) {
		const facade = FACADE[framework];
		output.add(join(facade, "index.ts"), port.text);
		for (const [dir, text] of port.folders) {
			output.add(join(COMPONENTS, dir, framework, "index.ts"), text);
			output.add(join(facade, dir, "index.ts"), port.facades.get(dir));
		}
		for (const [file, text] of libFacades(framework)) {
			output.add(join(facade, "lib", file), text);
		}
		for (const [dir, entry] of EXTRA_ENTRIES) {
			// Read from React: the Svelte file is its generated copy and may not be on disk yet.
			const names = exportsOf(join(COMPONENTS, dir, "react", `${entry}.ts`)).map((n) =>
				n.type ? `type ${n.name}` : n.name,
			);
			output.add(
				join(facade, dir, `${entry}.ts`),
				`export { ${names.join(", ")} } from "@baby-ui/components/${framework}/${dir}/${entry}";\n`,
			);
		}
	}
	const { react, svelte } = ports;
	report.collisions.push(
		...react.collisions.map((c) => `react ${c}`),
		...svelte.collisions.map((c) => `svelte ${c}`),
	);

	const manifests = specFiles();
	// A file may define several related specs (chart.ts holds chart and line-chart).
	const specNames = manifests.map(([slug, file]) => {
		const text = readFileSync(file, "utf8");
		const names = [...text.matchAll(/export const (\w+)\s*=\s*defineComponent\(/g)].map(
			(m) => m[1],
		);
		if (!names.length)
			throw new Error(`gen: ${slug}.ts has no \`export const x = defineComponent(\``);
		return [slug, names];
	});
	output.add(
		join(COMPONENTS, "specs.ts"),
		[
			'import type { ComponentSpec } from "@baby-ui/registry-schema";',
			...specNames.map(
				([slug, names]) => `import { ${names.join(", ")} } from "./${slug}/${slug}";`,
			),
			"",
			"export const specs: ComponentSpec[] = [",
			...specNames.flatMap(([, names]) => names.map((name) => `\t${name},`)),
			"];",
			"",
			"export function getSpec(slug: string): ComponentSpec | undefined {",
			"\treturn specs.find((s) => s.slug === slug);",
			"}",
			"",
		].join("\n"),
	);

	const slugs = manifests.flatMap(([, file]) =>
		[...readFileSync(file, "utf8").matchAll(/\bslug:\s*"([a-z0-9-]+)"/g)].map(
			(m) => m[1],
		),
	);
	const bySlugKey = new Map(
		slugs.map((slug) => [`${pascal(slug)}Demo`.toLowerCase(), slug]),
	);

	const svelteDemos = readdirSync(DEMOS_SVELTE)
		.filter((f) => f.endsWith("-demo.svelte"))
		.sort()
		.map((f) => [f.replace(/-demo\.svelte$/, ""), `./${f}`]);
	const svelteLoaders = new Map(
		svelteDemos.map(([slug, from]) => [slug, `() => import("${from}")`]),
	);
	for (const [slug, loader] of report.autoSvelte ?? [])
		if (!svelteLoaders.has(slug)) svelteLoaders.set(slug, loader);
	output.add(
		join(DEMOS_SVELTE, "index.ts"),
		[
			'import type { Component } from "svelte";',
			"",
			"export type DemoComponent = Component<{ props?: Record<string, unknown> }>;",
			"export type DemoLoader = () => Promise<{ default: DemoComponent }>;",
			"",
			"/** A spec without a demo here renders the Code tab only. Each entry is a dynamic",
			" * import so Vite code-splits every demo, fetched only when its preview is shown. */",
			"export const demos: Record<string, DemoLoader> = {",
			...[...svelteLoaders]
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([slug, loader]) => `\t${quote(slug)}: ${loader},`),
			"};",
			"",
			"/** Each component's own module by slug, for pages that render the component unframed. */",
			"export const components: Record<string, () => Promise<Record<string, unknown>>> = {",
			...slugs
				.filter((slug) => svelte.folders.has(slug))
				.sort()
				.map((slug) => `\t${quote(slug)}: () => import("@baby-ui/svelte/${slug}"),`),
			"};",
			"",
		].join("\n"),
	);

	const reactFiles = readdirSync(DEMOS_REACT)
		.filter((f) => f.endsWith(".tsx") && f !== "index.tsx")
		.sort();
	const entries = new Map();
	for (const file of reactFiles) {
		const names = exportsOf(join(DEMOS_REACT, file))
			.filter((n) => !n.type && n.name.endsWith("Demo"))
			.map((n) => n.name);
		for (const name of names) {
			const slug = bySlugKey.get(name.toLowerCase());
			if (!slug) {
				report.unmatched.push(`${file}: ${name}`);
				continue;
			}
			entries.set(slug, [name, `./${file.replace(/\.tsx$/, "")}`]);
		}
	}
	for (const [slug, name, from] of report.autoReact ?? []) {
		if (!entries.has(slug)) entries.set(slug, [name, from]);
	}
	output.add(
		join(DEMOS_REACT, "index.tsx"),
		[
			'import type { ComponentType } from "react";',
			"",
			"export type DemoComponent = ComponentType<{ props: Record<string, unknown> }>;",
			"export type DemoLoader = () => Promise<{ default: DemoComponent }>;",
			"",
			"/** One dynamic import per slug, so a runner fetches only the demo it shows. */",
			"export const demos: Record<string, DemoLoader> = {",
			...[...entries]
				.sort(([a], [b]) => a.localeCompare(b))
				.map(
					([slug, [name, from]]) =>
						`\t${quote(slug)}: () => import("${from}").then((m) => ({ default: m.${name} })),`,
				),
			"};",
			"",
		].join("\n"),
	);
	report.demoless = slugs.filter(
		(slug) => !svelteLoaders.has(slug) || !entries.has(slug),
	);
}
