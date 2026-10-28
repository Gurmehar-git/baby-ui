import { routeUrl } from "../lib/portless.mjs";

const SITE_HOST = "site.baby-ui.localhost";

const reachable = (url) =>
	fetch(url, { signal: AbortSignal.timeout(5000) }).then(
		(r) => r.ok,
		() => false,
	);

/** The running site (`--url`, else `pnpm dev`'s portless route); parity never starts one itself. */
export async function siteUrl(override) {
	const url = (override ?? routeUrl(SITE_HOST))?.replace(/\/$/, "");
	if (url && (await reachable(`${url}/frame`))) return url;
	throw new Error(
		`parity: no running site${url ? ` at ${url}` : ""}. Start \`pnpm dev\`, or pass --url=http://localhost:<port>.`,
	);
}

/** One demo, chrome-free, in either port: the site's /frame route. */
export function frameUrl(site, framework, slug, props = {}) {
	const query = new URLSearchParams({ framework, slug, props: JSON.stringify(props) });
	return `${site}/frame?${query}`;
}
