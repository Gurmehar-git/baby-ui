import { guides } from "virtual:docvia/source";
import { CATEGORIES, docsPath } from "@baby-ui/registry-schema";
import { COLLECTIONS, categoryHref } from "#lib/registry.js";
import { absoluteUrl, SITE_URL } from "#lib/seo.js";
import { liveSpecs as specs } from "#lib/server/registry.js";
import { STUDIOS } from "#lib/studio/studios.js";
import type { RequestHandler } from "./$types";

export const prerender = true;

// Prerendered once at build time: always the real domain, never the machine that built it.
function url(path: string, priority: string): string {
	return `<url><loc>${absoluteUrl(SITE_URL, path)}</loc><priority>${priority}</priority></url>`;
}

export const GET: RequestHandler = async () => {
	const staticPages = [url("/", "1.0"), url("/components", "0.9")];
	const studioPages = [
		url("/studio", "0.8"),
		url("/design-system", "0.7"),
		...STUDIOS.map((studio) => url(studio.href, "0.8")),
	];

	const categoryPages = [
		...CATEGORIES.filter((c) => specs.some((s) => s.category === c)).map((c) =>
			categoryHref(c),
		),
		...Object.keys(COLLECTIONS).map((id) => `/${id}`),
	].map((path) => url(path, "0.7"));

	// Alpha/experimental components are noindexed; keep them out of the sitemap too.
	const componentPages = specs
		.filter((s) => s.status === "stable" || s.status === "beta")
		.map((s) => url(docsPath(s), "0.6"));

	const docPages = guides
		.getPages()
		.filter((page) => !page.data.draft)
		.map((page) => url(page.url, "0.5"));

	const body = [
		...staticPages,
		...studioPages,
		...categoryPages,
		...componentPages,
		...docPages,
	].join("");

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`,
		{ headers: { "content-type": "application/xml" } },
	);
};
