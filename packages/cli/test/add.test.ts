import {
	appendFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { add } from "../src/commands/add.ts";
import { revertCommand } from "../src/commands/history.ts";
import { readLock } from "../src/write/lock.ts";
import { fixture } from "./fixture.ts";

const tokens = (framework: "react" | "svelte") => ({
	name: "tokens",
	type: "registry:style",
	cssVars: {
		theme: { "color-success": "var(--success)" },
		light: { success: "oklch(73% 0.19 150)" },
		dark: { success: "oklch(70% 0.19 150)" },
	},
	css: {
		":root, .dark": { "--primary-hover": "red" },
		"@media (prefers-reduced-motion: reduce)": { ":root": { "--press-scale": "1" } },
	},
	files: [],
	meta: { framework },
});

const registry = () =>
	fixture({
		"r/tokens.json": tokens("react"),
		"r/badge.json": {
			name: "badge",
			type: "registry:ui",
			dependencies: ["clsx"],
			registryDependencies: ["https://baby-ui.pages.dev/r/tokens.json"],
			files: [
				{
					path: "badge/badge.tsx",
					type: "registry:ui",
					target: "components/ui/badge/badge.tsx",
					content:
						'"use client"\nimport { cn } from "@/lib/cn";\nexport const Badge = () => cn();\n',
				},
				{
					path: "lib/cn.ts",
					type: "registry:lib",
					target: "lib/cn.ts",
					content: "export const cn = () => '';\n",
				},
			],
			css: { "@keyframes shine": { to: { opacity: "1" } } },
		},
		"r/chip.json": {
			name: "chip",
			type: "registry:ui",
			registryDependencies: ["https://baby-ui.pages.dev/r/badge.json"],
			files: [
				{
					path: "chip/chip.tsx",
					type: "registry:ui",
					target: "components/ui/chip/chip.tsx",
					content:
						'import { Badge } from "@/components/ui/badge/badge";\nexport const Chip = Badge;\n',
				},
			],
		},
		"svelte/r/tokens.json": tokens("svelte"),
		"svelte/r/badge.json": {
			name: "badge",
			type: "registry:ui",
			registryDependencies: ["https://baby-ui.pages.dev/svelte/r/tokens.json"],
			files: [
				{
					path: "badge/badge.svelte",
					type: "registry:ui",
					target: "badge/badge.svelte",
					content: '<script lang="ts">import { cn } from "$LIB$/cn.js";</script>\n',
				},
			],
		},
	});

const reactApp = () =>
	fixture({
		"package.json": { dependencies: { next: "16.0.0", react: "19.0.0", clsx: "2" } },
		"pnpm-lock.yaml": "",
		"components.json": {
			$schema: "https://ui.shadcn.com/schema.json",
			rsc: false,
			tailwind: { css: "src/app/globals.css" },
			aliases: { components: "@/components", utils: "@/lib/utils" },
		},
		"tsconfig.json": { compilerOptions: { paths: { "@/*": ["./src/*"] } } },
		"src/app/globals.css": '@import "tailwindcss";\n',
	});

const svelteApp = () =>
	fixture({
		"package.json": { devDependencies: { "@sveltejs/kit": "^2.20.0", svelte: "^5" } },
		"components.json": {
			$schema: "https://shadcn-svelte.com/schema.json",
			tailwind: { css: "src/app.css" },
			aliases: { components: "$lib/components", utils: "$lib/utils" },
			typescript: true,
		},
		"tsconfig.json": { extends: "./.svelte-kit/tsconfig.json" },
		".svelte-kit/tsconfig.json": {
			compilerOptions: { paths: { "$lib/*": ["../src/lib/*"] } },
		},
		"src/app.css": '@import "tailwindcss";\n',
	});

const journals = (root: string) =>
	existsSync(join(root, ".baby-ui", "history"))
		? readdirSync(join(root, ".baby-ui", "history")).length
		: 0;

let registryDir = "";

beforeEach(() => {
	vi.spyOn(process.stdout, "write").mockReturnValue(true);
	vi.spyOn(console, "log").mockReturnValue();
	registryDir = registry();
	process.env.BABY_UI_REGISTRY_URL = pathToFileURL(registryDir).toString();
	process.env.BABY_UI_CACHE_DIR = fixture({});
});

afterEach(() => {
	vi.restoreAllMocks();
	delete process.env.BABY_UI_REGISTRY_URL;
	delete process.env.BABY_UI_CACHE_DIR;
});

describe("add", () => {
	it("writes React files with shadcn's transforms, CSS and a lock", async () => {
		const root = reactApp();
		await add({ cwd: root, items: ["badge"], install: false });
		const badge = readFileSync(join(root, "src/components/ui/badge/badge.tsx"), "utf8");
		expect(badge.startsWith('"use client"\n')).toBe(true);
		expect(badge).toContain('from "@/lib/cn"');
		const css = readFileSync(join(root, "src/app/globals.css"), "utf8");
		expect(css).toContain("@custom-variant dark");
		expect(css).toContain("--success: oklch(73% 0.19 150)");
		expect(css).toMatch(/@theme inline \{[\s\S]*@keyframes shine/);
		const lock = await readLock(root);
		expect(Object.values(lock.items).map((i) => i.name)).toEqual(["badge", "tokens"]);
	});

	it("replaces Svelte placeholders and stays idempotent on re-add", async () => {
		const root = svelteApp();
		await add({ cwd: root, items: ["badge"], install: false });
		const badge = readFileSync(
			join(root, "src/lib/components/ui/badge/badge.svelte"),
			"utf8",
		);
		expect(badge).toContain('from "$lib/cn.js"');
		const css = readFileSync(join(root, "src/app.css"), "utf8");
		await add({ cwd: root, items: ["badge"], install: false });
		expect(readFileSync(join(root, "src/app.css"), "utf8")).toBe(css);
		expect(journals(root)).toBe(1);
		expect(css.match(/--success: oklch\(73%/g)).toHaveLength(1);
	});

	it("installs shadcn-svelte items whose files have only a target", async () => {
		const root = svelteApp();
		writeFileSync(
			join(root, "kbd.json"),
			JSON.stringify({
				name: "kbd",
				type: "registry:ui",
				files: [
					{ type: "registry:file", target: "kbd/kbd.svelte", content: "<kbd />\n" },
				],
			}),
		);
		await add({ cwd: root, items: ["kbd.json"], install: false });
		expect(existsSync(join(root, "src/lib/components/ui/kbd/kbd.svelte"))).toBe(true);
	});

	it("keeps local edits, refuses to undo over them, and redoes", async () => {
		const root = reactApp();
		const file = join(root, "src/components/ui/badge/badge.tsx");
		await add({ cwd: root, items: ["badge"], install: false });
		appendFileSync(file, "// mine\n");
		await add({ cwd: root, items: ["badge"], install: false });
		expect(readFileSync(file, "utf8")).toContain("// mine");

		await expect(revertCommand({ cwd: root })).rejects.toThrow(/cancelled/);
		await revertCommand({ cwd: root, force: true });
		expect(existsSync(file)).toBe(false);
		expect(readFileSync(join(root, "src/app/globals.css"), "utf8")).toBe(
			'@import "tailwindcss";\n',
		);

		const redo =
			readdirSync(join(root, ".baby-ui", "history"))
				.sort()
				.at(-1) ?? "";
		await revertCommand({ cwd: root, id: redo });
		expect(existsSync(file)).toBe(true);
	});
});

describe("shadcn monorepo", () => {
	const workspace = () =>
		fixture({
			"package.json": { name: "root", private: true },
			"pnpm-workspace.yaml": "packages:\n  - apps/*\n  - packages/*\n",
			"pnpm-lock.yaml": "",
			"apps/web/package.json": {
				name: "web",
				dependencies: { next: "16.0.0", react: "19.0.0" },
			},
			"apps/web/components.json": {
				$schema: "https://ui.shadcn.com/schema.json",
				tailwind: { css: "../../packages/ui/src/styles/globals.css" },
				aliases: {
					components: "@/components",
					hooks: "@/hooks",
					lib: "@/lib",
					utils: "@workspace/ui/lib/utils",
					ui: "@workspace/ui/components",
				},
			},
			"apps/web/tsconfig.json": {
				compilerOptions: {
					paths: { "@/*": ["./*"], "@workspace/ui/*": ["../../packages/ui/src/*"] },
				},
			},
			"packages/ui/package.json": {
				name: "@workspace/ui",
				dependencies: { react: "19.0.0" },
			},
			"packages/ui/components.json": {
				$schema: "https://ui.shadcn.com/schema.json",
				tailwind: { css: "src/styles/globals.css" },
				aliases: {
					components: "@workspace/ui/components",
					utils: "@workspace/ui/lib/utils",
					hooks: "@workspace/ui/hooks",
					lib: "@workspace/ui/lib",
					ui: "@workspace/ui/components",
				},
			},
			"packages/ui/tsconfig.json": {
				compilerOptions: { paths: { "@workspace/ui/*": ["./src/*"] } },
			},
			"packages/ui/src/styles/globals.css": '@import "tailwindcss";\n',
		});

	it("routes ui files, imports, CSS and locks to the ui package", async () => {
		const root = workspace();
		await add({ cwd: join(root, "apps/web"), items: ["badge"], install: false });
		const ui = join(root, "packages/ui");
		const badge = readFileSync(join(ui, "src/components/ui/badge/badge.tsx"), "utf8");
		expect(badge).toContain('from "@workspace/ui/lib/cn"');
		expect(existsSync(join(ui, "src/lib/cn.ts"))).toBe(true);
		expect(readFileSync(join(ui, "src/styles/globals.css"), "utf8")).toContain(
			"--success",
		);
		const lock = await readLock(ui);
		expect(
			Object.values(lock.items)
				.map((i) => i.name)
				.sort(),
		).toEqual(["badge", "tokens"]);

		await revertCommand({ cwd: join(root, "apps/web") });
		expect(existsSync(join(ui, "src/components"))).toBe(false);
		expect(readFileSync(join(ui, "src/styles/globals.css"), "utf8")).toBe(
			'@import "tailwindcss";\n',
		);
	});

	it("re-points imports the ui alias would flatten", async () => {
		const root = workspace();
		await add({ cwd: join(root, "apps/web"), items: ["chip"], install: false });
		const chip = readFileSync(
			join(root, "packages/ui/src/components/ui/chip/chip.tsx"),
			"utf8",
		);
		expect(chip).toContain('from "@workspace/ui/components/ui/badge/badge"');
	});

	it("leaves a single app's imports exactly as shadcn writes them", async () => {
		const root = reactApp();
		await add({ cwd: root, items: ["chip"], install: false });
		const chip = readFileSync(join(root, "src/components/ui/chip/chip.tsx"), "utf8");
		expect(chip).toContain('from "@/components/ui/badge/badge"');
	});
});

describe("init", () => {
	it("writes components.json and utils in one undoable step", async () => {
		const root = fixture({
			"package.json": { dependencies: { next: "16.0.0", react: "19.0.0" } },
			"pnpm-lock.yaml": "",
			"tsconfig.json": { compilerOptions: { paths: { "@/*": ["./src/*"] } } },
			"src/app/page.tsx": "",
		});
		const { init } = await import("../src/commands/init.ts");
		await init(
			{ cwd: root, css: "src/app/globals.css", install: false, base: false },
			"0.0.0",
		);
		const config = JSON.parse(readFileSync(join(root, "components.json"), "utf8"));
		expect(config.aliases.ui).toBe("@/components/ui");
		expect(config.registries["@baby-ui"]).toBe("https://baby-ui.pages.dev/r/{name}.json");
		expect(readFileSync(join(root, "src/lib/utils.ts"), "utf8")).toContain("twMerge");
		await revertCommand({ cwd: root });
		expect(existsSync(join(root, "components.json"))).toBe(false);
		expect(existsSync(join(root, "src/lib"))).toBe(false);
	});
});

describe("maintenance", () => {
	const upstreamEdit = () => {
		const file = join(registryDir, "r/badge.json");
		const item = JSON.parse(readFileSync(file, "utf8"));
		item.files[0].content += "export const v2 = true;\n";
		writeFileSync(file, JSON.stringify(item));
	};

	it("update pulls upstream changes into untouched files and keeps edited ones", async () => {
		const { update } = await import("../src/commands/maintain.ts");
		const root = reactApp();
		await add({ cwd: root, items: ["badge"], install: false });
		upstreamEdit();
		await update({ cwd: root, items: [], install: false });
		const badge = join(root, "src/components/ui/badge/badge.tsx");
		expect(readFileSync(badge, "utf8")).toContain("v2");

		appendFileSync(badge, "// mine\n");
		const item = JSON.parse(readFileSync(join(registryDir, "r/badge.json"), "utf8"));
		item.files[0].content += "export const v3 = true;\n";
		writeFileSync(join(registryDir, "r/badge.json"), JSON.stringify(item));
		await update({ cwd: root, items: ["badge"], install: false });
		expect(readFileSync(badge, "utf8")).toContain("// mine");
		expect(readFileSync(badge, "utf8")).not.toContain("v3");
	});

	it("diff reports drift and sets the exit code", async () => {
		const { diff } = await import("../src/commands/maintain.ts");
		const root = reactApp();
		await add({ cwd: root, items: ["badge"], install: false });
		await diff({ cwd: root, items: [], exitCode: true });
		expect(process.exitCode).toBeUndefined();
		upstreamEdit();
		await diff({ cwd: root, items: [], exitCode: true });
		expect(process.exitCode).toBe(1);
		process.exitCode = undefined;
	});

	it("repair restores deleted files and leaves edits alone", async () => {
		const { repair } = await import("../src/commands/maintain.ts");
		const root = reactApp();
		await add({ cwd: root, items: ["badge"], install: false });
		const cn = join(root, "src/lib/cn.ts");
		const badge = join(root, "src/components/ui/badge/badge.tsx");
		rmSync(cn);
		appendFileSync(badge, "// mine\n");
		writeFileSync(join(root, "src/app/globals.css"), '@import "tailwindcss";\n');
		await repair({ cwd: root, items: [], install: false });
		expect(existsSync(cn)).toBe(true);
		expect(readFileSync(badge, "utf8")).toContain("// mine");
		expect(readFileSync(join(root, "src/app/globals.css"), "utf8")).toContain(
			"--success",
		);
	});

	it("doctor fails on a missing file and passes after repair", async () => {
		const { doctor, repair } = await import("../src/commands/maintain.ts");
		const root = reactApp();
		await add({ cwd: root, items: ["badge"], install: false });
		rmSync(join(root, "src/lib/cn.ts"));
		await doctor({ cwd: root });
		expect(process.exitCode).toBe(1);
		process.exitCode = undefined;
		await repair({ cwd: root, items: [], install: false });
		await doctor({ cwd: root });
		expect(process.exitCode).toBeUndefined();
	});

	it("adopt records files the stock CLI wrote, without touching them", async () => {
		const { repair } = await import("../src/commands/maintain.ts");
		const root = reactApp();
		const badge = join(root, "src/components/ui/badge/badge.tsx");
		mkdirSync(join(root, "src/components/ui/badge"), { recursive: true });
		writeFileSync(badge, "// from stock shadcn, edited\n");
		await repair({ cwd: root, items: ["badge"], adopt: true, install: false });
		expect(readFileSync(badge, "utf8")).toBe("// from stock shadcn, edited\n");
		const lock = await readLock(root);
		const entry = Object.values(lock.items).find((i) => i.name === "badge");
		expect(Object.keys(entry?.files ?? {})).toEqual([
			"src/components/ui/badge/badge.tsx",
		]);
	});

	it("adopt skips a stock shadcn component that only shares the name", async () => {
		const { repair } = await import("../src/commands/maintain.ts");
		const root = reactApp();
		mkdirSync(join(root, "src/components/ui"), { recursive: true });
		writeFileSync(join(root, "src/components/ui/badge.tsx"), "// shadcn's own badge\n");
		await repair({ cwd: root, items: ["badge"], adopt: true, install: false });
		const lock = await readLock(root);
		expect(Object.values(lock.items).some((i) => i.name === "badge")).toBe(false);
	});
});
