import { describe, expect, test } from "bun:test";
import { resolve } from "node:path";
import { COMPONENTS_DIR, readSource, sourcePath, toLegacy } from "./sources";

describe("sources", () => {
	test("a spec path resolves into its component folder", () => {
		expect(sourcePath("react", "button/button.tsx")).toBe(
			resolve(COMPONENTS_DIR, "button/react/button.tsx"),
		);
		expect(sourcePath("svelte", "lib/cn.ts")).toBe(
			resolve(COMPONENTS_DIR, "lib/svelte/cn.ts"),
		);
	});

	test("folder imports map back to the one-deep shape", () => {
		expect(toLegacy('import { cn } from "../../lib/react/cn";')).toBe(
			'import { cn } from "../lib/cn";',
		);
		expect(toLegacy('import { button } from "../../button/svelte/variants";')).toBe(
			'import { button } from "../button/variants";',
		);
		expect(toLegacy('import { Tabs } from "../../tabs/react";')).toBe(
			'import { Tabs } from "../tabs";',
		);
	});

	test("a read source carries no port segment in its sibling imports", async () => {
		for (const framework of ["react", "svelte"] as const) {
			const ext = framework === "react" ? "tsx" : "svelte";
			const code = await readSource(framework, `fullscreen-nav/fullscreen-nav.${ext}`);
			expect(code).not.toMatch(/\.\.\/\.\.\/[a-z0-9-]+\/(react|svelte)/);
			expect(code).toContain("../lib/");
		}
	});
});
