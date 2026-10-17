#!/usr/bin/env node
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const COMPONENTS = join(ROOT, "components");
const PREVIEW_PROPS = join(ROOT, "packages/demos/src/data/preview-props.ts");
const TEMPLATES = join(ROOT, "apps/site/src/lib/server/templates.ts");
const SPECS = join(ROOT, "components/specs.ts");
const OUT = join(ROOT, "apps/site/src/lib/generated/emails");
// Bundles land inside each port's node_modules so bare imports resolve to that port's deps.
const REACT_CACHE = join(ROOT, "packages/ui-react/node_modules/.cache/baby-ui-emails");
const SVELTE_CACHE = join(ROOT, "packages/ui-svelte/node_modules/.cache/baby-ui-emails");
const MAX_BYTES = 102 * 1024;

const pascal = (slug) => slug.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
const posix = (p) => p.split("\\").join("/");
const str = JSON.stringify;

const PRO = join(ROOT, "pro");
const OUT_PRO = join(ROOT, "apps/site/src/lib/generated/emails-pro");

/** Every template folder: public ones, plus Pro ones when the private submodule is present. */
function discover(dir, pro) {
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((d) => d.startsWith("email-") && d !== "email-kit")
		.map((slug) => ({
			slug,
			pro,
			react: join(dir, slug, "react", slug),
			svelte: join(dir, slug, "svelte", `${slug}.svelte`),
		}));
}
const templates = [
	...discover(COMPONENTS, false),
	...discover(join(PRO, "components"), true),
];
const slugs = templates.map((t) => t.slug);

async function bundle(
	entrySource,
	resolveDir,
	outfile,
	plugins = [],
	external = [],
	conditions = [],
) {
	await build({
		stdin: { contents: entrySource, resolveDir, loader: "tsx" },
		bundle: true,
		platform: "node",
		format: "esm",
		jsx: "automatic",
		outfile,
		plugins,
		external,
		conditions,
		logLevel: "error",
	});
	return import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);
}

async function renderReact(props) {
	const entry = [
		'import { createElement } from "react";',
		'import { render } from "react-email";',
		...templates.map((t) => `import { ${pascal(t.slug)} } from ${str(posix(t.react))};`),
		`const COMPONENTS = { ${slugs.map((s) => `${str(s)}: ${pascal(s)}`).join(", ")} };`,
		// Keys are "slug" or "slug@design"; every design renders through the same component.
		"export default async function run(props) {",
		"\tconst out = {};",
		"\tfor (const key of Object.keys(props))",
		'\t\tout[key] = await render(createElement(COMPONENTS[key.split("@")[0]], props[key]));',
		"\treturn out;",
		"}",
	].join("\n");
	const external = ["react", "react-dom", "react-email"];
	const mod = await bundle(
		entry,
		COMPONENTS,
		join(REACT_CACHE, "render.mjs"),
		[],
		external,
	);
	return mod.default(props);
}

const { compile } = createRequire(join(COMPONENTS, "package.json"))("svelte/compiler");

const sveltePlugin = {
	name: "svelte-server",
	setup(b) {
		b.onLoad({ filter: /\.svelte$/ }, async (args) => {
			const source = readFileSync(args.path, "utf8");
			const { js, warnings } = compile(source, {
				generate: "server",
				filename: args.path,
			});
			for (const w of warnings)
				console.warn(`svelte: ${relative(ROOT, args.path)}: ${w.message}`);
			return { contents: js.code, loader: "js", resolveDir: dirname(args.path) };
		});
	},
};

async function renderSvelte(props) {
	const entry = [
		'import { Renderer, pixelBasedPreset } from "@better-svelte-email/server";',
		'import { emailTailwindConfig } from "./lib/email-theme";',
		...templates.map((t) => `import ${pascal(t.slug)} from ${str(posix(t.svelte))};`),
		"export default async function run(props) {",
		"\tconst tailwindConfig = { ...emailTailwindConfig, presets: [pixelBasedPreset] };",
		"\tconst renderer = new Renderer({ tailwindConfig });",
		`\tconst components = { ${slugs.map((s) => `${str(s)}: ${pascal(s)}`).join(", ")} };`,
		"\tconst out = {};",
		"\tfor (const key of Object.keys(props))",
		'\t\tout[key] = await renderer.render(components[key.split("@")[0]], { props: props[key] });',
		"\treturn out;",
		"}",
	].join("\n");
	const external = ["svelte", "svelte/*", "@better-svelte-email/server"];
	const mod = await bundle(
		entry,
		COMPONENTS,
		join(SVELTE_CACHE, "render.mjs"),
		[sveltePlugin],
		external,
		// Svelte packages export source under the `svelte` condition, as Vite resolves them.
		["svelte"],
	);
	return mod.default(props);
}

/** Quality gates every rendered email must pass; returns failure messages. */
function audit(slug, port, html, props) {
	const fail = [];
	const bytes = Buffer.byteLength(html);
	if (bytes > MAX_BYTES) fail.push(`${bytes} bytes; Gmail clips past ${MAX_BYTES}`);
	if (/var\(--/.test(html)) fail.push("CSS variable left in output");
	if (/oklch\(/.test(html)) fail.push("oklch colour left in output");
	if (/\d(\.\d+)?rem\b/.test(html)) fail.push("rem unit left in output");
	if (!/prefers-color-scheme:\s*dark/.test(html)) fail.push("no dark-mode media query");
	// Better Svelte Email writes breakpoints as `(width >= 480px)`, which Gmail drops.
	if (/@media[^{]*\bwidth\s*[<>]/.test(html))
		fail.push("range media query; use fixed sizes");
	for (const [, w] of html.matchAll(/(?:^|[;"\s])(?:max-)?width:\s*(\d+)px/g))
		if (+w > 600) fail.push(`width ${w}px exceeds 600px`);
	// A light fill with no dark twin shows as a bright band in dark-mode inboxes.
	for (const [tag] of html.matchAll(
		/<[a-z0-9]+\b[^>]*background-color:(?!\s*transparent)[^>]*>/g,
	))
		if (!/class="[^"]*dark_bg-/.test(tag))
			fail.push(`background without dark twin: ${tag.slice(0, 100)}`);
	for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
		// Empty alt only for a declared decoration, e.g. the mark beside a written brand name.
		const decorative = /\balt=""/.test(tag) && /\brole="presentation"/.test(tag);
		if (!decorative && !/\balt="[^"]+"/.test(tag))
			fail.push(`img without alt: ${tag.slice(0, 80)}`);
		// Plain http only for the local dev server's own assets.
		if (!/\bsrc="(https:\/\/|http:\/\/[a-z0-9.-]+\.localhost[:/])/.test(tag))
			fail.push(`img src not absolute https: ${tag.slice(0, 80)}`);
	}
	for (const [, href] of html.matchAll(/<a\b[^>]*href="([^"]*)"/g))
		if (!/^(https:\/\/|mailto:)/.test(href)) fail.push(`link not absolute: ${href}`);
	const unstyled = [...html.matchAll(/class="([^"]*)"/g)]
		.flatMap((m) => m[1].split(/\s+/))
		.filter((c) => c && !c.startsWith("dark_"));
	if (unstyled.length)
		fail.push(`classes left un-inlined: ${[...new Set(unstyled)].slice(0, 6).join(" ")}`);
	if (props.preview && !html.includes(props.preview)) fail.push("preview text missing");
	// A missing prop interpolated into copy reads as a broken email.
	const leaked = plainText(html).match(/\b(undefined|null|NaN)\b|\[object Object\]/);
	if (leaked) fail.push(`"${leaked[0]}" in the rendered copy`);
	return fail.map((f) => `${slug} (${port}): ${f}`);
}

const normalise = (text) =>
	text
		.replace(/[\u00a0\u200b-\u200f\u2028\u2029\ufeff\u00ad]|\u034f/g, " ")
		.replace(/\s+/g, " ")
		.trim();

// The site's own modules, so props and plain text match the live endpoint exactly.
const shared = await bundle(
	[
		`export { previewProps, withSiteAssets } from ${str(posix(PREVIEW_PROPS))};`,
		`export { defaultProps } from ${str(posix(join(ROOT, "packages/registry-schema/src/spec.ts")))};`,
		`export { getSpec } from ${str(posix(SPECS))};`,
		`export { emailPlainText } from ${str(posix(TEMPLATES))};`,
		...(templates.some((t) => t.pro)
			? [
					`export { proSpecs } from ${str(posix(join(PRO, "components/specs.ts")))};`,
					`export { EMAIL_SAMPLES as PRO_SAMPLES } from ${str(posix(join(PRO, "packages/demos/src/data/email-samples.ts")))};`,
				]
			: []),
	].join("\n"),
	ROOT,
	join(REACT_CACHE, "shared.mjs"),
	[],
	["@better-svelte-email/server"],
);
const plainText = shared.emailPlainText;
// Deploys set BABY_UI_SITE_URL; locally, sample assets load from the portless dev server.
const ASSET_ORIGIN = (
	process.env.BABY_UI_SITE_URL ?? "http://site.baby-ui.localhost"
).replace(/\/$/, "");
const props = Object.fromEntries(
	templates.map(({ slug, pro }) => {
		const spec = pro
			? shared.proSpecs.find((s) => s.slug === slug)
			: shared.getSpec(slug);
		const controls = spec ? shared.defaultProps(spec) : {};
		const sample = pro ? shared.PRO_SAMPLES[slug] : undefined;
		return [
			slug,
			shared.withSiteAssets(shared.previewProps(slug, controls, sample), ASSET_ORIGIN),
		];
	}),
);

const [react, svelte] = await Promise.all([renderReact(props), renderSvelte(props)]);
const failures = [];
// Rewritten from scratch each run, so a Pro render never outlives the submodule or a template.
for (const dir of [OUT, OUT_PRO]) {
	rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir, { recursive: true });
}
const kb = (n) => `${(n / 1024).toFixed(1)}KB`;
for (const key of Object.keys(props)) {
	const [slug] = key.split("@");
	const out = { slug, props: props[key] };
	for (const [port, html] of [
		["react", react[key]],
		["svelte", svelte[key]],
	]) {
		failures.push(...audit(key, port, html, props[key]));
		out[port] = { html, text: plainText(html), bytes: Buffer.byteLength(html) };
	}
	const a = normalise(out.react.text);
	const b = normalise(out.svelte.text);
	if (a !== b) {
		let i = 0;
		while (a[i] === b[i]) i++;
		failures.push(
			`${key}: React and Svelte text differ at ${i}: "${a.slice(i, i + 50)}" vs "${b.slice(i, i + 50)}"`,
		);
	}
	// Only the default design is written; other designs preview through the live endpoint.
	if (key === slug) {
		const pro = templates.find((t) => t.slug === slug)?.pro;
		writeFileSync(join(pro ? OUT_PRO : OUT, `${slug}.json`), `${str(out)}\n`);
	}
	console.log(
		`emails: ${key} react ${kb(out.react.bytes)}, svelte ${kb(out.svelte.bytes)}`,
	);
}

if (failures.length) {
	console.error(failures.map((f) => `  x ${f}`).join("\n"));
	process.exit(1);
}
console.log(
	`emails: ${slugs.length} templates, ${Object.keys(props).length} renders, all gates pass`,
);
