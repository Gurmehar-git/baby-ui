#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { auditPage } from "./audit-page.mjs";
import { auditTokens } from "./audit-tokens.mjs";
import { args, isMain } from "./lib/findings.mjs";
import { scanPaths } from "./scan-source.mjs";

const HELP = `Usage: report.mjs [--tokens=a.css,b.css] [--source=dir,dir] [--url=URL,URL]
                  [--selector=CSS] [--out=dir] [--json]

Runs the token audit, the source scan and the page audit (light, dark, 390px) and writes
design-audit.md and design-audit.json to --out (default .notes/, else .local/).`;

const WEIGHT = { blocker: 10, high: 4, medium: 2, low: 0.5 };

export async function buildReport({
	tokens = [],
	source = [],
	urls = [],
	selector = "body",
}) {
	const findings = [
		...tokens.flatMap((file) => auditTokens(readFileSync(file, "utf8"), file)),
		...(source.length ? scanPaths(source) : []),
	];
	for (const url of urls)
		for (const opts of [{}, { dark: true }, { width: 390 }])
			findings.push(...(await auditPage(url, { selector, ...opts })));
	const byFamily = {};
	for (const f of findings) {
		const family = f.rule.split("-")[0];
		byFamily[family] = (byFamily[family] ?? 0) + WEIGHT[f.severity];
	}
	const score = Math.max(0, 100 - Object.values(byFamily).reduce((a, b) => a + b, 0));
	return {
		score,
		blockers: findings.filter((f) => f.severity === "blocker").length,
		byFamily,
		findings,
	};
}

export function toMarkdown(r) {
	return [
		`# Design audit: ${r.score}/100, ${r.blockers} blocker(s)`,
		"",
		"| Family | Weighted findings |",
		"| --- | --- |",
		...Object.entries(r.byFamily).map(([k, v]) => `| ${k} | ${v} |`),
		"",
		"| Rule | Severity | Where | Measured | Fix |",
		"| --- | --- | --- | --- | --- |",
		...r.findings
			.sort((a, b) => WEIGHT[b.severity] - WEIGHT[a.severity])
			.map(
				(f) =>
					`| ${f.rule} | ${f.severity} | ${f.where.replace(/\|/g, "/")} | ${f.measured.replace(/\|/g, "/")} | ${f.fix} |`,
			),
		"",
	].join("\n");
}

if (isMain(import.meta.url)) {
	const { flags, options } = args(process.argv.slice(2));
	const list = (v) => (v ? v.split(",").filter(Boolean) : []);
	const input = {
		tokens: list(options.tokens),
		source: list(options.source),
		urls: list(options.url),
		selector: options.selector ?? "body",
	};
	if (
		flags.has("help") ||
		(!input.tokens.length && !input.source.length && !input.urls.length)
	) {
		console.log(HELP);
		process.exit(flags.has("help") ? 0 : 1);
	}
	const r = await buildReport(input);
	const out = options.out ?? (existsSync(".notes") ? ".notes" : ".local");
	mkdirSync(out, { recursive: true });
	writeFileSync(join(out, "design-audit.json"), JSON.stringify(r, null, "\t"));
	writeFileSync(join(out, "design-audit.md"), toMarkdown(r));
	if (flags.has("json")) console.log(JSON.stringify(r, null, "\t"));
	else
		console.log(
			`Design audit ${r.score}/100, ${r.blockers} blocker(s): ${join(out, "design-audit.md")}`,
		);
	if (r.blockers) process.exitCode = 1;
}
