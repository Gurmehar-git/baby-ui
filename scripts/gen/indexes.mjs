import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./core.mjs";
import { exportsOf } from "./exports.mjs";

const REACT = join(ROOT, "packages/ui-react/src");
const SVELTE = join(ROOT, "packages/ui-svelte/src/lib");
const SPECS = join(ROOT, "packages/registry-schema/src/components");
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

/** Primary file first (`<dir>.<ext>`), then the rest alphabetically. */
function ordered(dir, files, ext) {
	return files.sort((a, b) => {
		const pa = a === `${dir}${ext}` ? 0 : 1;
		const pb = b === `${dir}${ext}` ? 0 : 1;
		return pa - pb || a.localeCompare(b);
	});
}

/**
 * Explicit named re-exports, so a duplicate name is resolved here and never becomes an ambiguous
 * `export *`. The file that declares a name wins over files that only re-export it.
 */
function reexports(modules, from, external = []) {
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
		const specs = mod.names
			.filter((n) => owner.get(n.name)?.index === index)
			.map((n) => n.spec);
		for (const n of mod.names) {
			const won = owner.get(n.name);
			if (won?.index !== index && n.declared && won?.declared)
				collisions.push(`${n.name}: ${from(mod)}`);
		}
		if (specs.length) text += `export { ${specs.join(", ")} } from "${from(mod)}";\n`;
	}
	return { text, collisions };
}

/** The package barrel plus one index per item folder, which `<pkg>/<item>` resolves to. */
function uiIndex({ root, componentExts, defaults, external }) {
	const modules = [];
	for (const dir of dirs(root)) {
		const files = readdirSync(join(root, dir));
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
						...exportsOf(join(root, dir, file)).map((n) => ({
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
				names: exportsOf(join(root, dir, file)).map((n) => ({
					...n,
					spec: n.type ? `type ${n.name}` : n.name,
				})),
			});
		}
	}

	const barrel = reexports(modules, (m) => `./${m.dir}/${m.file}`, external);
	const folders = new Map();
	for (const dir of new Set(modules.map((m) => m.dir))) {
		if (dir === "lib") continue;
		folders.set(
			dir,
			reexports(
				modules.filter((m) => m.dir === dir),
				(m) => `./${m.file}`,
			).text,
		);
	}
	return { ...barrel, folders };
}

export function indexes(output, report) {
	const react = uiIndex({
		root: REACT,
		componentExts: [".tsx"],
		external: EXTERNAL.react,
	});
	output.add(join(REACT, "index.ts"), react.text);
	for (const [dir, text] of react.folders) output.add(join(REACT, dir, "index.ts"), text);
	const svelte = uiIndex({
		root: SVELTE,
		componentExts: [],
		defaults: true,
		external: EXTERNAL.svelte,
	});
	output.add(join(SVELTE, "index.ts"), svelte.text);
	for (const [dir, text] of svelte.folders)
		output.add(join(SVELTE, dir, "index.ts"), text);
	report.collisions.push(
		...react.collisions.map((c) => `react ${c}`),
		...svelte.collisions.map((c) => `svelte ${c}`),
	);

	const specFiles = readdirSync(SPECS)
		.filter((f) => f.endsWith(".ts") && f !== "index.ts")
		.sort();
	// A file may define several related specs (chart.ts holds chart and line-chart).
	const specNames = specFiles.map((file) => {
		const text = readFileSync(join(SPECS, file), "utf8");
		const names = [...text.matchAll(/export const (\w+)\s*=\s*defineComponent\(/g)].map(
			(m) => m[1],
		);
		if (!names.length)
			throw new Error(`gen: ${file} has no \`export const x = defineComponent(\``);
		return [file.replace(/\.ts$/, ""), names];
	});
	output.add(
		join(SPECS, "index.ts"),
		[
			'import type { ComponentSpec } from "../index.ts";',
			...specNames.map(
				([file, names]) => `import { ${names.join(", ")} } from "./${file}.ts";`,
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

	const slugs = specFiles.flatMap((file) =>
		[
			...readFileSync(join(SPECS, file), "utf8").matchAll(/\bslug:\s*"([a-z0-9-]+)"/g),
		].map((m) => m[1]),
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
