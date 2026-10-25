#!/usr/bin/env node
import {
	args,
	finding,
	isMain,
	report,
} from "../../baby-ui-design/scripts/lib/findings.mjs";
import { HELPERS, withPage } from "../../baby-ui-design/scripts/lib/page.mjs";

const HELP = `Usage: motion-probe.mjs <url> [--selector=CSS] [--json]

Opens and closes every disclosure and toggle in scope and reads the animations the browser
starts: duration, easing, properties, enter versus exit, keyframes on toggles, and how the
motion reacts to a second click mid-flight. Needs baby-ui-design installed beside it.`;

// Collects animations started since `since` (document timeline ms) anywhere on the page.
const STARTED = `(since) => document.getAnimations().filter((a) => (a.startTime ?? 0) >= since - 20).map((a) => {
	const t = a.effect?.getTiming?.() ?? {};
	const target = a.effect?.target;
	return {
		kind: a.constructor.name,
		prop: a.transitionProperty ?? a.animationName ?? "",
		duration: typeof t.duration === "number" ? t.duration : 0,
		easing: t.easing ?? "",
		iterations: t.iterations ?? 1,
		// Svelte and other WAAPI callers bake easing into sampled keyframes over a linear timing.
		frames: a.effect?.getKeyframes?.().length ?? 0,
		// Out of flow, a size change reflows nothing else (a sliding tab indicator).
		loose: target instanceof Element && /absolute|fixed/.test(getComputedStyle(target).position),
		// Number tickers, marquees and demos opt out of the UI budget with data-motion="explanatory".
		explanatory: Boolean(target?.closest?.("[data-motion=explanatory]")),
		target: target && window.__bui ? window.__bui.label(target) : "",
	};
})`;

const LAYOUT = /^(width|height|top|left|right|bottom|margin|padding|inset)/;

export async function motionProbe(url, { selector = "body" } = {}) {
	const out = [];
	const where = (what) => `${url} ${what}`;
	await withPage(url, { ready: selector }, async (page) => {
		await page.evaluate(HELPERS);
		await page.evaluate(`window.__started = ${STARTED}`);
		const count = await page.evaluate(
			`[...(document.querySelector(${JSON.stringify(selector)}) ?? document.body).querySelectorAll("[aria-expanded], [aria-pressed], [aria-selected], [role=switch], [role=tab], [role=checkbox], [role=radio], [role=option], label:has(input[type=radio]), label:has(input[type=checkbox])")].filter((e) => window.__bui.visible(e)).length`,
		);
		for (let i = 0; i < Math.min(count, 8); i++) {
			const pick = `[...(document.querySelector(${JSON.stringify(selector)}) ?? document.body).querySelectorAll("[aria-expanded], [aria-pressed], [aria-selected], [role=switch], [role=tab], [role=checkbox], [role=radio], [role=option], label:has(input[type=radio]), label:has(input[type=checkbox])")].filter((e) => window.__bui.visible(e))[${i}]`;
			if (!(await page.evaluate(`!!${pick}`))) break;
			const name = await page.evaluate(`window.__bui.label(${pick})`);
			const run = async () => {
				const since = await page.evaluate("document.timeline.currentTime");
				await page.evaluate(`${pick}?.click()`);
				await page.wait(60);
				return page.evaluate(`window.__started(${since})`);
			};
			// A control that starts open or pressed (a default-open group) exits on its first click.
			const startedOn = await page.evaluate(
				`["aria-expanded", "aria-pressed", "aria-checked"].some((a) => ${pick}?.getAttribute(a) === "true")`,
			);
			const firstClick = await run();
			await page.wait(500);
			const secondClick = await run();
			await page.wait(500);
			const [enter, exit] = startedOn
				? [secondClick, firstClick]
				: [firstClick, secondClick];
			// Mid-flight reversal: a keyframe animation restarts, a transition retargets.
			const first = await run();
			const again = await run();
			await page.wait(500);

			const ui = (list) =>
				list.filter((a) => a.iterations !== Infinity && a.duration > 0 && !a.explanatory);
			const longest = (list) => Math.max(0, ...ui(list).map((a) => a.duration));
			for (const a of ui([...enter, ...exit])) {
				if (/ease-in\b(?!-out)|cubic-bezier\(0\.42, 0, 1, 1\)/.test(a.easing))
					out.push(
						finding(
							"PRM-MOTION",
							"high",
							where(`${name} > ${a.target}`),
							`${a.prop} on ease-in`,
							"Enter on a strong ease-out; never ease-in on UI.",
						),
					);
				if (a.easing === "linear" && a.kind !== "CSSAnimation" && a.frames < 3)
					out.push(
						finding(
							"PRM-MOTION",
							"medium",
							where(`${name} > ${a.target}`),
							`${a.prop} on linear`,
							"Use an ease-out token; linear is for spinners and marquees.",
						),
					);
				if (a.duration > 400)
					out.push(
						finding(
							"PRM-MOTION",
							"medium",
							where(`${name} > ${a.target}`),
							`${a.prop} ${a.duration}ms`,
							"UI motion stays at or under 300ms; justify anything longer.",
						),
					);
				if (LAYOUT.test(a.prop) && !a.loose)
					out.push(
						finding(
							"PRM-PERF",
							"medium",
							where(`${name} > ${a.target}`),
							`animates ${a.prop}`,
							"Animate transform and opacity, or grid-template-rows for size.",
						),
					);
			}
			const [inMs, outMs] = [longest(enter), longest(exit)];
			if (inMs > 0 && outMs > inMs * 1.05)
				out.push(
					finding(
						"PRM-MOTION",
						"medium",
						where(name),
						`exit ${outMs}ms > enter ${inMs}ms`,
						"Exits run about 60 to 70% of the entrance.",
					),
				);
			if (
				ui(first).some((a) => a.kind === "CSSAnimation") &&
				ui(again).some((a) => a.kind === "CSSAnimation")
			)
				out.push(
					finding(
						"PRM-INTERRUPT",
						"high",
						where(name),
						"keyframes restart on a quick second click",
						"Use transitions or a spring so the motion retargets from where it is.",
					),
				);
		}
		if (!count)
			out.push(
				finding(
					"PRM-NOTE",
					"low",
					where(selector),
					"nothing to open or toggle in scope",
					"Probe the interactive parts directly, or review motion by hand.",
				),
			);
	});
	// One finding per rule and measurement, not one per digit or row that shares it.
	const seen = new Set();
	return out.filter((f) => {
		const key = `${f.rule}|${f.measured}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

if (isMain(import.meta.url)) {
	const { flags, options, positional } = args(process.argv.slice(2));
	if (flags.has("help") || !positional[0]) {
		console.log(HELP);
		process.exit(positional[0] ? 0 : 1);
	}
	report("Motion", await motionProbe(positional[0], { selector: options.selector }), {
		json: flags.has("json"),
	});
}
