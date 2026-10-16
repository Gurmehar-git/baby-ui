#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { auditPage } from "../../baby-ui-design/scripts/audit-page.mjs";
import { args, isMain } from "../../baby-ui-design/scripts/lib/findings.mjs";
import { scanPaths } from "../../baby-ui-design/scripts/scan-source.mjs";
import { motionProbe } from "./motion-probe.mjs";
import { statesProbe } from "./states-probe.mjs";

const HELP = `Usage: premium-score.mjs <url> [--selector=CSS] [--source=dir,dir] [--manual=key:n,...]
                         [--out=dir] [--json]

Scores a component against the premium rubric (references/premium.md): runs the page audit
in light, dark and 390px, the motion and state probes, and the source scan, then scores each
category 0 to 4. Purpose, UX laws and cohesion need a human score via --manual
(e.g. --manual=purpose:4,ux:3,cohesion:4); until then the verdict is Pending.`;

// Rubric categories and the rule prefixes that feed each one.
export const CATEGORIES = [
	["purpose", "Purpose and frequency", null],
	["motion", "Motion craft", /^(MOTION-00[1-5]|PRM-MOTION)/],
	[
		"interrupt",
		"Interruptibility and performance",
		/^(PRM-INTERRUPT|PRM-PERF|MOTION-006)/,
	],
	["compose", "Composition", /^COMPOSE-/],
	["states", "Micro-interactions and states", /^(PRM-STATE|STATE-)/],
	["materials", "Materials, depth and tokens", /^(SURF-|TOKEN-)/],
	["layout", "Layout, sizing and rhythm", /^(SIZE-|SPACE-|UX-00[45])/],
	["type", "Typography and copy", /^(TYPE-|COPY-)/],
	["a11y", "Accessibility", /^(A11Y-|COLOR-|UX-006)/],
	["ux", "UX laws and psychology", null],
	["cohesion", "Cohesion and identity", null],
];
const COST = { blocker: 4, high: 1.5, medium: 0.75, low: 0.25 };

/** Scores per category from findings plus hand scores; returns rows and the verdict. */
export function score(findings, manual = {}) {
	const rows = CATEGORIES.map(([key, title, match]) => {
		if (!match) return { key, title, score: manual[key] ?? null, findings: [] };
		const own = findings.filter((f) => match.test(f.rule));
		const s = Math.max(0, 4 - own.reduce((n, f) => n + COST[f.severity], 0));
		return { key, title, score: Math.round(s * 4) / 4, findings: own };
	});
	// A prop-driven monolith caps the whole score at 2.
	if (findings.some((f) => f.rule.startsWith("COMPOSE-")))
		for (const row of rows) if (row.score !== null) row.score = Math.min(row.score, 2);
	const blockers = findings.filter((f) => f.severity === "blocker").length;
	const pending = rows.filter((r) => r.score === null).map((r) => r.key);
	const pass =
		!blockers &&
		rows.every((r) => r.score === null || r.score >= 3) &&
		rows.find((r) => r.key === "motion")?.score === 4 &&
		rows.find((r) => r.key === "states")?.score === 4;
	const verdict = !pass ? "Block" : pending.length ? "Pending" : "Approve";
	return { rows, blockers, pending, verdict };
}

/** Source folders for a baby-ui component page, found from the slug at the end of the URL. */
function sourcesFor(url) {
	const slug = new URL(url).pathname.split("/").filter(Boolean).at(-1) ?? "";
	return [
		`components/${slug}/react`,
		`components/${slug}/svelte`,
		`pro/components/${slug}/react`,
		`pro/components/${slug}/svelte`,
	].filter((dir) => existsSync(dir));
}

export async function premiumScore(url, { selector = "body", source, manual = {} } = {}) {
	const dirs = source ? source.split(",") : sourcesFor(url);
	const findings = [
		...(await auditPage(url, { selector })),
		...(await auditPage(url, { selector, dark: true })),
		...(await auditPage(url, { selector, width: 390 })),
		...(await motionProbe(url, { selector })),
		...(await statesProbe(url, { selector })),
		...(dirs.length ? scanPaths(dirs) : []),
	];
	return { url, sources: dirs, ...score(findings, manual), findings };
}

export function markdown(result) {
	const lines = [
		`# Premium score: ${result.url}`,
		"",
		`Verdict: **${result.verdict}** (${result.blockers} blocker(s)${result.pending.length ? `; pending: ${result.pending.join(", ")}` : ""})`,
		"",
		"| Category | Score | Findings |",
		"| --- | --- | --- |",
		...result.rows.map(
			(r) => `| ${r.title} | ${r.score ?? "by hand"} | ${r.findings.length} |`,
		),
		"",
		"| Rule | Severity | Where | Measured | Fix |",
		"| --- | --- | --- | --- | --- |",
		...result.findings.map(
			(f) =>
				`| ${f.rule} | ${f.severity} | ${f.where.replace(/\|/g, "/")} | ${f.measured.replace(/\|/g, "/")} | ${f.fix} |`,
		),
	];
	return `${lines.join("\n")}\n`;
}

if (isMain(import.meta.url)) {
	const { flags, options, positional } = args(process.argv.slice(2));
	if (flags.has("help") || !positional[0]) {
		console.log(HELP);
		process.exit(positional[0] ? 0 : 1);
	}
	const manual = Object.fromEntries(
		(options.manual ?? "")
			.split(",")
			.filter(Boolean)
			.map((pair) => {
				const [k, v] = pair.split(":");
				return [k, Number(v)];
			}),
	);
	const result = await premiumScore(positional[0], {
		selector: options.selector ?? "body",
		source: options.source,
		manual,
	});
	if (options.out) {
		mkdirSync(options.out, { recursive: true });
		const name =
			new URL(positional[0]).pathname.split("/").filter(Boolean).at(-1) ?? "page";
		writeFileSync(join(options.out, `${name}.json`), JSON.stringify(result, null, "\t"));
		writeFileSync(join(options.out, `${name}.md`), markdown(result));
	}
	if (flags.has("json")) console.log(JSON.stringify(result, null, "\t"));
	else {
		console.log(`${result.verdict}  ${positional[0]}`);
		for (const r of result.rows)
			console.log(`  ${String(r.score ?? "-").padStart(4)}  ${r.title}`);
	}
	if (result.verdict === "Block") process.exitCode = 1;
}
