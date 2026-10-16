import assert from "node:assert/strict";
import { appendFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { flush, Output, ROOT } from "./gen/core.mjs";

const ROOT_REL = "node_modules/.gen-overwrite-test";
const root = join(ROOT, ROOT_REL);
const source = join(ROOT, "components/x/react/copy.ts");

function run() {
	const output = new Output([ROOT_REL]);
	output.add(join(root, "copy.ts"), "export const a = 1;\n", { source });
	output.add(join(root, "plain.ts"), "export const b = 1;\n");
	return flush(output, { check: false }).overwritten;
}

test("a hand edit to a generated file is reported once, naming the file to edit", (t) => {
	rmSync(root, { recursive: true, force: true });
	t.after(() => rmSync(root, { recursive: true, force: true }));

	assert.deepEqual(run(), []);
	assert.deepEqual(run(), []);
	appendFileSync(join(root, "copy.ts"), "// hand edit\n");
	appendFileSync(join(root, "plain.ts"), "// hand edit\n");

	const reported = run();
	assert.equal(reported.length, 2);
	assert.match(reported[0], /copied from components\/x\/react\/copy\.ts, edit that/);
	assert.match(reported[1], /plain\.ts was edited by hand; it is generated/);
	assert.deepEqual(run(), []);
});
