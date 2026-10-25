import { FRAMEWORKS } from "@baby-ui/registry-schema";
import { error } from "@sveltejs/kit";
import { previewHtml } from "#lib/email-preview.js";
import { emailRender } from "#lib/server/emails.js";
import { findSpec, specs } from "#lib/server/registry.js";
import type { EntryGenerator, RequestHandler } from "./$types";

// The build-time render as a static page, so a listing card can frame it without loading its HTML.
export const prerender = true;

export const entries: EntryGenerator = () =>
	specs
		.filter((spec) => spec.category === "emails")
		.flatMap((spec) =>
			FRAMEWORKS.filter((f) => spec.impl[f]).map((framework) => ({
				category: spec.category,
				slug: spec.slug,
				framework,
			})),
		);

export const GET: RequestHandler = async ({ params }) => {
	const spec = findSpec(params.category, params.slug);
	const framework = FRAMEWORKS.find((f) => f === params.framework);
	const render = spec?.category === "emails" ? await emailRender(spec.slug) : null;
	const port = framework && render?.[framework];
	if (!port) throw error(404, `No ${params.framework} email named "${params.slug}"`);
	return new Response(previewHtml(port.html), {
		headers: { "content-type": "text/html; charset=utf-8" },
	});
};
