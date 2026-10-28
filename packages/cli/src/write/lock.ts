import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { z } from "zod";
import { toPosix } from "../project/fs.ts";

export const STATE_DIR = ".baby-ui";

export const sha256 = (content: string | Uint8Array) =>
	createHash("sha256").update(content).digest("hex");

const LockItemSchema = z.object({
	name: z.string(),
	type: z.string(),
	framework: z.enum(["react", "svelte"]),
	installedAt: z.string(),
	/** Item JSON hash, so `update` can tell an upstream change from a local one. */
	itemHash: z.string(),
	/** Root-relative posix path to the sha256 of exactly what we wrote. */
	files: z.record(z.string(), z.string()),
	dependencies: z.array(z.string()),
	registryDependencies: z.array(z.string()),
});

/** Items keyed by the URL they were installed from. */
const LockFileSchema = z.object({
	version: z.literal(1),
	items: z.record(z.string(), LockItemSchema),
});

export type LockItem = z.infer<typeof LockItemSchema>;
export type LockFile = z.infer<typeof LockFileSchema>;

export const lockPath = (root: string) => join(root, STATE_DIR, "lock.json");

export async function readLock(root: string): Promise<LockFile> {
	try {
		const parsed = LockFileSchema.safeParse(
			JSON.parse(await readFile(lockPath(root), "utf8")),
		);
		if (parsed.success) return parsed.data;
	} catch {}
	return { version: 1, items: {} };
}

const sortKeys = <T>(record: Readonly<Record<string, T>>) =>
	Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));

/** Stable output, so the committed lock diffs cleanly. */
export function serializeLock(lock: LockFile): string {
	const items = Object.fromEntries(
		Object.entries(sortKeys(lock.items)).map(([url, item]) => [
			url,
			{ ...item, files: sortKeys(item.files) },
		]),
	);
	return `${JSON.stringify({ version: 1, items }, null, "\t")}\n`;
}

export const relativeTo = (root: string, file: string) => toPosix(relative(root, file));

/** The lock entry that owns `path`, if any. */
export function ownerOf(lock: LockFile, path: string): [string, LockItem] | undefined {
	return Object.entries(lock.items).find(([, item]) => path in item.files);
}
