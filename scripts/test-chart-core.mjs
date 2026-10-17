import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

// Package sources import siblings without extensions; resolve them to `.ts` here.
registerHooks({
	resolve(specifier, context, next) {
		try {
			return next(specifier, context);
		} catch (error) {
			if (!specifier.startsWith(".")) throw error;
			return next(`${specifier}.ts`, context);
		}
	},
});

import {
	announceRows,
	chartStyleCss,
	evenTickIndices,
	hoverThrottle,
	interpolatePoints,
	nearestIndex,
	nextPhase,
	resolveDomain,
	shouldTweenDomain,
} from "../components/chart/core.ts";
import { cubicBezier, Spring, tween } from "../components/chart/motion.ts";

test("cubicBezier matches the CSS curve at its endpoints and midpoint", () => {
	const ease = cubicBezier(0.85, 0, 0.15, 1);
	assert.equal(ease(0), 0);
	assert.equal(ease(1), 1);
	assert.ok(Math.abs(ease(0.5) - 0.5) < 1e-4);
	assert.ok(ease(0.25) < 0.1, "slow start");
	const linear = cubicBezier(0.25, 0.25, 0.75, 0.75);
	assert.ok(Math.abs(linear(0.3) - 0.3) < 1e-4);
});

test("tween settles synchronously at zero duration", () => {
	const seen = [];
	let done = false;
	tween({ duration: 0, onUpdate: (p) => seen.push(p), onComplete: () => (done = true) });
	assert.deepEqual(seen, [1]);
	assert.ok(done);
});

test("spring settles on target and keeps velocity across a retarget", async () => {
	const values = [];
	const spring = new Spring(0, { stiffness: 300, damping: 30 }, (v) => values.push(v));
	spring.set(100);
	await new Promise((r) => setTimeout(r, 80));
	const mid = spring.value;
	assert.ok(mid > 0 && mid < 100, `moving at 80ms: ${mid}`);
	spring.set(0);
	await new Promise((r) => setTimeout(r, 20));
	assert.ok(spring.value > mid - 40, "no jump back on retarget");
	await new Promise((r) => setTimeout(r, 1200));
	assert.equal(values.at(-1), 0);
});

test("underdamped spring overshoots by the documented amount", async () => {
	let peak = 0;
	const spring = new Spring(
		0,
		{ stiffness: 400, damping: 20 },
		(v) => (peak = Math.max(peak, v)),
	);
	spring.set(100);
	await new Promise((r) => setTimeout(r, 900));
	assert.ok(peak > 112 && peak < 120, `peak ${peak}, expected ~116.3`);
});

test("resolveDomain follows the headroom rules", () => {
	assert.deepEqual(resolveDomain([{ a: 10 }, { a: 90 }], ["a"]), [0, 100]);
	const mixed = resolveDomain([{ a: -50 }, { a: 50 }], ["a"]);
	assert.ok(mixed[0] <= -55 && mixed[1] >= 55);
	assert.deepEqual(resolveDomain([], ["a"]), [0, 100]);
});

test("shouldTweenDomain skips sub-2% moves", () => {
	assert.equal(shouldTweenDomain([0, 100], [0, 101]), false);
	assert.equal(shouldTweenDomain([0, 100], [0, 120]), true);
});

test("interpolatePoints grows new points from a neighbour", () => {
	const from = [{ key: "1", x: 0, y: 0 }];
	const to = [
		{ key: "1", x: 10, y: 10 },
		{ key: "2", x: 20, y: 20 },
	];
	const half = interpolatePoints(from, to, 0.5);
	assert.deepEqual(half[0], { key: "1", x: 5, y: 5 });
	assert.deepEqual(half[1], { key: "2", x: 10, y: 10 });
});

test("nearestIndex snaps to the closer datum", () => {
	const data = [{ d: 0 }, { d: 10 }, { d: 20 }];
	assert.equal(nearestIndex(data, "d", 4), 0);
	assert.equal(nearestIndex(data, "d", 6), 1);
	assert.equal(nearestIndex(data, "d", 99), 2);
});

test("evenTickIndices keeps both ends and dedupes labels", () => {
	const ticks = evenTickIndices(
		30,
		5,
		(i) => i * 10,
		(i) => String(i),
	);
	assert.equal(ticks[0], 0);
	assert.equal(ticks.at(-1), 29);
	assert.ok(ticks.length >= 4 && ticks.length <= 6);
	const deduped = evenTickIndices(
		10,
		5,
		(i) => i,
		(i) => String(Math.floor(i / 5)),
	);
	assert.equal(new Set(deduped.map((i) => Math.floor(i / 5))).size, deduped.length);
});

test("phase machine walks the lifecycle", () => {
	assert.equal(nextPhase("loading", "status-ready"), "gridTweenReady");
	assert.equal(nextPhase("gridTweenReady", "done"), "revealing");
	assert.equal(nextPhase("revealing", "done"), "ready");
	assert.equal(nextPhase("ready", "status-loading"), "concealing");
	assert.equal(nextPhase("concealing", "done"), "gridTweenLoading");
	assert.equal(nextPhase("gridTweenLoading", "done"), "loading");
	assert.equal(nextPhase("ready", "status-ready"), null);
});

test("chartStyleCss scopes light and dark colours to the chart id", () => {
	const css = chartStyleCss("c1", {
		revenue: { color: "var(--chart-1)" },
		profit: { theme: { light: "#000", dark: "#fff" } },
	});
	assert.match(
		css,
		/\[data-chart=c1\] \{\n {2}--color-revenue: var\(--chart-1\);\n {2}--color-profit: #000;/,
	);
	assert.match(css, /\.dark \[data-chart=c1\] \{[^}]*--color-profit: #fff;/);
});

test("sunburst and funnel geometry lay out correctly", async () => {
	const sb = await import("../components/sunburst-chart/geometry.ts");
	const tree = {
		name: "root",
		children: [
			{
				name: "a",
				children: [
					{ name: "a1", value: 3 },
					{ name: "a2", value: 1 },
				],
			},
			{ name: "b", value: 4 },
		],
	};
	const layout = sb.buildLayout(tree);
	assert.equal(layout.total, 8);
	assert.equal(layout.maxDepth, 2);
	const a = layout.arcs.find((arc) => arc.id === "root / a");
	assert.ok(Math.abs(a.a1 - a.a0 - Math.PI) < 1e-9, "a is half the circle");
	assert.equal(sb.buildLayout(tree, new Set(["b"])).total, 4);
	const { delays } = sb.enterDelays(layout.arcs);
	assert.equal(delays.get("root / a / a1"), 120);
	const focus = layout.focusById.get("root / a");
	const g = sb.geometryFor(
		layout.arcs.find((arc) => arc.id === "root / a / a1"),
		focus,
		2,
		100,
		false,
	);
	assert.ok(Math.abs(g.a1 - g.a0 - 1.5 * Math.PI) < 1e-9, "zoom rescales a1 to 3/4 turn");
	const mid = sb.lerpGeometry(
		{ a0: 3, a1: 3.2, innerR: 0, outerR: 10 },
		{ a0: -3.1, a1: -2.9, innerR: 0, outerR: 10 },
		0.5,
	);
	assert.ok(Math.abs(mid.a0 + mid.a1) > 6, "lerps the short way across pi");
	const fn = await import("../components/funnel-chart/geometry.ts");
	const cells = fn.funnelCells(
		[
			{ label: "x", value: 100 },
			{ label: "y", value: 25 },
		],
		204,
		100,
		4,
		3,
		true,
		false,
	);
	assert.equal(cells[1].offset, 104);
	assert.equal(cells[1].ratio, 0.25);
	assert.equal(
		fn.stageColor(0, 5, {}),
		"color-mix(in oklch, var(--chart-scale-5) 100%, var(--chart-scale-2))",
	);
	assert.equal(
		fn.stageColor(4, 5, {}),
		"color-mix(in oklch, var(--chart-scale-5) 0%, var(--chart-scale-2))",
	);
});

test("heatmap calendar and sankey layout lay out correctly", async () => {
	const hm = await import("../components/heatmap-chart/calendar.ts");
	const data = [
		{ date: "2026-03-04", value: 8 },
		{ date: "2026-03-06", value: 2 },
		{ date: "2026-03-11", value: 1 },
	];
	const cal = hm.buildCalendar(data, {
		dateKey: "date",
		valueKey: "value",
		weekStart: 1,
	});
	assert.equal(cal.cells.length, 8, "fills every day between first and last");
	assert.equal(cal.cells[0].row, 2, "Wednesday is row 2 in a Monday week");
	assert.equal(
		cal.cells[7].col - cal.cells[0].col,
		1,
		"a week later is one column right",
	);
	assert.deepEqual(
		cal.cells.map((c) => c.level),
		[4, 0, 1, 0, 0, 0, 0, 1],
	);
	assert.equal(hm.levelOf(5, 8, [1, 3, 6]), 3);
	assert.equal(hm.enterDelay(3, 4, 1), 0, "default fade leaves no spread");
	const random = hm.seeded(42);
	const again = hm.seeded(42);
	assert.equal(random(), again(), "seeded PRNG repeats");
	assert.equal(hm.heatmapNext("ready", "status-loading"), "concealing");
	assert.equal(hm.heatmapNext("concealing", "done"), "loading");
	assert.equal(hm.heatmapNext("loading", "status-ready"), "revealing");
	assert.equal(hm.heatmapNext("revealing", "done"), "ready");

	const sk = await import("../components/sankey-chart/layout.ts");
	const flows = {
		nodes: [{ name: "a" }, { name: "b" }, { name: "c" }],
		links: [
			{ source: 0, target: 2, value: 30 },
			{ source: 1, target: 2, value: 10 },
		],
	};
	const h = sk.layoutSankey(flows, {
		width: 400,
		height: 200,
		nodeWidth: 10,
		nodePadding: 10,
		flow: "horizontal",
	});
	assert.equal(h.links[0].share, 1);
	assert.ok(h.nodes[2].x0 > h.nodes[0].x1, "target column sits right of the sources");
	const v = sk.layoutSankey(flows, {
		width: 400,
		height: 200,
		nodeWidth: 10,
		nodePadding: 10,
		flow: "vertical",
	});
	assert.ok(v.nodes[2].y0 > v.nodes[0].y1, "vertical flow runs top to bottom");
	assert.equal(Math.round(sk.SANKEY_TIMING.link(0, 10)), 220);
	assert.equal(Math.round(sk.SANKEY_TIMING.node(5, 10)), 132);
});

test("bar depth faces and pulse mirror across orientation and sign", async () => {
	const bar = await import("../components/bar-chart/bar-core.ts");
	const opts = { center: 100, step: 40, bandwidth: 30, base: 200 };
	const up = bar.depthFaces(
		{ x: 10, y: 80, width: 30, height: 120 },
		{
			...opts,
			orientation: "vertical",
			negative: false,
		},
	);
	const down = bar.depthFaces(
		{ x: 10, y: 200, width: 30, height: 120 },
		{
			...opts,
			orientation: "vertical",
			negative: true,
		},
	);
	const right = bar.depthFaces(
		{ x: 200, y: 10, width: 120, height: 30 },
		{
			...opts,
			orientation: "horizontal",
			negative: false,
		},
	);
	const round = (n) => Math.round(n * 1e6) / 1e6;
	const nums = (d) => d.match(/-?[\d.]+/g).map((n) => round(Number(n)));
	const flipY = (d) => nums(d).map((n, i) => round(i % 2 ? 400 - n : n));
	const swap = (d) =>
		nums(d).flatMap((n, i, a) => (i % 2 ? [] : [a[i + 1], round(400 - n)]));
	assert.ok(up && down && right);
	assert.deepEqual(
		flipY(down.lid),
		nums(up.lid),
		"negative lid mirrors about the baseline",
	);
	assert.equal(down.front.y, 200, "negative front starts at the baseline");
	assert.deepEqual(
		swap(right.side),
		nums(up.side),
		"horizontal side is the vertical one transposed",
	);
	assert.equal(right.front.x, 200);
	const wave = (p) =>
		bar.pulseRect(
			{ x: 200, y: 10, width: 120, height: 30 },
			{
				orientation: "horizontal",
				negative: false,
				base: 200,
			},
			p,
		);
	assert.ok(wave(1).x > wave(0).x, "horizontal pulse sweeps toward the tip");
	assert.equal(wave(0).height, 30);
});

test("small plots get fewer ticks, labels that would collide are dropped", async () => {
	const core = await import("../components/chart/core.ts");
	assert.equal(
		core.fitTickCount(8, 400, core.Y_TICK_GAP),
		8,
		"room to spare keeps the hint",
	);
	assert.equal(
		core.fitTickCount(8, 88, core.Y_TICK_GAP),
		5,
		"88px holds five 22px gaps' worth",
	);
	assert.equal(core.fitTickCount(5, 10, core.Y_TICK_GAP), 2, "never fewer than two");
	assert.equal(core.fitTickCount(40, 9999, 1), 10, "never more than ten");

	const sb = await import("../components/sunburst-chart/geometry.ts");
	const ring = { a0: 0, a1: 1, innerR: 40, outerR: 110 };
	assert.ok(sb.labelFits(ring, "Team"), "short name fits a 70px ring");
	assert.ok(!sb.labelFits(ring, "United States of America"), "long name does not");
	assert.ok(
		!sb.labelFits({ ...ring, a1: 0.1 }, "Team"),
		"a sliver has no room for the line",
	);

	const sk = await import("../components/sankey-chart/layout.ts");
	const node = (index, value, y0, y1) => ({
		index,
		name: `n${index}`,
		color: "",
		value,
		x0: 100,
		x1: 110,
		y0,
		y1,
		leading: false,
	});
	const bounds = { x0: -80, x1: 300, y0: 0, y1: 200 };
	const texts = (n) => [n.name, String(n.value)];
	const apart = sk.visibleLabels(
		[node(0, 9, 0, 40), node(1, 5, 100, 140)],
		"horizontal",
		texts,
		bounds,
	);
	assert.deepEqual(
		[...apart.values()],
		[
			[true, true],
			[true, true],
		],
	);
	const tight = sk.visibleLabels(
		[node(0, 9, 0, 20), node(1, 5, 22, 30)],
		"horizontal",
		texts,
		bounds,
	);
	assert.deepEqual(tight.get(0), [true, true], "the bigger node keeps both lines");
	assert.deepEqual(tight.get(1), [false, false], "the smaller one yields");
});

test("announceRows reads the title then each row, blank for missing values", () => {
	const rows = [
		{ key: "a", label: "Revenue", color: "", value: 120 },
		{ key: "b", label: "Cost", color: "", value: null },
	];
	assert.equal(
		announceRows("Mar 3", rows, (v) => `$${v}`),
		"Mar 3: Revenue $120, Cost ",
	);
});

test("hoverThrottle commits once per frame with the latest index and commit", () => {
	const frames = [];
	globalThis.requestAnimationFrame = (fn) => frames.push(fn);
	globalThis.cancelAnimationFrame = (id) => {
		frames[id - 1] = null;
	};
	const hover = hoverThrottle();
	const seen = [];
	hover.move(1, (i) => seen.push(["first", i]));
	hover.move(4, (i) => seen.push(["latest", i]));
	assert.equal(frames.length, 1);
	frames[0]();
	assert.deepEqual(seen, [["latest", 4]]);
	hover.move(2, (i) => seen.push(["cancelled", i]));
	hover.cancel();
	assert.equal(frames[1], null);
	hover.move(3, (i) => seen.push(["after", i]));
	frames[2]();
	assert.deepEqual(seen.at(-1), ["after", 3]);
});
