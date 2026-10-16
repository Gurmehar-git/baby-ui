import assert from "node:assert/strict";
import { test } from "node:test";
import { compareSnapshots, STYLE_PROPS } from "./parity/compare.mjs";

const style = (over = {}) => ({
	...Object.fromEntries(STYLE_PROPS.map((p) => [p, "0px"])),
	color: "#000000",
	...over,
});
const part = (slot, over = {}) => ({
	slot,
	tag: "div",
	aria: {},
	w: 100,
	h: 40,
	style: style(),
	...over,
});
const snap = (parts, unnamed = []) => ({ parts, unnamed });

test("identical snapshots have nothing to report", () => {
	const a = snap([part("card"), part("card-title")]);
	assert.deepEqual(compareSnapshots(a, structuredClone(a)), []);
});

test("a part rendered a different number of times is an error", () => {
	const issues = compareSnapshots(
		snap([part("item"), part("item")]),
		snap([part("item")]),
	);
	assert.deepEqual(
		issues.map((i) => [i.level, i.message]),
		[["error", "item: 2 in React, 1 in Svelte"]],
	);
});

test("different semantics are errors, different tags with the same role are not", () => {
	const react = snap([
		part("header", { tag: "h3", aria: { role: "heading", "aria-level": "3" } }),
	]);
	const svelte = snap([part("header", { aria: { role: "heading", "aria-level": "3" } })]);
	assert.deepEqual(compareSnapshots(react, svelte), []);
	const off = snap([part("header", { aria: { role: "heading", "aria-level": "2" } })]);
	assert.equal(compareSnapshots(react, off)[0]?.level, "error");
});

test("a pixel of rounding is the same design; more is drift", () => {
	const a = snap([part("x", { style: style({ "padding-top": "8px" }) })]);
	const near = snap([part("x", { style: style({ "padding-top": "8.6px" }) })]);
	const far = snap([part("x", { style: style({ "padding-top": "12px" }) })]);
	assert.deepEqual(compareSnapshots(a, near), []);
	assert.deepEqual(
		compareSnapshots(a, far).map((i) => [i.level, i.message]),
		[["warn", "x: padding-top 8px vs 12px"]],
	);
});

test("a control without an accessible name is an error in the port that has it", () => {
	const issues = compareSnapshots(snap([], ["button"]), snap([]));
	assert.deepEqual(
		issues.map((i) => i.message),
		["React: a button has no accessible name"],
	);
});
