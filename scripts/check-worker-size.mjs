import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { gzipSync } from "node:zlib";

// Cloudflare caps a Worker at 3 MiB gzipped on the free plan, 10 MiB on paid. The
// budget leaves room to grow, since sources.json is inlined and grows per component.
const BUDGET = 2.6 * 1024 * 1024;
const SITE = resolve(import.meta.dirname, "../apps/site");

const out = mkdtempSync(join(tmpdir(), "baby-ui-worker-"));
try {
	execFileSync("pnpm", ["exec", "wrangler", "deploy", "--dry-run", "--outdir", out], {
		cwd: SITE,
		stdio: "pipe",
		shell: process.platform === "win32",
	});
	const worker = readFileSync(join(out, "_worker.js"));
	// React previews are client-only (@baby-ui/react-preview); ReactDOM in the Worker means a leak.
	if (/__reactContainer\$|react-dom\.production/.test(worker.toString("utf8"))) {
		console.error(
			"Worker bundle contains ReactDOM: a React import escaped its SSR guard.",
		);
		process.exit(1);
	}
	const bytes = gzipSync(worker, { level: 9 }).length;
	const mib = (n) => `${(n / 1024 / 1024).toFixed(2)} MiB`;

	if (bytes > BUDGET) {
		console.error(`Worker bundle ${mib(bytes)} gzipped, over the ${mib(BUDGET)} budget.`);
		console.error(
			"Move generated JSON out of the bundle and read it from the assets binding.",
		);
		process.exit(1);
	}
	console.log(`Worker bundle: ${mib(bytes)} gzipped (budget ${mib(BUDGET)})`);
} finally {
	rmSync(out, { recursive: true, force: true });
}
