import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { FRAMEWORK } from "./config";
import { COMPONENTS_DIR, readSource, sourcePath, toLegacy } from "./sources";

describe("sources", () => {
	test("a migrated component reads from its folder, the rest from the old package", () => {
		expect(sourcePath("react", "button/button.tsx")).toBe(
			resolve(COMPONENTS_DIR, "button/react/button.tsx"),
		);
		expect(sourcePath("svelte", "lib/cn.ts")).toBe(
			resolve(COMPONENTS_DIR, "lib/svelte/cn.ts"),
		);
		expect(sourcePath("react", "chart/chart.tsx")).toBe(
			resolve(FRAMEWORK.react.srcDir, "chart/chart.tsx"),
		);
	});

	test("folder imports map back to the one-deep shape", () => {
		expect(toLegacy('import { cn } from "../../lib/react/cn";')).toBe(
			'import { cn } from "../lib/cn";',
		);
		expect(toLegacy('import { button } from "../../button/svelte/variants";')).toBe(
			'import { button } from "../button/variants";',
		);
	});

	test("a migrated file reads exactly as its old copy", async () => {
		for (const framework of ["react", "svelte"] as const) {
			const ext = framework === "react" ? "tsx" : "svelte";
			const rel = `fullscreen-nav/fullscreen-nav.${ext}`;
			const old = readFileSync(resolve(FRAMEWORK[framework].srcDir, rel), "utf8");
			expect(await readSource(framework, rel)).toBe(old);
		}
	});
});
