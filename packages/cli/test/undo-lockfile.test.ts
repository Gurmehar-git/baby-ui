import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { add } from "../src/commands/add.ts";
import { revertCommand } from "../src/commands/history.ts";
import * as deps from "../src/write/deps.ts";
import { listJournals } from "../src/write/tx.ts";
import { fixture } from "./fixture.ts";

const originalLock = "lockfileVersion: '9.0'\nimporters: {}\n";
const installedLock = "lockfileVersion: '9.0'\nimporters: {installed: true}\n";
const config = {
	$schema: "https://ui.shadcn.com/schema.json",
	tailwind: { css: "src/index.css" },
	aliases: { components: "@/components", utils: "@/lib/utils" },
};

function app(lock = true) {
	return fixture({
		"package.json": { name: "consumer", packageManager: "pnpm@11.1.2" },
		"components.json": config,
		"tsconfig.json": { compilerOptions: { paths: { "@/*": ["./src/*"] } } },
		"src/index.css": '@import "tailwindcss";\n',
		...(lock ? { "pnpm-lock.yaml": originalLock } : {}),
	});
}

function installer(lockRoot: string, fail = false) {
	vi.spyOn(deps, "install").mockImplementation(async (project, packages) => {
		if (!packages.length) return;
		const manifest = join(project.root, "package.json");
		const pkg = JSON.parse(readFileSync(manifest, "utf8"));
		pkg.dependencies = { clsx: "2.1.1" };
		writeFileSync(manifest, JSON.stringify(pkg));
		writeFileSync(join(lockRoot, "pnpm-lock.yaml"), installedLock);
		if (fail) throw new Error("Install failed after updating the lockfile");
	});
}

let item: string;

beforeEach(() => {
	vi.spyOn(process.stdout, "write").mockReturnValue(true);
	vi.spyOn(console, "log").mockReturnValue();
	const registry = fixture({
		"example.json": {
			name: "example",
			type: "registry:ui",
			dependencies: ["clsx"],
			files: [
				{ path: "ui/example.tsx", type: "registry:ui", content: "export const X = 1;" },
			],
		},
	});
	item = pathToFileURL(join(registry, "example.json")).href;
});

afterEach(() => vi.restoreAllMocks());

describe("pnpm lockfile undo", () => {
	it("restores the existing lockfile and manifest, and redoes both", async () => {
		const root = app();
		const manifest = readFileSync(join(root, "package.json"), "utf8");
		installer(root);
		await add({ cwd: root, items: [item] });
		await revertCommand({ cwd: root });
		expect(readFileSync(join(root, "pnpm-lock.yaml"), "utf8")).toBe(originalLock);
		expect(readFileSync(join(root, "package.json"), "utf8")).toBe(manifest);
		const [undo] = await listJournals(root);
		await revertCommand({ cwd: root, id: undo?.id });
		expect(readFileSync(join(root, "pnpm-lock.yaml"), "utf8")).toBe(installedLock);
		expect(
			JSON.parse(readFileSync(join(root, "package.json"), "utf8")).dependencies,
		).toEqual({ clsx: "2.1.1" });
	});

	it("removes a newly created lockfile on undo and restores it on redo", async () => {
		const root = app(false);
		installer(root);
		await add({ cwd: root, items: [item] });
		await revertCommand({ cwd: root });
		expect(existsSync(join(root, "pnpm-lock.yaml"))).toBe(false);
		const [undo] = await listJournals(root);
		await revertCommand({ cwd: root, id: undo?.id });
		expect(readFileSync(join(root, "pnpm-lock.yaml"), "utf8")).toBe(installedLock);
	});

	it("refuses to undo over lockfile edits made after installation", async () => {
		const root = app();
		installer(root);
		await add({ cwd: root, items: [item] });
		appendFileSync(join(root, "pnpm-lock.yaml"), "# user edit\n");
		await expect(revertCommand({ cwd: root })).rejects.toThrow(/cancelled/);
		expect(readFileSync(join(root, "pnpm-lock.yaml"), "utf8")).toContain("# user edit");
		expect(
			JSON.parse(readFileSync(join(root, "package.json"), "utf8")).dependencies,
		).toEqual({ clsx: "2.1.1" });
	});

	it("restores a workspace lockfile outside the target package", async () => {
		const root = fixture({
			"package.json": { name: "workspace", private: true },
			"pnpm-workspace.yaml": "packages:\n  - apps/*\n",
			"pnpm-lock.yaml": originalLock,
			"apps/web/package.json": { name: "web" },
			"apps/web/components.json": config,
			"apps/web/tsconfig.json": { compilerOptions: { paths: { "@/*": ["./src/*"] } } },
			"apps/web/src/index.css": '@import "tailwindcss";\n',
		});
		const cwd = join(root, "apps/web");
		installer(root);
		await add({ cwd, items: [item] });
		await revertCommand({ cwd });
		expect(readFileSync(join(root, "pnpm-lock.yaml"), "utf8")).toBe(originalLock);
		expect(existsSync(join(cwd, "pnpm-lock.yaml"))).toBe(false);
	});

	it("leaves the lockfile untracked when dependency installation is skipped", async () => {
		const root = app();
		await add({ cwd: root, items: [item], install: false });
		appendFileSync(join(root, "pnpm-lock.yaml"), "# user edit\n");
		await revertCommand({ cwd: root });
		expect(readFileSync(join(root, "pnpm-lock.yaml"), "utf8")).toContain("# user edit");
	});

	it("can undo package manager writes even when installation fails", async () => {
		const root = app();
		const manifest = readFileSync(join(root, "package.json"), "utf8");
		installer(root, true);
		await expect(add({ cwd: root, items: [item] })).rejects.toThrow(/Install failed/);
		await revertCommand({ cwd: root });
		expect(readFileSync(join(root, "pnpm-lock.yaml"), "utf8")).toBe(originalLock);
		expect(readFileSync(join(root, "package.json"), "utf8")).toBe(manifest);
	});
});
