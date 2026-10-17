import { describe, expect, test } from "bun:test";
import { resolve } from "node:path";
import { COMPONENTS_DIR, readSource, sourcePath, toLegacy } from "./sources";

const at = (rel: string) => resolve(COMPONENTS_DIR, rel);

describe("sources", () => {
	test("a port's own file wins; otherwise the shared file at the folder root", () => {
		expect(sourcePath("react", "button/button.tsx")).toBe(at("button/react/button.tsx"));
		expect(sourcePath("svelte", "button/variants.ts")).toBe(at("button/variants.ts"));
		expect(sourcePath("svelte", "lib/cn.ts")).toBe(at("lib/cn.ts"));
		expect(sourcePath("react", "lib/anchor.ts")).toBe(at("lib/react/anchor.ts"));
	});

	test("imports re-point at their installed places, from a port file or a shared one", () => {
		const port = at("tabs/react/tabs.tsx");
		expect(toLegacy('import { cn } from "../../lib/cn";', port)).toBe(
			'import { cn } from "../lib/cn";',
		);
		expect(toLegacy('import { a } from "../../lib/react/anchor";', port)).toBe(
			'import { a } from "../lib/anchor";',
		);
		expect(toLegacy('import { tabs } from "../variants";', port)).toBe(
			'import { tabs } from "./variants";',
		);
		expect(toLegacy('import { Button } from "../../button/react";', port)).toBe(
			'import { Button } from "../button";',
		);
		const shared = at("chart-series/core.ts");
		expect(toLegacy('import { x } from "../chart/core";', shared)).toBe(
			'import { x } from "../chart/core";',
		);
	});

	test("a read source carries no port segment in its imports", async () => {
		for (const framework of ["react", "svelte"] as const) {
			const ext = framework === "react" ? "tsx" : "svelte";
			const code = await readSource(framework, `fullscreen-nav/fullscreen-nav.${ext}`);
			expect(code).not.toMatch(/["']\.{1,2}\/[^"']*\/(react|svelte)\//);
			expect(code).toContain("../lib/");
		}
	});
});
