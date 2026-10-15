import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach } from "vitest";

const created: string[] = [];

afterEach(() => {
	for (const dir of created.splice(0)) rmSync(dir, { recursive: true, force: true });
});

/** Writes `files` (objects become JSON) into a fresh temp dir, removed after each test. */
export function fixture(files: Record<string, string | object>): string {
	const root = mkdtempSync(join(tmpdir(), "baby-ui-cli-"));
	created.push(root);
	for (const [path, content] of Object.entries(files)) {
		const file = join(root, path);
		mkdirSync(dirname(file), { recursive: true });
		writeFileSync(file, typeof content === "string" ? content : JSON.stringify(content));
	}
	return root;
}
