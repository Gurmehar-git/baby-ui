import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

// Proves the Pro feature flag in a finished build. Pro is always bundled when pro/ is checked out;
// `--expect=hidden` fails if any page, list or registry index shows it, `visible` if none does.
const ROOT = resolve(import.meta.dirname, "..");
const SITE = join(ROOT, "apps/site");
const PRO = join(ROOT, "pro/components");
const KIT = join(SITE, ".svelte-kit");
const BUNDLE = [join(KIT, "output/client"), join(KIT, "output/server")];
// What a visitor or crawler can reach: prerendered pages and the indexes the site serves.
const SHOWN = [
	join(KIT, "output/prerendered"),
	join(SITE, "static/r"),
	join(SITE, "static/svelte"),
];
const SHOWN_EXT = new Set([".html", ".xml", ".txt", ".json"]);

const expect = process.argv
	.find((a) => a.startsWith("--expect="))
	?.slice("--expect=".length);
if (expect !== "hidden" && expect !== "visible") {
	console.error("Usage: node scripts/check-pro-bundle.mjs --expect=hidden|visible");
	process.exit(1);
}
if (!existsSync(KIT)) {
	console.error(
		"Pro check: no build output under apps/site/.svelte-kit. Run the build first.",
	);
	process.exit(1);
}
if (!existsSync(PRO)) {
	if (expect === "visible") {
		console.error("Pro check: pro/ is not checked out, so nothing can be shown.");
		process.exit(1);
	}
	console.log("Pro check: pro/ is not checked out; the build has no Pro to show.");
	process.exit(0);
}

function* files(dir, exts) {
	if (!existsSync(dir)) return;
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) yield* files(path, exts);
		else if (!exts || exts.has(extname(name))) yield path;
	}
}

const folders = (dir) =>
	existsSync(dir)
		? readdirSync(dir).filter((n) => n !== "lib" && statSync(join(dir, n)).isDirectory())
		: [];
const components = (root) =>
	folders(root).filter((n) =>
		["react", "svelte"].some((f) => existsSync(join(root, n, f))),
	);
// A slug the public packages also ship is public, whatever Pro builds on it.
const publicSlugs = new Set(components(join(ROOT, "components")));
const proSlugs = components(PRO).filter((slug) => !publicSlugs.has(slug));

// Lazy Pro modules are manifest keys; eager ones keep their glob path inside a chunk.
const bundled = BUNDLE.some((dir) =>
	[...files(dir, new Set([".js", ".json"]))].some((path) =>
		/pro\/(components|packages)\//.test(readFileSync(path, "utf8")),
	),
);
if (!bundled) {
	console.error("Pro check: pro/ is checked out but no Pro module reached the bundle.");
	process.exit(1);
}

// A component page link, an index entry by slug, or the pricing page: each one shows Pro.
const shownBy = (text) => {
	if (/href="\/(pricing|checkout|dashboard|login)"/.test(text))
		return "a Pro account page";
	return proSlugs.find((slug) =>
		new RegExp(
			`/components/[a-z0-9-]+/${slug}(?![a-z0-9-])|"(slug|name)":\\s*"${slug}"`,
		).test(text),
	);
};
const shown = [];
for (const dir of SHOWN)
	for (const path of files(dir, SHOWN_EXT)) {
		const hit = shownBy(readFileSync(path, "utf8"));
		if (hit) shown.push(`${relative(ROOT, path)} shows ${hit}`);
	}

if (expect === "hidden" && shown.length) {
	console.error(
		`Pro check: Pro is bundled but ${shown.length} file(s) show it with the flag off:`,
	);
	for (const line of shown.slice(0, 20)) console.error(`  ${line}`);
	console.error(
		"Filter lists through the site registry's `specs`, which reads `__SHOW_PRO__`.",
	);
	process.exit(1);
}
if (expect === "visible" && !shown.length) {
	console.error("Pro check: the flag is on but no page or index shows a Pro component.");
	process.exit(1);
}
console.log(
	`Pro check: bundled, and ${expect} (${proSlugs.length} Pro slugs, ${shown.length} places show them).`,
);
