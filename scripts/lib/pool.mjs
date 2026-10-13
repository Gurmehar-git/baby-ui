import { spawn } from "node:child_process";
import { availableParallelism, freemem } from "node:os";

// svelte-check and tsc peak around this much each, so free memory caps the pool, not cores alone.
const MEMORY_PER_JOB = 1.5 * 1024 ** 3;

/** Parallel jobs this machine can take: one core spare, never more than free memory allows. */
export function defaultJobs() {
	const byCpu = availableParallelism() - 1;
	const byMemory = Math.floor(freemem() / MEMORY_PER_JOB);
	return Math.max(1, Math.min(byCpu, byMemory, 8));
}

/** Ends a shell command and everything it started (pnpm spawns the real tool as a grandchild). */
function killTree(child) {
	if (child.exitCode !== null || !child.pid) return;
	if (process.platform === "win32")
		spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" });
	else process.kill(-child.pid, "SIGTERM");
}

/**
 * Runs `{ name, cmd }` tasks with at most `jobs` at once. Output is buffered per task and handed to
 * `onDone`, so parallel logs never interleave. With `failFast`, the first failure stops the rest.
 */
export function runPool(
	tasks,
	{ cwd, jobs = defaultJobs(), failFast = true, onStart, onDone },
) {
	const queue = [...tasks];
	const running = new Set();
	const results = [];
	let stopped = false;

	return new Promise((resolveAll) => {
		const next = () => {
			if ((stopped || !queue.length) && !running.size) {
				process.removeListener("SIGINT", interrupt);
				return resolveAll(results);
			}
			while (!stopped && queue.length && running.size < jobs) start(queue.shift());
		};
		const start = (task) => {
			const started = Date.now();
			const child = spawn(task.cmd, {
				cwd,
				shell: true,
				detached: process.platform !== "win32",
				env: { ...process.env, FORCE_COLOR: "1" },
			});
			child.task = task;
			const chunks = [];
			child.stdout.on("data", (chunk) => chunks.push(chunk));
			child.stderr.on("data", (chunk) => chunks.push(chunk));
			running.add(child);
			onStart?.(task);
			child.on("close", (code) => {
				running.delete(child);
				const result = {
					...task,
					ok: code === 0 && !task.cancelled,
					cancelled: Boolean(task.cancelled),
					seconds: Math.round((Date.now() - started) / 100) / 10,
					output: Buffer.concat(chunks).toString(),
				};
				results.push(result);
				onDone?.(result);
				if (!result.ok && !result.cancelled && failFast && !stopped) {
					stopped = true;
					for (const other of running) {
						other.task.cancelled = true;
						killTree(other);
					}
				}
				next();
			});
		};
		// Ctrl+C must not leave checkers running in the background.
		const interrupt = () => {
			stopped = true;
			for (const child of running) killTree(child);
			process.exit(130);
		};
		process.once("SIGINT", interrupt);
		next();
	});
}
