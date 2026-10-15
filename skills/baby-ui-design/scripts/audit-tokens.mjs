#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { contrast, parseColor } from "./lib/color.mjs";
import { resolve, themes } from "./lib/css.mjs";
import { args, finding, isMain, report } from "./lib/findings.mjs";

const HELP = `Usage: audit-tokens.mjs <tokens.css ...> [--json]

Measures a shadcn-style token file in light and dark: text pairs (4.5:1), the focus ring (3:1),
surface steps (page, card, muted, segment) and whether neutrals share one hue.`;

// [rule, foreground, background, floor]; text pairs then the ring.
const PAIRS = [
	["COLOR-001", "--foreground", "--background", 4.5],
	["COLOR-001", "--card-foreground", "--card", 4.5],
	["COLOR-001", "--popover-foreground", "--popover", 4.5],
	["COLOR-001", "--primary-foreground", "--primary", 4.5],
	["COLOR-001", "--secondary-foreground", "--secondary", 4.5],
	["COLOR-001", "--muted-foreground", "--background", 4.5],
	["COLOR-001", "--muted-foreground", "--card", 4.5],
	["COLOR-001", "--muted-foreground", "--popover", 4.5],
	["COLOR-001", "--muted-foreground", "--muted", 4.5],
	["COLOR-001", "--destructive-foreground", "--destructive", 4.5],
	["COLOR-001", "--success-foreground", "--success", 4.5],
	["COLOR-001", "--warning-foreground", "--warning", 4.5],
	["COLOR-001", "--info-foreground", "--info", 4.5],
	["COLOR-002", "--ring", "--background", 3],
];
const STEPS = ["--background", "--card", "--muted", "--segment"];

export function auditTokens(css, file = "tokens") {
	const out = [];
	for (const [mode, vars] of Object.entries(themes(css))) {
		const color = (name) => {
			const value = resolve(vars, name);
			return value ? parseColor(value) : null;
		};
		for (const [rule, fg, bg, floor] of PAIRS) {
			const a = color(fg);
			const b = color(bg);
			if (!a || !b) continue;
			const r = contrast(a, b);
			if (r < floor)
				out.push(
					finding(
						rule,
						"blocker",
						`${file} ${mode}`,
						`${fg} on ${bg} ${r.toFixed(2)}:1 < ${floor}`,
						`Darken or lighten one side until it clears ${floor}:1.`,
					),
				);
		}
		const steps = STEPS.map(color);
		for (let i = 1; i < steps.length; i++) {
			const [a, b] = [steps[i], steps[i - 1]];
			if (!a || !b) continue;
			const r = contrast(a, b);
			if (r < 1.05)
				out.push(
					finding(
						"SURF-001",
						"high",
						`${file} ${mode}`,
						`${STEPS[i]} over ${STEPS[i - 1]} ${r.toFixed(3)}:1 < 1.05`,
						"Separate the steps so nesting reads without a border.",
					),
				);
		}
		const hues = STEPS.map(color)
			.filter((c) => c?.oklch && c.oklch[1] > 0)
			.map((c) => Math.round(c.oklch[2]));
		const greys = STEPS.map(color).filter(
			(c) => c?.oklch && c.oklch[1] === 0 && c.oklch[0] > 0.01 && c.oklch[0] < 0.99,
		).length;
		if (new Set(hues).size > 1 || (hues.length && greys))
			out.push(
				finding(
					"SURF-002",
					"medium",
					`${file} ${mode}`,
					`neutral hues ${[...new Set(hues)].join(", ")}${greys ? `, ${greys} achromatic` : ""}`,
					"Give every neutral the same hue and a chroma of 0.004 or less.",
				),
			);
	}
	return out;
}

if (isMain(import.meta.url)) {
	const { flags, positional } = args(process.argv.slice(2));
	if (flags.has("help") || !positional.length) {
		console.log(HELP);
		process.exit(positional.length ? 0 : 1);
	}
	const findings = positional.flatMap((file) =>
		auditTokens(readFileSync(file, "utf8"), file),
	);
	report("Tokens", findings, { json: flags.has("json") });
}
