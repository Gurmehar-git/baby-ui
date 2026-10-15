import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildReport, toMarkdown } from "../skills/baby-ui-design/scripts/report.mjs";
import {
	markdown,
	premiumScore,
} from "../skills/baby-ui-premium/scripts/premium-score.mjs";
import { serveBuild } from "./probe/serve.mjs";

const HELP = `Usage: pnpm design:audit <slug ...> [--url=URL]
       pnpm design:premium <slug ...> [--url=URL] [--manual=purpose:4,ux:4,cohesion:4]

Runs the baby-ui-design audit or the baby-ui-premium score on component pages, writing to
.notes/design/ and .notes/premium/. Without --url it serves the last \`pnpm build\`.`;

const [mode, ...rest] = process.argv.slice(2);
const option = (name) =>
	rest
		.find((a) => a.startsWith(`--${name}=`))
		?.split("=")
		.slice(1)
		.join("=");
const slugs = rest.filter((a) => !a.startsWith("--"));
if (!["audit", "premium"].includes(mode ?? "") || !slugs.length) {
	console.log(HELP);
	process.exit(1);
}

const served = option("url") ? null : await serveBuild();
const base = (option("url") ?? served?.url ?? "").replace(/\/$/, "");
const catalog = await (await fetch(`${base}/catalog.json`)).json();
const manual = Object.fromEntries(
	(option("manual") ?? "")
		.split(",")
		.filter(Boolean)
		.map((p) => [p.split(":")[0], Number(p.split(":")[1])]),
);
const out = option("out") ?? join(".notes", mode === "audit" ? "design" : "premium");
mkdirSync(out, { recursive: true });
let failed = 0;

for (const slug of slugs) {
	const item = catalog.find((c) => c.slug === slug);
	if (!item) {
		console.warn(`Not in the catalog: ${slug}`);
		failed++;
		continue;
	}
	const url = `${base}${item.href}`;
	const selector = "[data-demo-canvas]";
	if (mode === "audit") {
		const sources = [
			`packages/ui-react/src/${slug}`,
			`packages/ui-svelte/src/lib/${slug}`,
			`pro/packages/react/src/${slug}`,
			`pro/packages/svelte/src/lib/${slug}`,
		];
		const r = await buildReport({
			source: sources.filter((s) => existsSync(s)),
			urls: [url],
			selector,
		});
		writeFileSync(join(out, `${slug}.md`), toMarkdown(r));
		console.log(`${String(r.score).padStart(3)}/100  ${r.blockers} blocker(s)  ${slug}`);
		if (r.blockers) failed++;
	} else {
		const r = await premiumScore(url, { selector, manual });
		writeFileSync(join(out, `${slug}.json`), JSON.stringify(r, null, "\t"));
		writeFileSync(join(out, `${slug}.md`), markdown(r));
		console.log(
			`${r.verdict.padEnd(8)} ${r.rows.map((row) => row.score ?? "-").join(" ")}  ${slug}`,
		);
		if (r.verdict === "Block") failed++;
	}
}
served?.close();
process.exit(failed ? 1 : 0);
