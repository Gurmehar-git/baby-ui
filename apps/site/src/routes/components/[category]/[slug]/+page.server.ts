import { components, pro } from "virtual:docvia/source";
import type { Framework } from "@baby-ui/registry-schema";
import { FRAMEWORKS, TOP_LEVEL_CATEGORIES } from "@baby-ui/registry-schema";
import { error } from "@sveltejs/kit";
import { prepare } from "#lib/docs-nodes.js";
import { highlight, langFor } from "#lib/highlight.js";
import { specHref } from "#lib/registry.js";
import { componentCss, cssNames } from "#lib/registry-items.js";
import { emailRender } from "#lib/server/emails.js";
import { adjacentComponents, cardItems, findSpec, specs } from "#lib/server/registry.js";
import { usageSnippet } from "#lib/usage.js";
import type { EntryGenerator, PageServerLoad } from "./$types";

// Listed rather than crawled, so a component nothing links to still gets built. Charts are
// crawled from /charts, which the reroute hook serves at their public URL.
export const entries: EntryGenerator = () =>
	specs
		.filter((spec) => !TOP_LEVEL_CATEGORIES.includes(spec.category))
		.map((spec) => ({ category: spec.category, slug: spec.slug }));

export const load: PageServerLoad = async ({ params }) => {
	const spec = findSpec(params.category, params.slug);
	if (!spec) throw error(404, `No ${params.category} component named "${params.slug}"`);

	// Pro prose is an optional collection: empty unless the Pro submodule is checked out.
	const doc = await (spec.tier === "pro" ? pro : components).getPage([params.slug]);

	const ports = await Promise.all(
		FRAMEWORKS.filter((f) => spec.impl[f]).map(async (framework: Framework) => {
			const snippet = await usageSnippet(spec.slug, framework);
			const usage = snippet
				? {
						path: snippet.path,
						ts: {
							code: snippet.ts,
							lang: langFor(snippet.path),
							html: await highlight(snippet.ts, langFor(snippet.path)),
						},
						js: snippet.js
							? {
									code: snippet.js,
									lang: langFor(snippet.path) === "tsx" ? "jsx" : langFor(snippet.path),
									html: await highlight(
										snippet.js,
										langFor(snippet.path) === "tsx" ? "jsx" : langFor(snippet.path),
									),
								}
							: null,
					}
				: null;
			const dependencies = spec.impl[framework]?.dependencies ?? [];
			const css = await componentCss(spec.slug, framework);
			return {
				framework,
				usage,
				dependencies,
				css: css ? cssNames(css) : [],
			};
		}),
	);

	const email = spec.category === "emails" ? await emailRender(spec.slug) : null;

	const prose = doc ? await prepare(doc) : null;
	// "Use X instead" picks lead the related list, then the rest of the category.
	const instead = spec.guidance.whenNot.flatMap((w) => (w.use ? [w.use] : []));
	const related = [
		...new Set([
			...instead,
			...specs
				.filter((s) => s.category === spec.category && s.slug !== spec.slug)
				.map((s) => s.slug),
		]),
	].slice(0, 6);
	const alternatives = Object.fromEntries(
		specs
			.filter((s) => instead.includes(s.slug))
			.map((s) => [s.slug, { name: s.name, href: specHref(s) }]),
	);
	return {
		spec,
		alternatives,
		related: cardItems(related),
		adjacent: adjacentComponents(spec.category, spec.slug),
		ports,
		email: email && { slug: email.slug, react: email.react, svelte: email.svelte },
		prose: prose?.content ?? null,
		proseHeadings: prose?.headings ?? [],
	};
};
