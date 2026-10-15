import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { credential } from "../auth.ts";
import { CliError } from "../errors.ts";
import { log } from "../logger.ts";
import { type ItemRequest, registryOrigin } from "./resolve.ts";

export function cacheDir(): string {
	if (process.env.BABY_UI_CACHE_DIR) return process.env.BABY_UI_CACHE_DIR;
	if (process.platform === "win32") {
		return join(
			process.env.LOCALAPPDATA ?? join(homedir(), "AppData", "Local"),
			"baby-ui",
			"cache",
		);
	}
	if (process.platform === "darwin")
		return join(homedir(), "Library", "Caches", "baby-ui");
	return join(process.env.XDG_CACHE_HOME ?? join(homedir(), ".cache"), "baby-ui");
}

interface CacheEntry {
	etag: string | null;
	body: string;
}

const entryPath = (url: string) =>
	join(cacheDir(), `${createHash("sha256").update(url).digest("hex").slice(0, 32)}.json`);

async function readCache(url: string): Promise<CacheEntry | undefined> {
	try {
		const entry: unknown = JSON.parse(await readFile(entryPath(url), "utf8"));
		if (
			typeof entry === "object" &&
			entry &&
			"body" in entry &&
			typeof entry.body === "string"
		) {
			const etag = "etag" in entry && typeof entry.etag === "string" ? entry.etag : null;
			return { etag, body: entry.body };
		}
	} catch {}
	return undefined;
}

async function writeCache(url: string, entry: CacheEntry): Promise<void> {
	try {
		await mkdir(cacheDir(), { recursive: true });
		await writeFile(entryPath(url), JSON.stringify(entry));
	} catch {}
}

// The licence token only ever goes to our own registry origin, never to third parties.
async function authHeaders(url: string, headers: Readonly<Record<string, string>>) {
	const has = Object.keys(headers).some((k) => k.toLowerCase() === "authorization");
	if (has || !url.startsWith(`${registryOrigin()}/`)) return headers;
	const cred = await credential();
	return cred ? { ...headers, authorization: `Bearer ${cred.token}` } : headers;
}

/** Fetches text with an ETag cache; offline runs fall back to the cached copy. */
export async function fetchText({ url, headers }: ItemRequest): Promise<string> {
	if (url.startsWith("file:")) return readFile(fileURLToPath(url), "utf8");
	const cached = await readCache(url);
	let response: Response;
	try {
		response = await fetch(url, {
			headers: {
				...(await authHeaders(url, headers)),
				...(cached?.etag ? { "if-none-match": cached.etag } : {}),
			},
		});
	} catch (error) {
		if (cached) {
			log.warn(`Offline, using the cached copy of ${url}`);
			return cached.body;
		}
		throw new CliError(`Could not reach ${url}.`, { hint: String(error) });
	}
	if (response.status === 304 && cached) return cached.body;
	if (response.status === 401 || response.status === 403) {
		throw new CliError(`${url} needs authorisation (HTTP ${response.status}).`, {
			hint: "Pro items need `baby-ui login`; other registries need their headers in components.json.",
		});
	}
	if (response.status === 404) throw new CliError(`Not found: ${url}`);
	if (!response.ok) throw new CliError(`HTTP ${response.status} from ${url}`);
	const body = await response.text();
	await writeCache(url, { etag: response.headers.get("etag"), body });
	return body;
}

export async function fetchJson(request: ItemRequest): Promise<unknown> {
	const text = await fetchText(request);
	try {
		return JSON.parse(text);
	} catch {
		throw new CliError(`${request.url} did not return JSON.`);
	}
}
