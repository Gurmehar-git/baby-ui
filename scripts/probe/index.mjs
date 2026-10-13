import { availableParallelism } from "node:os";
import { launch, openPage } from "./browser.mjs";
import { serveBuild } from "./serve.mjs";

const HELP = `Usage: pnpm probe [slug ...] [options]

Opens component pages in a headless browser and checks each one: the page loads, there are no
console errors, the demo renders inside its frame and the page has no horizontal scroll.

  slug ...       components to check, e.g. \`pnpm probe button signature-pad\`
  --all          every component in the catalog
  --dials        also operate every select and switch control and flag ones that change nothing
  --url=URL      check a running site instead (e.g. --url=http://site.baby-ui.localhost);
                 without it, the last \`pnpm build\` is served from apps/site/.svelte-kit
  --width=PX     viewport width (default 1280); try 390 for phone layout
  --dark         check in dark mode
  --jobs=N       pages checked at once, one browser tab each (default: cores - 1, max 6)
`;

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) =>
	args
		.find((a) => a.startsWith(`--${name}=`))
		?.split("=")
		.slice(1)
		.join("=");
const slugs = args.filter((a) => !a.startsWith("--"));
if (flag("help") || (!slugs.length && !flag("all"))) {
	console.log(HELP);
	process.exit(slugs.length || flag("all") ? 0 : 1);
}

const served = option("url") ? null : await serveBuild();
const base = (option("url") ?? served?.url ?? "").replace(/\/$/, "");
const catalog = await (await fetch(`${base}/catalog.json`)).json();
const pages = flag("all") ? catalog : catalog.filter((item) => slugs.includes(item.slug));
const unknown = slugs.filter((slug) => !catalog.some((item) => item.slug === slug));
if (unknown.length) console.warn(`Not in the catalog: ${unknown.join(", ")}`);

const jobs = Math.max(
	1,
	Number(option("jobs")) || Math.min(availableParallelism() - 1, 6),
);
const width = Number(option("width") ?? 1280);
const browser = await launch();
const failed = [];

// Reads the demo canvas: whether it rendered, overflowed, or shows a load failure.
const CANVAS = `(() => {
	const c = document.querySelector("[data-demo-canvas]");
	if (!c) return { missing: true };
	const text = c.textContent ?? "";
	return {
		loading: text.includes("Loading preview"),
		broken: text.includes("Couldn't load this preview"),
		empty: text.includes("No demo for this component yet") || c.children.length === 0,
		overflow: c.scrollWidth - c.clientWidth > 1,
		pageScroll: document.documentElement.scrollWidth - innerWidth > 1,
		html: c.innerHTML.length + ":" + [...c.innerHTML].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) | 0, 0),
	};
})()`;

async function settle(page) {
	await page.until(
		`(() => { const c = document.querySelector("[data-demo-canvas]"); return c && !c.textContent.includes("Loading preview"); })()`,
	);
	await page.wait(600);
}

async function operateDials(page) {
	const notes = [];
	// The controls rail sits in a collapsible; open it so every dial is clickable.
	await page.evaluate(
		`document.querySelectorAll("[data-slot=collapsible-trigger][aria-expanded=false]").forEach((t) => { if (t.closest("[data-slot=collapsible]")?.querySelector("[data-dial]")) t.click(); })`,
	);
	await page.wait(400);
	const dials = await page.evaluate(
		`[...document.querySelectorAll("[data-dial]")].map((d) => ({ name: d.dataset.dial, kind: d.dataset.dialKind }))`,
	);
	for (const dial of dials) {
		if (dial.kind !== "select" && dial.kind !== "boolean") continue;
		const target =
			dial.kind === "select" ? "[data-slot=select-trigger], button" : "[role=switch]";
		const point = async () =>
			page.evaluate(
				`(() => { const el = document.querySelector('[data-dial="${dial.name}"]')?.querySelector('${target}'); if (!el) return null; el.scrollIntoView({ block: "center" }); const r = el.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; })()`,
			);
		if (dial.kind === "boolean") {
			const before = (await page.evaluate(CANVAS)).html;
			const at = await point();
			if (!at) continue;
			await page.click(...at);
			await page.wait(500);
			if ((await page.evaluate(CANVAS)).html === before)
				notes.push(`switch "${dial.name}" changed nothing`);
			await page.click(...at);
			await page.wait(300);
			continue;
		}
		const open = async () => {
			const at = await point();
			if (at) await page.click(...at);
			await page.wait(350);
		};
		await open();
		const options = await page.evaluate(
			`[...document.querySelectorAll("[role=option]")].map((o) => o.textContent.trim())`,
		);
		await page.key("Escape", "Escape", 27);
		await page.wait(200);
		const seen = new Set();
		for (const label of options) {
			await open();
			const at = await page.evaluate(
				`(() => { const o = [...document.querySelectorAll("[role=option]")].find((x) => x.textContent.trim() === ${JSON.stringify(label)}); if (!o) return null; o.scrollIntoView({ block: "nearest" }); const r = o.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; })()`,
			);
			if (!at) continue;
			await page.click(...at);
			await page.wait(500);
			seen.add((await page.evaluate(CANVAS)).html);
		}
		if (options.length > 1 && seen.size < 2)
			notes.push(
				`select "${dial.name}" changed nothing across ${options.length} options`,
			);
	}
	return notes;
}

async function check(page, item) {
	const url = `${base}${item.href}`;
	const status = (await fetch(url)).status;
	const problems = status === 200 ? [] : [`HTTP ${status}`];
	const warnings = [];
	if (status === 200) {
		await page.goto(url);
		if (flag("dark"))
			await page.evaluate(`document.documentElement.classList.add("dark")`);
		await settle(page);
		const c = await page.evaluate(CANVAS);
		if (c.missing) warnings.push("no demo canvas on the page");
		else {
			if (c.loading) problems.push("demo still loading after 15s");
			if (c.broken) problems.push("demo failed to load");
			if (c.empty) warnings.push("no demo");
			if (c.overflow) problems.push("demo overflows its frame");
			if (c.pageScroll) problems.push("page scrolls horizontally");
		}
		if (flag("dials") && !c.missing) warnings.push(...(await operateDials(page)));
		problems.push(
			...page.errors.map((e) => `console: ${e.split("\n")[0].slice(0, 160)}`),
		);
	}
	const mark = problems.length ? "FAIL" : warnings.length ? "warn" : "ok  ";
	console.log(
		`${mark} ${item.slug}${[...problems, ...warnings].map((p) => `\n     - ${p}`).join("")}`,
	);
	if (problems.length) failed.push(item.slug);
}

// Each worker owns one tab and pulls the next page from the shared queue until it is empty.
const queue = [...pages];
await Promise.all(
	Array.from({ length: Math.min(jobs, pages.length) }, async () => {
		const page = await openPage(browser.port, { width });
		for (let item = queue.shift(); item; item = queue.shift()) {
			await check(page, item).catch((error) => {
				const reason = String(error.message).split("\n")[0];
				console.log(`FAIL ${item.slug}\n     - probe error: ${reason}`);
				failed.push(item.slug);
			});
		}
		await page.close();
	}),
);

browser.close();
served?.close();
console.log(
	`\n${pages.length - failed.length}/${pages.length} pages passed${failed.length ? `; failed: ${failed.join(", ")}` : ""}`,
);
process.exit(failed.length ? 1 : 0);
