import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Any installed Chromium-family browser works; PROBE_BROWSER overrides the search.
const CANDIDATES = {
	win32: [
		"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
		"C:/Program Files/Microsoft/Edge/Application/msedge.exe",
		"C:/Program Files/Google/Chrome/Application/chrome.exe",
		"C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
	],
	darwin: [
		"/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
		"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
		"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
		"/Applications/Chromium.app/Contents/MacOS/Chromium",
	],
	linux: [
		"/usr/bin/google-chrome",
		"/usr/bin/microsoft-edge",
		"/usr/bin/brave-browser",
		"/usr/bin/chromium",
		"/usr/bin/chromium-browser",
	],
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const hasExited = (proc) => proc.exitCode !== null || proc.signalCode !== null;

function waitForExit(proc, timeout = 2000) {
	if (hasExited(proc)) return Promise.resolve();
	return new Promise((resolve) => {
		const done = () => {
			clearTimeout(timer);
			proc.removeListener("close", done);
			resolve();
		};
		const timer = setTimeout(done, timeout);
		proc.once("close", done);
	});
}

async function terminateProcessTree(proc) {
	if (!proc.pid) return;
	if (process.platform === "win32") {
		const killer = spawn("taskkill", ["/PID", String(proc.pid), "/T", "/F"], {
			stdio: "ignore",
		});
		await waitForExit(killer);
	} else {
		try {
			process.kill(-proc.pid, "SIGKILL");
		} catch {
			proc.kill("SIGKILL");
		}
	}
	await waitForExit(proc);
}

async function requestBrowserClose(port) {
	const version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
	const ws = new WebSocket(version.webSocketDebuggerUrl);
	await new Promise((resolve, reject) => {
		ws.addEventListener("open", resolve, { once: true });
		ws.addEventListener("error", reject, { once: true });
	});
	ws.send(JSON.stringify({ id: 1, method: "Browser.close" }));
	await Promise.race([
		new Promise((resolve) => ws.addEventListener("close", resolve, { once: true })),
		wait(2000),
	]);
	ws.close();
}

function findBrowser() {
	const path =
		process.env.PROBE_BROWSER ??
		(process.platform === "linux" ? process.env.CHROME_BIN : undefined) ??
		(CANDIDATES[process.platform] ?? []).find((file) => existsSync(file));
	if (!path)
		throw new Error("No Chromium-family browser found. Set PROBE_BROWSER to its path.");
	return path;
}

/** Starts a headless browser on a free debugging port; `close()` always removes its profile. */
export async function launch() {
	const profile = mkdtempSync(join(tmpdir(), "baby-ui-probe-"));
	const removeProfile = () => {
		try {
			rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
		} catch {}
	};
	const stderr = [];
	const browser = findBrowser();
	const proc = spawn(
		browser,
		[
			"--headless=new",
			"--disable-gpu",
			...(process.platform === "linux" && process.env.CI
				? ["--no-sandbox", "--disable-dev-shm-usage"]
				: []),
			"--remote-debugging-port=0",
			`--user-data-dir=${profile}`,
			"--no-first-run",
			"--no-default-browser-check",
			"--disable-extensions",
			// Parallel tabs are all "background"; keep their timers and rendering at full speed.
			"--disable-background-timer-throttling",
			"--disable-renderer-backgrounding",
			"--disable-backgrounding-occluded-windows",
			"about:blank",
		],
		{
			detached: process.platform !== "win32",
			stdio: ["ignore", "ignore", "pipe"],
		},
	);
	proc.stderr.on("data", (chunk) => stderr.push(String(chunk)));
	// The browser writes the port it picked to DevToolsActivePort once it is listening.
	const portFile = join(profile, "DevToolsActivePort");
	for (let i = 0; i < 100 && !existsSync(portFile); i++) await wait(100);
	if (!existsSync(portFile)) {
		await terminateProcessTree(proc);
		removeProfile();
		const detail = stderr.join("").trim();
		throw new Error(
			`Browser did not start its debugging port.${detail ? ` ${detail}` : ""}`,
		);
	}
	const port = Number(readFileSync(portFile, "utf8").split("\n")[0]);
	let closePromise;
	const killOnExit = () => {
		if (process.platform !== "win32" && proc.pid) {
			try {
				process.kill(-proc.pid, "SIGKILL");
			} catch {}
		} else {
			proc.kill();
		}
	};
	process.once("exit", killOnExit);
	const close = () => {
		if (closePromise) return closePromise;
		closePromise = (async () => {
			await requestBrowserClose(port).catch(() => {});
			await terminateProcessTree(proc);
			process.removeListener("exit", killOnExit);
			removeProfile();
		})();
		return closePromise;
	};
	return { port, close };
}

/** One page over the DevTools protocol, collecting console errors and uncaught exceptions. */
export async function openPage(port, { width = 1280, height = 900 } = {}) {
	// A fresh tab per page, so several can run side by side in one browser.
	const target = await (
		await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })
	).json();
	const ws = new WebSocket(target.webSocketDebuggerUrl);
	await new Promise((resolve, reject) => {
		ws.addEventListener("open", resolve, { once: true });
		ws.addEventListener("error", reject, { once: true });
	});
	let id = 0;
	const pending = new Map();
	const errors = [];
	ws.addEventListener("message", (event) => {
		const msg = JSON.parse(String(event.data));
		if (msg.id && pending.has(msg.id)) {
			const { resolve, reject } = pending.get(msg.id);
			pending.delete(msg.id);
			if (msg.error) reject(new Error(msg.error.message));
			else resolve(msg.result);
		}
		if (msg.method === "Runtime.exceptionThrown")
			errors.push(
				msg.params.exceptionDetails.exception?.description ??
					msg.params.exceptionDetails.text,
			);
		if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error")
			errors.push(msg.params.args.map((a) => a.value ?? a.description).join(" "));
	});
	const send = (method, params = {}) =>
		new Promise((resolve, reject) => {
			const n = ++id;
			pending.set(n, { resolve, reject });
			ws.send(JSON.stringify({ id: n, method, params }));
		});
	await send("Page.enable");
	await send("Runtime.enable");
	await send("Emulation.setDeviceMetricsOverride", {
		width,
		height,
		deviceScaleFactor: 1,
		mobile: false,
	});

	const evaluate = async (expression) => {
		const r = await send("Runtime.evaluate", {
			expression,
			returnByValue: true,
			awaitPromise: true,
		});
		if (r.exceptionDetails)
			throw new Error(
				r.exceptionDetails.exception?.description ?? r.exceptionDetails.text,
			);
		return r.result.value;
	};
	const until = async (expression, timeout = 15000) => {
		const end = Date.now() + timeout;
		while (Date.now() < end) {
			if (await evaluate(expression).catch(() => false)) return true;
			await wait(150);
		}
		return false;
	};
	const mouse = (type, x, y) =>
		send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1 });
	const key = async (key, code, keyCode) => {
		await send("Input.dispatchKeyEvent", {
			type: "rawKeyDown",
			key,
			code,
			windowsVirtualKeyCode: keyCode,
		});
		await send("Input.dispatchKeyEvent", {
			type: "keyUp",
			key,
			code,
			windowsVirtualKeyCode: keyCode,
		});
	};

	return {
		errors,
		send,
		evaluate,
		until,
		wait,
		async goto(url) {
			errors.length = 0;
			await send("Page.navigate", { url });
			await until("document.readyState === 'complete'");
		},
		async click(x, y) {
			await mouse("mouseMoved", x, y);
			await mouse("mousePressed", x, y);
			await mouse("mouseReleased", x, y);
		},
		key,
		close: async () => {
			ws.close();
			await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(() => {});
		},
	};
}
