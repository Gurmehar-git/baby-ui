import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { detectProject } from "../src/project/detect.ts";
import { discoverTargets, findWorkspace } from "../src/project/targets.ts";
import { fixture } from "./fixture.ts";

afterEach(() => vi.unstubAllEnvs());

describe("workspace package manager declarations", () => {
	it.each(["pnpm", "yarn", "bun", "npm"])(
		"inherits %s from the workspace root before the user agent",
		async (pm) => {
			vi.stubEnv("npm_config_user_agent", pm === "npm" ? "pnpm/11.0.0" : "npm/11.0.0");
			const root = fixture({
				"package.json": { packageManager: `${pm}@1.0.0`, workspaces: ["apps/*"] },
				"apps/web/package.json": { dependencies: { next: "16.0.0" } },
			});
			const targets = await discoverTargets(await findWorkspace(join(root, "apps/web")));
			expect(targets).toHaveLength(1);
			expect(targets[0]).toMatchObject({ pm, pmSource: "packageManager", meta: "next" });
		},
	);

	it("uses the nearest valid ancestor declaration", () => {
		vi.stubEnv("npm_config_user_agent", "npm/11.0.0");
		const root = fixture({
			"package.json": { packageManager: "pnpm@11.0.0" },
			"apps/package.json": { packageManager: "yarn@4.0.0" },
			"apps/web/package.json": { packageManager: "unsupported@1.0.0" },
		});
		expect(detectProject(join(root, "apps/web"), root)).toMatchObject({
			pm: "yarn",
			pmSource: "packageManager",
		});
	});

	it("keeps the target package declaration ahead of its ancestors", () => {
		const root = fixture({
			"package.json": { packageManager: "pnpm@11.0.0" },
			"apps/web/package.json": { packageManager: "bun@1.0.0" },
		});
		expect(detectProject(join(root, "apps/web"), root)).toMatchObject({
			pm: "bun",
			pmSource: "packageManager",
		});
	});

	it("keeps lockfiles ahead of package manager declarations", () => {
		const root = fixture({
			"package.json": { packageManager: "pnpm@11.0.0" },
			"yarn.lock": "",
			"apps/web/package.json": { packageManager: "bun@1.0.0" },
		});
		expect(detectProject(join(root, "apps/web"), root)).toMatchObject({
			pm: "yarn",
			pmSource: "lockfile",
		});
	});

	it("does not inherit declarations beyond the workspace boundary", () => {
		vi.stubEnv("npm_config_user_agent", "npm/11.0.0");
		const root = fixture({
			"package.json": { packageManager: "pnpm@11.0.0" },
			"apps/web/package.json": { dependencies: { react: "19.0.0" } },
		});
		expect(detectProject(join(root, "apps/web"))).toMatchObject({
			pm: "npm",
			pmSource: "user agent",
		});
	});
});
