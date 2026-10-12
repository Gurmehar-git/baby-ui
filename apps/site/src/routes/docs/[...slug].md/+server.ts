import { guides } from "virtual:docvia/source";
import { error } from "@sveltejs/kit";
import { guideMarkdown } from "#lib/markdown.js";
import type { EntryGenerator, RequestHandler } from "./$types";

export const prerender = true;
export const entries: EntryGenerator = () =>
	["index", "installation", "theming", "mcp"].map((slug) => ({ slug }));

export const GET: RequestHandler = async ({ params }) => {
	const slug = params.slug || "index";
	const page = await guides.getPage(slug.split("/"));
	if (!page || page.data.draft === true) throw error(404);
	return new Response(guideMarkdown(slug, page.data.title, page.data.description), {
		headers: { "content-type": "text/markdown; charset=utf-8" },
	});
};
