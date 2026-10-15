#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const cliDir = dirname(dirname(fileURLToPath(import.meta.url)));
const createDir = join(cliDir, "..", "create-baby-ui");
const { version } = JSON.parse(readFileSync(join(cliDir, "package.json"), "utf8"));
const work = mkdtempSync(join(process.env.RUNNER_TEMP ?? tmpdir(), "baby-ui-smoke-"));

const write = (file, content) => {
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, typeof content === "string" ? content : JSON.stringify(content));
};

// npm and pnpm are .cmd shims on Windows, which only start through a shell.
const sh = (cmd, args, cwd) =>
	execFileSync(cmd, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });

function check(label, ok, detail = "") {
	if (!ok) throw new Error(`smoke: ${label} failed ${detail}`);
	console.log(`ok  ${label}`);
}

// The tarballs, installed as npm users get them, driving real commands against a file registry.
try {
	const packs = join(work, "packs");
	sh("pnpm", ["pack", "--pack-destination", packs], cliDir);
	sh("pnpm", ["pack", "--pack-destination", packs], createDir);
	const tarballs = readdirSync(packs).map((f) => join(packs, f));

	const tool = join(work, "tool");
	write(join(tool, "package.json"), { name: "smoke-tool", private: true });
	sh("npm", ["install", "--no-audit", "--no-fund", ...tarballs], tool);
	const bin = join(tool, "node_modules", "@baby-ui", "cli", "bin.mjs");
	const create = join(tool, "node_modules", "create-baby-ui", "index.mjs");

	const registry = join(work, "registry");
	write(join(registry, "r/tokens.json"), {
		name: "tokens",
		type: "registry:style",
		cssVars: { light: { success: "oklch(73% 0.19 150)" } },
	});
	write(join(registry, "r/theme.json"), {
		name: "theme",
		type: "registry:theme",
		registryDependencies: ["https://baby-ui.pages.dev/r/tokens.json"],
	});
	write(join(registry, "r/badge.json"), {
		name: "badge",
		type: "registry:ui",
		files: [
			{
				path: "badge/badge.tsx",
				type: "registry:ui",
				target: "components/ui/badge/badge.tsx",
				content: 'import { cn } from "@/lib/utils";\nexport const Badge = cn;\n',
			},
		],
	});

	const app = join(work, "app");
	write(join(app, "package.json"), {
		name: "app",
		dependencies: { next: "16.0.0", react: "19.0.0" },
	});
	write(join(app, "tsconfig.json"), {
		compilerOptions: { paths: { "@/*": ["./src/*"] } },
	});
	write(join(app, "package-lock.json"), "{}");
	write(join(app, "src/app/page.tsx"), "export default function Page() {}\n");

	const env = {
		...process.env,
		CI: "1",
		BABY_UI_REGISTRY_URL: pathToFileURL(registry).toString(),
		BABY_UI_CACHE_DIR: join(work, "cache"),
		BABY_UI_CONFIG_DIR: join(work, "config"),
	};
	const run = (file, args) =>
		spawnSync(process.execPath, [file, ...args, "--cwd", app], { env, encoding: "utf8" });

	const v = run(bin, ["--version"]);
	check("--version", v.stdout.trim() === version, v.stdout);

	const info = run(bin, ["info", "--json"]);
	const targets = JSON.parse(info.stdout).targets;
	check("info detects the Next app", targets.length === 1 && targets[0].meta === "next");

	const help = run(create, ["--help"]);
	check("create-baby-ui runs init", help.status === 0 && help.stdout.includes("init"));

	const init = run(bin, ["init", "-y", "--no-install", "--css", "src/app/globals.css"]);
	check(
		"init",
		init.status === 0 && existsSync(join(app, "components.json")),
		init.stderr,
	);
	check(
		"init applied the theme",
		readFileSync(join(app, "src/app/globals.css"), "utf8").includes("--success"),
	);

	const add = run(bin, ["add", "badge", "--no-install"]);
	const badge = join(app, "src/components/ui/badge/badge.tsx");
	check("add", add.status === 0 && existsSync(badge), add.stderr);
	check("lock written", existsSync(join(app, ".baby-ui", "lock.json")));

	const undo = run(bin, ["undo"]);
	check("undo", undo.status === 0 && !existsSync(badge), undo.stderr);

	const missing = run(bin, ["add", "nope", "--no-install"]);
	check(
		"unknown item fails cleanly",
		missing.status === 1 && /Not found/.test(missing.stderr),
	);
} finally {
	rmSync(work, { recursive: true, force: true });
}
