import { existsSync } from "node:fs";
import { join } from "node:path";
import { ancestors, type Json } from "./fs.ts";

export const PACKAGE_MANAGERS = ["pnpm", "bun", "yarn", "npm"] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];
export type PmSource = "flag" | "lockfile" | "packageManager" | "user agent" | "default";

const LOCKFILES: ReadonlyArray<[string, PackageManager]> = [
	["pnpm-lock.yaml", "pnpm"],
	["bun.lock", "bun"],
	["bun.lockb", "bun"],
	["yarn.lock", "yarn"],
	["package-lock.json", "npm"],
];

export function lockfilesFor(pm: PackageManager): string[] {
	return LOCKFILES.filter(([, manager]) => manager === pm).map(([file]) => file);
}

export function isPackageManager(value: string): value is PackageManager {
	return PACKAGE_MANAGERS.some((pm) => pm === value);
}

// Monorepo packages have no lockfile of their own, so the search walks up to `stop`.
export function detectPm(
	root: string,
	pkg: Json | undefined,
	stop: string,
): { pm: PackageManager; pmSource: PmSource } {
	for (const dir of ancestors(root)) {
		for (const [file, pm] of LOCKFILES) {
			if (existsSync(join(dir, file))) return { pm, pmSource: "lockfile" };
		}
		if (dir === stop) break;
	}
	const declared = String(pkg?.packageManager ?? "").split("@")[0] ?? "";
	if (isPackageManager(declared)) return { pm: declared, pmSource: "packageManager" };
	const agent = (process.env.npm_config_user_agent ?? "").split("/")[0] ?? "";
	if (isPackageManager(agent)) return { pm: agent, pmSource: "user agent" };
	return { pm: "npm", pmSource: "default" };
}
