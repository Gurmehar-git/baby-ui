import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { auditPage } from "../scripts/audit-page.mjs";
import { auditTokens } from "../scripts/audit-tokens.mjs";
import { contrast, parseColor } from "../scripts/lib/color.mjs";
import { scanText } from "../scripts/scan-source.mjs";

const rules = (findings) => new Set(findings.map((f) => f.rule));

test("contrast matches WCAG for black on white and composites alpha", () => {
	assert.equal(Math.round(contrast(parseColor("#000"), parseColor("#fff"))), 21);
	const half = contrast(parseColor("rgba(0,0,0,0.5)"), parseColor("#fff"));
	assert.ok(half > 3 && half < 5, `half black on white ${half}`);
	assert.ok(parseColor("oklch(55% 0.18 255)")?.oklch);
});

test("token audit fails a weak label, a flat ladder and mixed hues; passes a good file", () => {
	const bad = `:root {
	--background: oklch(100% 0 0);
	--foreground: oklch(16% 0.002 265);
	--card: oklch(99.5% 0.002 120);
	--muted: oklch(95% 0.004 265);
	--muted-foreground: oklch(50% 0.004 265);
	--primary: oklch(80% 0.1 255);
	--primary-foreground: oklch(99% 0 0);
}
`;
	const found = rules(auditTokens(bad));
	for (const id of ["COLOR-001", "SURF-001", "SURF-002"]) assert.ok(found.has(id), id);
	const good = `:root {
	--background: oklch(100% 0 0);
	--foreground: oklch(16% 0.002 265);
	--card: oklch(97.5% 0.001 265);
	--muted: oklch(95.3% 0.002 265);
	--muted-foreground: oklch(50% 0.004 265);
	--primary: oklch(55% 0.18 255);
	--primary-foreground: oklch(99% 0 0);
}
`;
	assert.deepEqual(auditTokens(good), []);
});

test("source scan flags each pattern and a prop-driven monolith", () => {
	const text = [
		'const a = "bg-[#ff0000] text-blue-500 transition-all ease-in scale-0 duration-300 shadow-2xl text-[13px]";',
		"const b = 'Copy with a dash \u2014 here';",
		"export interface CardProps {",
		"	title: string;",
		"	description?: string;",
		"	actions?: ReactNode;",
		"}",
	].join("\n");
	const found = rules(scanText(text, "x.tsx"));
	for (const id of [
		"TOKEN-001",
		"TOKEN-002",
		"MOTION-001",
		"MOTION-002",
		"MOTION-003",
		"MOTION-004",
		"SURF-003",
		"TYPE-001",
		"COPY-001",
		"COMPOSE-001",
	])
		assert.ok(found.has(id), id);
	assert.deepEqual(
		scanText('const ok = "bg-primary duration-(--duration-fast) ease-in-out";', "ok.ts"),
		[],
	);
});

const browser =
	[
		"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
		"C:/Program Files/Google/Chrome/Application/chrome.exe",
		"/usr/bin/google-chrome",
		"/usr/bin/chromium",
		"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	].some(existsSync) || Boolean(process.env.PROBE_BROWSER);

test("page audit fails the known-bad fixture", {
	skip: !browser && "no Chromium browser",
}, async () => {
	const url = pathToFileURL(
		new URL("./fixtures/bad.html", import.meta.url).pathname.replace(/^\/(\w:)/, "$1"),
	).href;
	const found = rules(await auditPage(url, { selector: "#scope" }));
	for (const id of [
		"COLOR-001",
		"A11Y-001",
		"A11Y-002",
		"MOTION-001",
		"MOTION-002",
		"MOTION-005",
		"STATE-001",
	])
		assert.ok(found.has(id), `${id} in ${[...found].join(", ")}`);
});
