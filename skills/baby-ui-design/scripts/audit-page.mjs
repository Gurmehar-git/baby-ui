#!/usr/bin/env node
import { args, finding, isMain, report } from "./lib/findings.mjs";
import { HELPERS, withPage } from "./lib/page.mjs";

const HELP = `Usage: audit-page.mjs <url> [--selector=CSS] [--dark] [--width=PX] [--json]

Measures a live page (or the element matched by --selector) in a headless Chromium browser:
text contrast, accessible names, target sizes, keyboard focus, transitions, reduced motion,
layout shift while opening disclosures, horizontal overflow and console errors.
Set PROBE_BROWSER to pick a browser (Edge, Chrome, Brave or Chromium).`;

// Runs in the page; returns raw measurements for the scope.
const MEASURE = (selector) => `(() => {
	const scope = document.querySelector(${JSON.stringify(selector)}) ?? document.body;
	const { backdrop, ratio, visible, label } = window.__bui;
	const out = { contrast: [], names: [], targets: [], transitions: [], overflow: false };
	const all = [scope, ...scope.querySelectorAll("*")];
	const hits = [];
	for (const el of all) {
		if (!visible(el)) continue;
		const cs = getComputedStyle(el);
		const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
		if (own) {
			const bg = backdrop(el);
			if (bg) {
				const size = parseFloat(cs.fontSize), bold = Number(cs.fontWeight) >= 700;
				const floor = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
				const r = ratio(cs.color, bg);
				if (r < floor) out.contrast.push([label(el), +r.toFixed(2), floor]);
			}
		}
		const interactive = el.matches("button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=switch], [role=checkbox], [role=radio], [role=tab], [role=menuitem], [role=option], [role=slider]");
		if (interactive && !el.disabled) {
			const name = (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || el.getAttribute("title") || el.textContent || (el.labels && el.labels[0] && el.labels[0].textContent) || el.getAttribute("placeholder") || "").trim();
			if (!name && !el.querySelector("img[alt]:not([alt=''])")) out.names.push(label(el));
			// WCAG 2.5.8 inline exception: a target set in a sentence is bound by its line height.
			const inline = cs.display === "inline";
			if (!inline) hits.push([el, el.getBoundingClientRect()]);
		}
		const props = cs.transitionProperty.split(",").map((s) => s.trim());
		const durations = cs.transitionDuration.split(",").map((s) => parseFloat(s) * (s.includes("ms") ? 1 : 1000));
		const easings = cs.transitionTimingFunction.split(/,(?![^(]*\\))/).map((s) => s.trim());
		// Explanatory motion (tickers, marquees, a highlighter sweep) sits outside the UI budget.
		if (durations.some((d) => d > 0) && !el.closest("[data-motion=explanatory]"))
			out.transitions.push([label(el), props, durations, easings]);
	}
	// WCAG 2.5.8 spacing exception: a small target passes if its 24px circle touches no other target.
	const small = (r) => Math.min(r.width, r.height) < 24;
	const centre = (r) => [r.x + r.width / 2, r.y + r.height / 2];
	for (const [el, r] of hits) {
		if (!small(r)) continue;
		const [x, y] = centre(r);
		const crowded = hits.some(([other, o]) => {
			if (other === el || other.contains(el) || el.contains(other)) return false;
			if (small(o)) return Math.hypot(x - centre(o)[0], y - centre(o)[1]) < 24;
			const dx = Math.max(o.left - x, 0, x - o.right), dy = Math.max(o.top - y, 0, y - o.bottom);
			return Math.hypot(dx, dy) < 12;
		});
		if (crowded) out.targets.push([label(el), Math.round(r.width) + "x" + Math.round(r.height)]);
	}
	out.overflow = document.documentElement.scrollWidth - innerWidth > 1;
	return out;
})()`;

// Tabs to the first focusable in scope and reports whether anything visible changed.
const FOCUS = (selector) => `(() => {
	const scope = document.querySelector(${JSON.stringify(selector)}) ?? document.body;
	const el = [...scope.querySelectorAll("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])")].find((e) => window.__bui.visible(e) && !e.disabled);
	if (!el) return null;
	const snap = () => { const cs = getComputedStyle(el); return [cs.outlineStyle + cs.outlineWidth + cs.outlineColor, cs.boxShadow, cs.borderColor, cs.backgroundColor].join("|"); };
	el.blur();
	const rest = snap();
	return { label: window.__bui.label(el), rest, id: (el.dataset.buiFocus = "1") };
})()`;

export async function auditPage(
	url,
	{ selector = "body", dark = false, width = 1280 } = {},
) {
	const where = (what) =>
		`${url}${selector === "body" ? "" : ` ${selector}`} ${dark ? "dark" : "light"} ${width}px: ${what}`;
	const out = [];
	await withPage(url, { dark, width, ready: selector }, async (page) => {
		await page.evaluate(HELPERS);
		const m = await page.evaluate(MEASURE(selector));
		for (const [el, r, floor] of m.contrast)
			out.push(
				finding(
					"COLOR-001",
					"blocker",
					where(el),
					`${r}:1 < ${floor}`,
					"Raise the text or surface step until it clears the floor.",
				),
			);
		for (const el of m.names)
			out.push(
				finding(
					"A11Y-001",
					"blocker",
					where(el),
					"no accessible name",
					"Add visible text or an aria-label.",
				),
			);
		for (const [el, size] of m.targets)
			out.push(
				finding(
					"A11Y-002",
					"high",
					where(el),
					`target ${size} < 24px`,
					"Grow the hit area to 24px (44px on touch layouts).",
				),
			);
		for (const [el, props, durations, easings] of m.transitions) {
			if (props.includes("all"))
				out.push(
					finding(
						"MOTION-001",
						"high",
						where(el),
						"transition: all",
						"List only the properties that change.",
					),
				);
			if (easings.some((e) => e === "ease-in" || e === "cubic-bezier(0.42, 0, 1, 1)"))
				out.push(
					finding(
						"MOTION-002",
						"high",
						where(el),
						"ease-in",
						"Enter on ease-out, move on ease-in-out.",
					),
				);
			const slow = durations.filter(
				(d, i) => d > 500 && !/opacity|stroke|background-position/.test(props[i] ?? ""),
			);
			if (slow.length)
				out.push(
					finding(
						"MOTION-005",
						"medium",
						where(el),
						`${Math.max(...slow)}ms on ${props.join(", ")}`,
						"Keep UI motion at or under 300ms unless it is ambient or explanatory.",
					),
				);
		}
		if (m.overflow)
			out.push(
				finding(
					"UX-005",
					"high",
					where("page"),
					"horizontal overflow",
					"Contain wide content or let it wrap.",
				),
			);

		const focus = await page.evaluate(FOCUS(selector));
		if (focus) {
			await page.evaluate(
				`document.querySelector("[data-bui-focus]")?.focus({ focusVisible: true })`,
			);
			await page.key("Shift", "ShiftLeft", 16);
			const after = await page.evaluate(
				`(() => { const el = document.querySelector("[data-bui-focus]"); const cs = getComputedStyle(el); return [cs.outlineStyle + cs.outlineWidth + cs.outlineColor, cs.boxShadow, cs.borderColor, cs.backgroundColor].join("|"); })()`,
			);
			if (after === focus.rest)
				out.push(
					finding(
						"STATE-001",
						"blocker",
						where(focus.label),
						"keyboard focus changes nothing",
						"Show a focus ring or edge on :focus-visible.",
					),
				);
		}

		// Opens each closed disclosure with real clicks, so shifts the click caused count as input-driven, as in CLS.
		await page.evaluate(`(() => {
			window.__shift = 0;
			window.__po = new PerformanceObserver((list) => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__shift += e.value; });
			window.__po.observe({ type: "layout-shift", buffered: false });
		})()`);
		const triggers = `[...(document.querySelector(${JSON.stringify(selector)}) ?? document.body).querySelectorAll("[aria-expanded=false]")].slice(0, 6)`;
		const count = await page.evaluate(`${triggers}.length`);
		for (let i = 0; i < count; i++) {
			const at = await page.evaluate(
				`(() => { const t = ${triggers}[${i}]; if (!t) return null; t.scrollIntoView({ block: "center" }); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`,
			);
			if (!at) continue;
			for (const wait of [450, 350]) {
				await page.send("Input.dispatchMouseEvent", {
					type: "mousePressed",
					...at,
					button: "left",
					clickCount: 1,
				});
				await page.send("Input.dispatchMouseEvent", {
					type: "mouseReleased",
					...at,
					button: "left",
					clickCount: 1,
				});
				await page.wait(wait);
			}
		}
		const shift = await page.evaluate(
			"(() => { window.__po.disconnect(); return +window.__shift.toFixed(3); })()",
		);
		if (shift > 0.02)
			out.push(
				finding(
					"UX-004",
					"high",
					where("disclosures"),
					`layout shift ${shift}`,
					"Reserve space or overlay the opened content.",
				),
			);

		for (const e of page.errors)
			out.push(
				finding("UX-006", "blocker", where("console"), e.slice(0, 120), "Fix the error."),
			);
	});

	// Reduced motion: anything still travelling is a finding.
	await withPage(url, { dark, width, reduce: true, ready: selector }, async (page) => {
		const moving = await page.evaluate(`(() => {
			const scope = document.querySelector(${JSON.stringify(selector)}) ?? document.body;
			return document.getAnimations().filter((a) => a.playState === "running" && scope.contains(a.effect?.target ?? null) && /transform|translate|scale|rotate|left|top/.test(JSON.stringify(a.effect?.getKeyframes?.() ?? []))).map((a) => window.__bui ? window.__bui.label(a.effect.target) : (a.effect.target.getAttribute("data-slot") || a.effect.target.className.toString().slice(0, 40)) + " " + (a.animationName || a.transitionProperty));
		})()`);
		for (const el of moving)
			out.push(
				finding(
					"MOTION-006",
					"high",
					where(el),
					"still moves under reduced motion",
					"Under prefers-reduced-motion keep opacity, drop travel.",
				),
			);
	});
	return out;
}

if (isMain(import.meta.url)) {
	const { flags, options, positional } = args(process.argv.slice(2));
	const url = positional[0];
	if (flags.has("help") || !url) {
		console.log(HELP);
		process.exit(url ? 0 : 1);
	}
	const findings = await auditPage(url, {
		selector: options.selector ?? "body",
		dark: flags.has("dark"),
		width: Number(options.width ?? 1280),
	});
	report("Page", findings, { json: flags.has("json") });
}
