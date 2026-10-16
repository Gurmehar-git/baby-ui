import { describe, expect, test } from "bun:test";
import { getSpec, specs } from "@baby-ui/components/specs";
import type { Framework } from "@baby-ui/registry-schema";
import { buildItem } from "./build";
import { installLayout } from "./layout";
import { assertAdditive, buildThemeItems, tailwindThemeKeys } from "./theme";
import { verifyEmittedImports, verifyRegistryDependencies } from "./verify";

const layouts = {
	react: installLayout("react", specs),
	svelte: installLayout("svelte", specs),
};

async function built(slug: string, framework: Framework) {
	const spec = getSpec(slug);
	if (!spec) throw new Error(`no spec ${slug}`);
	const item = await buildItem(spec, framework, layouts[framework]);
	if (!item) throw new Error(`no ${framework} port for ${slug}`);
	return item;
}

const imports = (content: string) =>
	[...content.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1] ?? "");

describe("install targets follow the category folder", () => {
	test.each([
		["button", "react", "components/ui/button/button.tsx"],
		["button", "svelte", "button/button.svelte"],
		["agent-screen", "react", "components/agents/agent-screen/agent-screen.tsx"],
		["agent-screen", "svelte", "../agents/agent-screen/agent-screen.svelte"],
		["og-blog-post", "svelte", "../og/og-blog-post/og-blog-post.svelte"],
		["email-kit", "react", "components/emails/ui/email-kit/email-kit.tsx"],
		["email-welcome", "react", "components/emails/email-welcome/email-welcome.tsx"],
	] as const)("%s (%s) lands at %s", async (slug, framework, target) => {
		const item = await built(slug, framework);
		expect(item.files.map((f) => f.target)).toContain(target);
	});

	test("lib files go to the lib folder, never a category folder", async () => {
		const item = await built("button", "react");
		expect(item.files.map((f) => f.target)).toContain("lib/cn.ts");
		const svelte = await built("button", "svelte");
		expect(svelte.files.map((f) => f.target)).toContain("cn.ts");
	});
});

describe("shipped imports point at the other item's folder", () => {
	test("an agents item imports Button from components/ui", async () => {
		const item = await built("agent-screen", "react");
		const all = item.files.flatMap((f) => imports(f.content));
		expect(all).toContain("@/components/ui/button/button");
		expect(all.some((i) => i.startsWith("../"))).toBe(false);
	});

	test("an email template imports the kit from components/emails/ui", async () => {
		const react = await built("email-welcome", "react");
		expect(react.files.flatMap((f) => imports(f.content))).toContain(
			"@/components/emails/ui/email-kit/email-kit",
		);
		const svelte = await built("email-welcome", "svelte");
		expect(svelte.files.flatMap((f) => imports(f.content))).toContain(
			"$COMPONENTS$/emails/ui/email-kit/email-button.svelte",
		);
	});

	test("../lib imports become the lib alias", () => {
		expect(layouts.react.rewriteImports('import { cn } from "../lib/cn";')).toBe(
			'import { cn } from "@/lib/cn";',
		);
		expect(layouts.svelte.rewriteImports('import { cn } from "../lib/cn";')).toBe(
			'import { cn } from "$LIB$/cn.js";',
		);
	});

	test("svelte alias imports name the real file, folder or rune module", () => {
		const shipped = (spec: string) =>
			layouts.svelte.rewriteImports(`import x from "${spec}";`).match(/"([^"]+)"/)?.[1];
		expect(shipped("../button/variants")).toBe("$UI$/button/variants.js");
		expect(shipped("../button/button.svelte")).toBe("$UI$/button/button.svelte");
		expect(shipped("../lib/use-is-mobile.svelte")).toBe("$LIB$/use-is-mobile.svelte.js");
		expect(shipped("../chart")).toBe("$COMPONENTS$/charts/chart/index.js");
	});

	test("a folder import names its barrel, so the CLI cannot swap it for a same-named file", async () => {
		const item = await built("npm-stats", "react");
		const all = item.files.flatMap((f) => imports(f.content));
		expect(all).toContain("@/components/charts/chart/index");
		expect(all).not.toContain("@/components/charts/chart");
	});

	test("every shipped React import names a file that exports what it imports", async () => {
		const items = await Promise.all(
			specs
				.filter((s) => s.tier !== "pro")
				.map((s) => buildItem(s, "react", layouts.react)),
		);
		expect(verifyEmittedImports(items.filter((item) => item !== null))).toEqual([]);
	});

	test("a bare folder import is flagged", () => {
		const item = (target: string, content: string) => ({
			name: target,
			files: [{ target, content }],
		});
		const errors = verifyEmittedImports([
			item("components/charts/chart/index.ts", 'export { Chart } from "./chart";'),
			item(
				"components/blocks/x/x.tsx",
				'import { Chart } from "@/components/charts/chart";',
			),
		]);
		expect(errors[0]).toContain("is a folder");
	});

	test("same-folder imports stay relative", () => {
		const source = 'import { button } from "./variants";';
		expect(layouts.react.rewriteImports(source)).toBe(source);
	});
});

describe("paths shown to readers", () => {
	test("usage imports use the installed folder", () => {
		expect(layouts.react.itemImport("og-blog-post")).toBe("@/components/og/og-blog-post");
		expect(layouts.svelte.itemImport("email-kit")).toBe(
			"#lib/components/emails/ui/email-kit/index.js",
		);
		expect(layouts.svelte.itemImport("button")).toBe(
			"#lib/components/ui/button/index.js",
		);
	});

	test("the Manual view resolves shadcn-svelte's alias-relative targets", () => {
		expect(layouts.svelte.projectPath("../agents/x/x.svelte", "registry:ui")).toBe(
			"src/lib/components/agents/x/x.svelte",
		);
		expect(layouts.svelte.projectPath("cn.ts", "registry:lib")).toBe("src/lib/cn.ts");
		expect(layouts.react.projectPath("components/ui/b/b.tsx", "registry:ui")).toBe(
			"components/ui/b/b.tsx",
		);
	});
});

describe("installs are complete", () => {
	test.each(["react", "svelte"] as const)(
		"every %s sibling import is a declared registryDependency",
		async (framework) => {
			expect(await verifyRegistryDependencies([...specs], framework)).toEqual([]);
		},
	);
});

describe("theme installs on a project that never ran shadcn init", () => {
	test.each(["react", "svelte"] as const)(
		"%s theme carries the colour utilities and radius scale",
		async (framework) => {
			const theme = (await buildThemeItems(framework)).find(
				(item) => item.name === "theme",
			);
			const vars = theme?.cssVars?.theme ?? {};
			expect(vars["color-popover"]).toBe("var(--popover)");
			expect(vars["color-primary-foreground"]).toBe("var(--primary-foreground)");
			expect(vars["color-ring"]).toBe("var(--ring)");
			expect(vars["radius-sm"]).toBe("calc(var(--radius) - 4px)");
		},
	);
});

describe("tokens install additively into an existing shadcn app", () => {
	test.each(["react", "svelte"] as const)(
		"%s tokens and layers never redefine shadcn or Tailwind keys",
		async (framework) => {
			const items = await buildThemeItems(framework);
			const tailwind = await tailwindThemeKeys();
			for (const item of items.filter((i) => i.name !== "theme"))
				expect(() => assertAdditive(item, tailwind)).not.toThrow();
			const tokens = items.find((i) => i.name === "tokens");
			expect(tokens?.cssVars?.light?.primary).toBeUndefined();
			expect(tokens?.cssVars?.theme?.["ease-out"]).toBeUndefined();
			expect(JSON.stringify(tokens?.css)).not.toContain("@layer base");
		},
	);

	test("assertAdditive rejects a redefined shadcn variable", async () => {
		const tailwind = await tailwindThemeKeys();
		const [tokens] = await buildThemeItems("react");
		if (!tokens) throw new Error("no tokens item");
		const bad = { ...tokens, css: { ":root, .dark": { "--primary": "var(--accent)" } } };
		expect(() => assertAdditive(bad, tailwind)).toThrow(/--primary/);
	});

	test("opt-in layers follow what a component reads", async () => {
		const deps = async (slug: string) =>
			(await built(slug, "react")).registryDependencies?.map((u) => u.split("/").pop());
		expect(await deps("button")).not.toContain("tokens-charts.json");
		expect(await deps("button")).not.toContain("tokens-effects.json");
		expect(await deps("line-chart")).toContain("tokens-charts.json");
		expect(await deps("aurora-flow")).toContain("tokens-effects.json");
	});

	test("component CSS installs into the baby-ui layer", async () => {
		const item = await built("roll-text", "react");
		expect(Object.keys(item.css ?? {})).toContain("@layer baby-ui");
	});
});
