import { FRAMEWORKS, type Framework } from "@baby-ui/registry-schema";
import { error } from "@sveltejs/kit";
import { installSource } from "#lib/install-source.server.js";
import { findSpec, specs } from "#lib/server/registry.js";
import type { EntryGenerator, RequestHandler } from "./$types";

export const prerender = true;

// Every port of every free component, charts included: the page fetches these, nothing links them.
// Pro source is never generated into the public site; it ships from the private registry.
export const entries: EntryGenerator = () =>
	specs
		.filter((spec) => spec.tier !== "pro")
		.flatMap((spec) =>
			FRAMEWORKS.filter((f) => spec.impl[f]).map((framework) => ({
				category: spec.category,
				slug: spec.slug,
				framework,
			})),
		);

export const GET: RequestHandler = async ({ params }) => {
	const spec = findSpec(params.category, params.slug);
	const framework = params.framework as Framework;
	if (!spec?.impl[framework] || spec.tier === "pro") throw error(404);
	return Response.json(await installSource(spec.slug, framework));
};
