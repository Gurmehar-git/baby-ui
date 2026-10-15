import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { selectTargets } from "../src/project/select.ts";
import {
	discoverTargets,
	findWorkspace,
	matchTarget,
	targetAt,
} from "../src/project/targets.ts";
import { fixture } from "./fixture.ts";

const monorepo = () =>
	fixture({
		"package.json": { name: "root", devDependencies: { react: "19.0.0" } },
		"pnpm-workspace.yaml":
			'packages:\n  - "apps/*"\n  - "packages/*"\n  - "!packages/skip"\n',
		"pnpm-lock.yaml": "",
		"apps/web/package.json": { name: "web", dependencies: { next: "16.0.0" } },
		"apps/docs/package.json": {
			name: "docs",
			devDependencies: { "@sveltejs/kit": "^3" },
		},
		"apps/docs/src/routes/page.svelte": "",
		"packages/ui/package.json": { name: "@acme/ui", dependencies: { react: "19.0.0" } },
		"packages/ui/components.json": { $schema: "https://ui.shadcn.com/schema.json" },
		"packages/tokens/package.json": { name: "tokens" },
		"packages/skip/package.json": { name: "skip", dependencies: { react: "19.0.0" } },
	});

describe("targets", () => {
	it("discovers React and Svelte packages, skipping a tooling-only root", async () => {
		const root = monorepo();
		const workspace = await findWorkspace(join(root, "apps", "docs", "src", "routes"));
		expect(workspace.root).toBe(root);
		const targets = await discoverTargets(workspace);
		expect(targets.map((t) => [t.path, t.framework])).toEqual([
			["apps/docs", "svelte"],
			["apps/web", "react"],
			["packages/ui", "react"],
		]);
	});

	it("picks the package around cwd, by name, or by path", async () => {
		const root = monorepo();
		const targets = await discoverTargets(await findWorkspace(root));
		expect(targetAt(targets, join(root, "apps", "docs", "src"))?.name).toBe("docs");
		expect(targetAt(targets, root)).toBeUndefined();
		expect(matchTarget(targets, "@acme/ui")?.path).toBe("packages/ui");
		expect(matchTarget(targets, "./apps/web/")?.name).toBe("web");
	});

	it("requires --target or --all at a monorepo root without a TTY", async () => {
		const root = monorepo();
		const targets = await discoverTargets(await findWorkspace(root));
		await expect(selectTargets(targets, root, {})).rejects.toThrow(/--target/);
		await expect(selectTargets(targets, root, { all: true })).resolves.toHaveLength(3);
		await expect(selectTargets(targets, root, { target: ["nope"] })).rejects.toThrow(
			/nope/,
		);
	});

	it("treats an app outside the workspace patterns as standalone", async () => {
		const root = monorepo();
		const scratch = join(root, "scratch", "app");
		mkdirSync(scratch, { recursive: true });
		writeFileSync(join(scratch, "package.json"), '{ "dependencies": { "react": "19" } }');
		expect(await findWorkspace(scratch)).toEqual({ root: scratch, patterns: [] });
		expect((await findWorkspace(join(root, "apps", "web"))).root).toBe(root);
	});

	it("treats a single app as its own workspace", async () => {
		const root = fixture({ "package.json": { dependencies: { svelte: "^5" } } });
		const targets = await discoverTargets(await findWorkspace(root));
		expect(targets.map((t) => [t.path, t.meta])).toEqual([[".", "vite-svelte"]]);
	});
});
