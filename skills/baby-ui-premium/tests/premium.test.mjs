import assert from "node:assert/strict";
import { test } from "node:test";
import { CATEGORIES, score } from "../scripts/premium-score.mjs";

const f = (rule, severity) => ({ rule, severity, where: "x", measured: "m", fix: "f" });

test("every category has a key, and hand categories stay pending until scored", () => {
	assert.equal(CATEGORIES.length, 11);
	const clean = score([]);
	assert.equal(clean.verdict, "Pending");
	assert.deepEqual(clean.pending, ["purpose", "ux", "cohesion"]);
	assert.equal(score([], { purpose: 4, ux: 4, cohesion: 4 }).verdict, "Approve");
});

test("a blocker or a weak motion score blocks", () => {
	assert.equal(score([f("A11Y-001", "blocker")]).verdict, "Block");
	assert.equal(score([f("PRM-MOTION", "medium")]).verdict, "Block");
});

test("a monolith caps every scored category at 2", () => {
	const r = score([f("COMPOSE-002", "high")], { purpose: 4, ux: 4, cohesion: 4 });
	assert.ok(r.rows.every((row) => row.score <= 2));
	assert.equal(r.verdict, "Block");
});
