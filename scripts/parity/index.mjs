import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { join } from "node:path";
import { launch, openPage } from "../../skills/baby-ui-design/scripts/lib/browser.mjs";
import { ROOT } from "../gen/core.mjs";
import { compareSnapshots, SNAPSHOT } from "./compare.mjs";
import { runners } from "./runners.mjs";

const HELP = `Usage: pnpm parity [slug ...] [options]

Renders each component's demo in the React and Svelte runners and compares them part by part
(data-slot): which parts render, their ARIA, layout and type styles, sizes, console errors and
controls without an accessible name. Then it clicks the first trigger part in both, compares the
open state, presses Escape and compares again.

  slug ...        components to check
  --all           every component with a demo in both ports
  --warn          also list style and size drift (counted either way)
  --react=URL     React runner (default: the running react-runner, else one started here)
  --svelte=URL    Svelte runner (default: the running svelte-runner, else one started here)
  --json=PATH     write every issue as JSON
  --update        record today's errors as known in scripts/parity/baseline.json
  --jobs=N        components checked at once (default: cores - 1, max 2)

Errors already in the baseline are reported as known and do not fail the run; a fixed one is
reported so the baseline can shrink (--update).
`;
const BASELINE = join(ROOT, "scripts/parity/baseline.json");

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) =>
	args
		.find((a) => a.startsWith(`--${name}=`))
		?.split("=")
		.slice(1)
		.join("=");

/** Slugs with a demo in both ports, read from the generated demo indexes. */
function bothPorts() {
	const keys = (path) =>
		new Set(
			[
				...readFileSync(join(ROOT, path), "utf8").matchAll(
					/^\t"?([a-z0-9-]+)"?: \(\) =>/gm,
				),
			].map((m) => m[1]),
		);
	const svelte = keys("packages/demos/src/svelte/index.ts");
	return [...keys("packages/demos/src/react/index.tsx")]
		.filter((s) => svelte.has(s))
		.sort();
}

/** Each spec's initial dial values, as the playground shell sends them; demos expect them. */
function defaultProps() {
	const script = [
		'const { specs } = await import("./components/specs.ts");',
		'const { defaultProps } = await import("./packages/registry-schema/src/spec.ts");',
		"console.log(JSON.stringify(Object.fromEntries(specs.map((s) => [s.slug, defaultProps(s)]))));",
	].join(" ");
	const out = spawnSync("bun", ["-e", script], {
		cwd: ROOT,
		encoding: "utf8",
		maxBuffer: 16 * 1024 * 1024,
	});
	if (out.status !== 0) throw new Error(`could not read spec defaults: ${out.stderr}`);
	return JSON.parse(out.stdout);
}

const TRIGGER = `(() => {
	const el = [...document.querySelectorAll('[data-slot$="trigger"]')].find((t) => {
		const r = t.getBoundingClientRect();
		return r.width > 0 && r.height > 0;
	});
	if (!el) return null;
	const r = el.getBoundingClientRect();
	return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
})()`;
const PARTS = `document.querySelectorAll("[data-slot]").length`;
const ELEMENTS = `document.querySelector("#root > div, #app > div")?.querySelectorAll("*").length ?? 0`;

/** Waits until the demo has rendered and its part count holds still (lazy chunks, effects). */
async function settle(page, timeout = 20000) {
	let last = -1;
	let steady = 0;
	for (const end = Date.now() + timeout; Date.now() < end; ) {
		const count = await page.evaluate(PARTS).catch(() => 0);
		steady = count > 0 && count === last ? steady + 1 : 0;
		if (steady >= 2) return count;
		last = count;
		await page.wait(250);
	}
	return Math.max(last, 0);
}

/** A cold dev server optimizes deps on first load and reloads the page; take that hit once here. */
async function warm(port, urls) {
	for (const url of Object.values(urls)) {
		const page = await openPage(port);
		try {
			await page.goto(`${url}/?slug=button`);
			await settle(page, 90000);
		} finally {
			await page.close();
		}
	}
}

async function capture(page, url) {
	await page.goto(url);
	const parts = await settle(page);
	const states = { rest: await page.evaluate(SNAPSHOT) };
	const trigger = parts > 0 ? await page.evaluate(TRIGGER) : null;
	if (trigger) {
		await page.click(trigger.x, trigger.y);
		await page.wait(700);
		states.open = await page.evaluate(SNAPSHOT);
		await page.key("Escape", "Escape", 27);
		await page.wait(700);
		states.closed = await page.evaluate(SNAPSHOT);
	}
	const elements = parts ? 0 : await page.evaluate(ELEMENTS).catch(() => 0);
	return { parts, elements, states, errors: [...page.errors] };
}

async function check(port, urls, slug, props = {}) {
	const query = `/?slug=${encodeURIComponent(slug)}&props=${encodeURIComponent(JSON.stringify(props))}`;
	const issues = [];
	const results = {};
	for (const framework of ["react", "svelte"]) {
		const page = await openPage(port);
		try {
			results[framework] = await capture(page, `${urls[framework]}${query}`);
		} finally {
			await page.close();
		}
	}
	const { react, svelte } = results;
	for (const [name, r] of [
		["React", react],
		["Svelte", svelte],
	]) {
		if (!r.parts)
			issues.push({
				level: "error",
				state: "rest",
				message: r.elements
					? `${name}: renders no data-slot part, so nothing can be compared`
					: `${name}: the demo rendered nothing`,
			});
		for (const e of r.errors) {
			// First line only: stack frames hold machine paths. Origins and cache queries vary per run.
			const message = (e.split("\n")[0] ?? "")
				.replace(/https?:\/\/[^/\s)]+/g, "<runner>")
				.replace(/\?[vt]=[\w.-]+/g, "")
				.slice(0, 200);
			issues.push({
				level: "error",
				state: "rest",
				message: `${name} console: ${message}`,
			});
		}
	}
	if (react.parts && svelte.parts) {
		for (const state of ["rest", "open", "closed"]) {
			const [a, b] = [react.states[state], svelte.states[state]];
			if (a && b) issues.push(...compareSnapshots(a, b, state));
			else if (a || b)
				issues.push({
					level: "error",
					state,
					message: `only ${a ? "React" : "Svelte"} has a visible trigger part`,
				});
		}
	}
	return issues;
}

const slugs = flag("all") ? bothPorts() : args.filter((a) => !a.startsWith("--"));
if (flag("help") || !slugs.length) {
	console.log(HELP);
	process.exit(flag("help") ? 0 : 1);
}

const defaults = defaultProps();
const servers = await runners({ react: option("react"), svelte: option("svelte") });
const browser = await launch();
const jobs = Math.max(
	1,
	Number(option("jobs")) || Math.min(availableParallelism() - 1, 2),
);
const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : {};
const key = (i) => `${i.state}: ${i.message}`;
const report = {};
const queue = [...slugs];
let failed = 0;
let fixed = 0;
try {
	await warm(browser.port, servers.urls);
	await Promise.all(
		Array.from({ length: Math.min(jobs, queue.length) }, async () => {
			for (let slug = queue.shift(); slug; slug = queue.shift()) {
				const issues = await check(
					browser.port,
					servers.urls,
					slug,
					defaults[slug],
				).catch((e) => [
					{ level: "error", state: "rest", message: `check failed: ${e.message}` },
				]);
				report[slug] = issues;
				const known = new Set(baseline[slug] ?? []);
				const errors = issues.filter((i) => i.level === "error");
				const fresh = errors.filter((i) => !known.has(key(i)));
				const gone = [...known].filter((k) => !errors.some((i) => key(i) === k));
				const warns = issues.length - errors.length;
				if (fresh.length) failed++;
				fixed += gone.length;
				const notes = [
					fresh.length && `${fresh.length} new error(s)`,
					errors.length - fresh.length && `${errors.length - fresh.length} known`,
					gone.length && `${gone.length} fixed`,
					warns && `${warns} drift`,
				].filter(Boolean);
				console.log(
					`${fresh.length ? "FAIL" : "ok  "} ${slug}${notes.length ? `  ${notes.join(", ")}` : ""}`,
				);
				for (const i of issues)
					if (fresh.includes(i) || (i.level === "warn" && flag("warn")))
						console.log(`       ${key(i)}`);
				for (const k of gone) console.log(`       fixed: ${k}`);
			}
		}),
	);
} finally {
	browser.close();
	servers.close();
}
const json = option("json");
if (json) writeFileSync(json, `${JSON.stringify(report, null, 2)}\n`);
if (flag("update")) {
	const next = { ...baseline };
	for (const [slug, issues] of Object.entries(report)) {
		const errors = issues.filter((i) => i.level === "error").map(key);
		if (errors.length) next[slug] = [...new Set(errors)].sort();
		else delete next[slug];
	}
	const sorted = Object.fromEntries(
		Object.entries(next).sort(([a], [b]) => (a < b ? -1 : 1)),
	);
	writeFileSync(BASELINE, `${JSON.stringify(sorted, null, "\t")}\n`);
	console.log(
		`parity: baseline updated (${Object.keys(sorted).length} components with known errors)`,
	);
}
console.log(
	`parity: ${slugs.length} checked, ${failed} with new errors${fixed ? `, ${fixed} known error(s) fixed` : ""}`,
);
process.exitCode = failed && !flag("update") ? 1 : 0;
