import { guides } from "virtual:docvia/source";
import { error } from "@sveltejs/kit";
import { prepare } from "#lib/docs-nodes.js";
import { DOCS_MENU } from "#lib/registry.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug ? params.slug.split("/") : ["index"];
	const page = await guides.getPage(slug);
	if (!page || page.data.draft === true) throw error(404, "Page not found");
	const { content, headings } = await prepare(page);
	const path = slug[0] === "index" ? "/docs" : `/docs/${slug.join("/")}`;
	const index = DOCS_MENU.findIndex((item) => item.href === path);
	return {
		page: { ...page, content },
		headings,
		slug: slug.join("/"),
		adjacent: {
			prev: index > 0 ? DOCS_MENU[index - 1] : null,
			next: index >= 0 ? (DOCS_MENU[index + 1] ?? null) : null,
		},
	};
};
