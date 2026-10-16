import { defaultProps } from "@baby-ui/registry-schema";
import { emailTailwindConfig } from "@baby-ui/svelte/lib/email-theme";
import { pixelBasedPreset, Renderer } from "@better-svelte-email/server";
import { error } from "@sveltejs/kit";
import { proEmailSample, proEmailTemplates } from "#lib/pro.js";
import { MAX_PROPS, safeUrls, sameOrigin } from "#lib/server/preview-guard.js";
import { findSpec } from "#lib/server/registry.js";
import {
	emailPlainText,
	type TemplateModule,
	templateLoader,
} from "#lib/server/templates.js";
import {
	previewProps,
	withSiteAssets,
} from "../../../../../../../packages/demos/src/data/preview-props";
import type { RequestHandler } from "./$types";

// Re-renders the Svelte port as controls change; the build-time render covers the defaults.
export const prerender = false;

const loader = templateLoader({
	...import.meta.glob<TemplateModule>(
		"../../../../../../../components/email-*/svelte/email-*.svelte",
	),
	...proEmailTemplates,
});

const renderer = new Renderer({
	tailwindConfig: { ...emailTailwindConfig, presets: [pixelBasedPreset] },
});

export const GET: RequestHandler = async ({ params, url, request }) => {
	if (!sameOrigin(request, url)) throw error(403, "Same-origin requests only");
	const raw = url.searchParams.get("props") ?? "{}";
	if (raw.length > MAX_PROPS) throw error(413, "props too large");
	const spec = findSpec("emails", params.slug);
	const load = spec && loader(params.slug);
	if (!spec || !load) throw error(404, `No email template named "${params.slug}"`);

	let given: Record<string, unknown> = {};
	try {
		given = safeUrls(JSON.parse(raw), url.origin) as Record<string, unknown>;
	} catch {
		throw error(400, "props must be JSON");
	}
	const props = withSiteAssets(
		previewProps(
			params.slug,
			{ ...defaultProps(spec), ...given },
			await proEmailSample(params.slug),
		),
		url.origin,
	);

	const { default: Template } = await load();
	let html: string;
	try {
		html = await renderer.render(Template, { props });
	} catch {
		throw error(400, `Invalid props for "${params.slug}"`);
	}
	return Response.json(
		{ html, text: emailPlainText(html), bytes: new TextEncoder().encode(html).length },
		// private: a shared cache would replay the result to requests that skipped the origin check.
		{ headers: { "cache-control": "private, max-age=3600" } },
	);
};
