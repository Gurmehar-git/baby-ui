import { existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

// What adapter-cloudflare publishes as static assets: prerendered pages, client bundle, static/.
export const BUILD_DIR = resolve(
	import.meta.dirname,
	"../../apps/site/.svelte-kit/cloudflare",
);

const TYPES = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript",
	".css": "text/css",
	".json": "application/json",
	".md": "text/markdown; charset=utf-8",
	".txt": "text/plain; charset=utf-8",
	".xml": "application/xml",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".webp": "image/webp",
	".woff2": "font/woff2",
	".wasm": "application/wasm",
};

/** The file a URL path maps to, the way Cloudflare's asset server resolves prerendered pages. */
function resolveFile(pathname) {
	const base = normalize(join(BUILD_DIR, decodeURIComponent(pathname)));
	if (!base.startsWith(BUILD_DIR)) return null;
	for (const file of [base, `${base}.html`, join(base, "index.html")])
		if (existsSync(file) && statSync(file).isFile()) return file;
	return null;
}

/** Serves the last `pnpm build` on a free port; dynamic routes (`/api/*`) are not available. */
export function serveBuild() {
	if (!existsSync(BUILD_DIR))
		throw new Error(
			"No build at apps/site/.svelte-kit/cloudflare. Run `pnpm build` first.",
		);
	const server = createServer((req, res) => {
		const file = resolveFile(new URL(req.url ?? "/", "http://x").pathname);
		if (!file) {
			res.writeHead(404).end("Not found");
			return;
		}
		res.writeHead(200, {
			"content-type": TYPES[extname(file)] ?? "application/octet-stream",
		});
		res.end(readFileSync(file));
	});
	return new Promise((done) => {
		server.listen(0, "127.0.0.1", () => {
			const address = server.address();
			const port = typeof address === "object" && address ? address.port : 0;
			done({ url: `http://127.0.0.1:${port}`, close: () => server.close() });
		});
	});
}
