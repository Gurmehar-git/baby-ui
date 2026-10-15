#!/usr/bin/env node
import {
	args,
	finding,
	isMain,
	report,
} from "../../baby-ui-design/scripts/lib/findings.mjs";
import { HELPERS, withPage } from "../../baby-ui-design/scripts/lib/page.mjs";

const HELP = `Usage: states-probe.mjs <url> [--selector=CSS] [--json]

Drives rest, hover, press and keyboard focus on each control in scope and diffs the computed
styles. A state that looks the same as rest is a finding. Needs baby-ui-design beside it.`;

// Children and a wrapping label count too: a switch stretches its thumb, a radio card edges, an icon tints.
const SNAP = `(el) => { const cs = getComputedStyle(el); const box = el.closest("label"); const kids = [...(box ? [box] : []), ...el.querySelectorAll("*")].slice(0, 9).map((c) => { const k = getComputedStyle(c); return k.transform + k.scale + k.color + k.backgroundColor + k.borderColor + k.opacity; }); return [cs.backgroundColor, cs.color, cs.borderColor, cs.boxShadow, cs.outlineStyle + cs.outlineColor, cs.transform, cs.scale, cs.opacity, cs.textDecorationLine, cs.textDecorationColor, ...kids].join("|"); }`;

// The selected segment or tab: clicking it does nothing, so it owes no hover or press.
const CURRENT =
	"[aria-pressed=true], [aria-selected=true], [data-state=on], [data-state=active], [role=radio][aria-checked=true]";

export async function statesProbe(url, { selector = "body" } = {}) {
	const out = [];
	await withPage(url, { ready: selector }, async (page) => {
		await page.evaluate(HELPERS);
		await page.evaluate(`window.__snap = ${SNAP}`);
		const list = `[...(document.querySelector(${JSON.stringify(selector)}) ?? document.body).querySelectorAll("button, a[href], [role=button], [role=switch], [role=tab], [role=checkbox], [role=option]")].filter((e) => window.__bui.visible(e) && !e.disabled)`;
		const count = await page.evaluate(`${list}.length`);
		for (let i = 0; i < Math.min(count, 12); i++) {
			const pick = `${list}[${i}]`;
			if (!(await page.evaluate(`!!${pick}`))) break;
			// Aim at the first line box: a link that wraps has its bounding-box centre in the gap.
			const box = await page.evaluate(
				`(() => { const el = ${pick}; el.scrollIntoView({ block: "center" }); const r = el.getClientRects()[0] ?? el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, name: window.__bui.label(el), current: el.matches(${JSON.stringify(CURRENT)}), inline: el.tagName === "A" && getComputedStyle(el).display === "inline" }; })()`,
			);
			await page.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 1, y: 1 });
			await page.wait(250);
			const rest = await page.evaluate(`window.__snap(${pick})`);
			await page.send("Input.dispatchMouseEvent", {
				type: "mouseMoved",
				x: box.x,
				y: box.y,
			});
			await page.wait(250);
			const hover = await page.evaluate(`window.__snap(${pick})`);
			await page.send("Input.dispatchMouseEvent", {
				type: "mousePressed",
				x: box.x,
				y: box.y,
				button: "left",
				clickCount: 1,
			});
			await page.wait(120);
			const press = await page.evaluate(`window.__snap(${pick})`);
			await page.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 1, y: 1 });
			await page.send("Input.dispatchMouseEvent", {
				type: "mouseReleased",
				x: 1,
				y: 1,
				button: "left",
				clickCount: 1,
			});
			await page.key("Escape", "Escape", 27);
			await page.wait(300);
			await page.evaluate(
				`(() => { const el = ${pick}; el.blur(); el.focus({ focusVisible: true }); })()`,
			);
			await page.key("Shift", "ShiftLeft", 16);
			await page.wait(200);
			const focus = await page.evaluate(`window.__snap(${pick})`);
			await page.evaluate(`${pick}.blur()`);
			const where = `${url} ${box.name}`;
			if (hover === rest && !box.current)
				out.push(
					finding(
						"PRM-STATE",
						"medium",
						where,
						"hover changes nothing",
						"Give hover a tint or edge (fine pointers only).",
					),
				);
			// An inline text link answers on hover; squishing a word mid-sentence reads as a glitch.
			if (press === hover && press === rest && !box.current && !box.inline)
				out.push(
					finding(
						"PRM-STATE",
						"medium",
						where,
						"press gives no feedback",
						"Squish on press: scale to the press token on pointer-down.",
					),
				);
			if (focus === rest)
				out.push(
					finding(
						"PRM-STATE",
						"blocker",
						where,
						"keyboard focus changes nothing",
						"Show a ring or edge on :focus-visible.",
					),
				);
		}
	});
	return out;
}

if (isMain(import.meta.url)) {
	const { flags, options, positional } = args(process.argv.slice(2));
	if (flags.has("help") || !positional[0]) {
		console.log(HELP);
		process.exit(positional[0] ? 0 : 1);
	}
	report("States", await statesProbe(positional[0], { selector: options.selector }), {
		json: flags.has("json"),
	});
}
