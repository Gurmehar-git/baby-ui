import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { detectProject } from "../src/project/detect.ts";
import { fixture } from "./fixture.ts";

describe("detectProject", () => {
	it("reads a shadcn React config and tsconfig paths", () => {
		const root = fixture({
			"package.json": { dependencies: { next: "16.0.0", react: "19.0.0" } },
			"pnpm-lock.yaml": "",
			"components.json": {
				$schema: "https://ui.shadcn.com/schema.json",
				tailwind: { css: "app/globals.css" },
				aliases: { components: "@/components", utils: "@/lib/utils" },
			},
			"tsconfig.json": `{
				// JSONC, as Next writes it
				"compilerOptions": { "paths": { "@/*": ["./src/*"], }, },
			}`,
		});
		const project = detectProject(root);
		expect(project).toMatchObject({
			framework: "react",
			frameworkSource: "components.json",
			meta: "next",
			pm: "pnpm",
			pmSource: "lockfile",
			dollarLib: false,
		});
		expect(project.config?.css).toBe("app/globals.css");
		expect(project.aliases).toEqual([
			{ prefix: "@/", dir: join(root, "src"), withExtension: false },
		]);
	});

	it("follows SvelteKit 2's generated tsconfig for $lib", () => {
		const root = fixture({
			"package.json": { devDependencies: { "@sveltejs/kit": "^2.20.0", svelte: "^5" } },
			"components.json": { typescript: true, aliases: { components: "$lib/components" } },
			"tsconfig.json": { extends: "./.svelte-kit/tsconfig.json" },
			".svelte-kit/tsconfig.json": {
				compilerOptions: { paths: { $lib: ["../src/lib"], "$lib/*": ["../src/lib/*"] } },
			},
		});
		const project = detectProject(root);
		expect(project).toMatchObject({
			framework: "svelte",
			meta: "sveltekit",
			dollarLib: true,
		});
		expect(project.aliases).toEqual([
			{ prefix: "$lib/", dir: join(root, "src", "lib"), withExtension: false },
		]);
	});

	it("uses package imports on SvelteKit 3 and detects from dependencies", () => {
		const root = fixture({
			"package.json": {
				imports: { "#lib/*": "./src/lib/*" },
				devDependencies: { "@sveltejs/kit": "^3.0.0", svelte: "^5" },
			},
		});
		const project = detectProject(root);
		expect(project).toMatchObject({
			framework: "svelte",
			frameworkSource: "dependencies",
			config: undefined,
			dollarLib: false,
		});
		expect(project.aliases).toEqual([
			{ prefix: "#lib/", dir: join(root, "src", "lib"), withExtension: true },
		]);
	});

	it("finds the lockfile above a workspace package", () => {
		const root = fixture({
			"bun.lock": "",
			"packages/ui/package.json": { dependencies: { react: "19.0.0" } },
		});
		expect(detectProject(join(root, "packages", "ui"), root)).toMatchObject({
			pm: "bun",
			pmSource: "lockfile",
			meta: "vite-react",
		});
	});
});
