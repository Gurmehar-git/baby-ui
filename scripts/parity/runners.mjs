import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { join } from "node:path";
import { ROOT } from "../gen/core.mjs";
import { routeUrl } from "../lib/portless.mjs";

const APPS = {
	react: { dir: "apps/playground/react-runner", host: "react-runner.baby-ui.localhost" },
	svelte: {
		dir: "apps/playground/svelte-runner",
		host: "svelte-runner.baby-ui.localhost",
	},
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const reachable = (url) =>
	fetch(url, { signal: AbortSignal.timeout(3000) }).then(
		(r) => r.ok,
		() => false,
	);

const freePort = () =>
	new Promise((resolve, reject) => {
		const server = createServer();
		server.once("error", reject);
		server.listen(0, "127.0.0.1", () => {
			const { port } = server.address();
			server.close(() => resolve(port));
		});
	});

function stop(child) {
	if (!child.pid) return;
	// A dev server spawns its own children; on Windows only taskkill /T reaches them.
	if (process.platform === "win32")
		spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" });
	else child.kill();
}

/**
 * Both runner URLs: `url` overrides, then a running `pnpm dev` (portless names), else a Vite dev
 * server started here and stopped by `close()` (and on exit).
 */
export async function runners(overrides = {}) {
	const started = [];
	const urls = {};
	for (const [framework, app] of Object.entries(APPS)) {
		const running = overrides[framework] ?? routeUrl(app.host);
		if (running && (await reachable(running))) {
			urls[framework] = running.replace(/\/$/, "");
			continue;
		}
		const port = await freePort();
		const child = spawn(
			process.execPath,
			[
				join(ROOT, app.dir, "node_modules/vite/bin/vite.js"),
				"--port",
				String(port),
				"--strictPort",
				"--host",
				"127.0.0.1",
			],
			{ cwd: join(ROOT, app.dir), stdio: "ignore" },
		);
		started.push(child);
		const url = `http://127.0.0.1:${port}`;
		let up = false;
		for (let i = 0; i < 120 && !up; i++) {
			await wait(500);
			up = await reachable(url);
		}
		if (!up) {
			started.forEach(stop);
			throw new Error(`${framework} runner did not start on ${url}`);
		}
		urls[framework] = url;
	}
	const close = () => started.forEach(stop);
	process.once("exit", close);
	return { urls, close, started: started.length };
}
