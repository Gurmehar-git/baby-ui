import { defaultProps, type Framework } from "@baby-ui/registry-schema";
import { error } from "@sveltejs/kit";
import { highlight, langFor } from "#lib/highlight.js";
import { liveSpecs } from "#lib/server/registry.js";
import { CHART_KIND_LIST, CHART_KINDS } from "#lib/studio/chart.js";
import { usageSnippet } from "#lib/usage.js";
import type { PageServerLoad } from "./$types";

export const prerender = true;

type Paths = { kind: string; chart: string };

// The kind's module, then the shared chart parts, as the usage snippet imports them.
async function importPaths(slug: string, framework: Framework): Promise<Paths> {
	const code = (await usageSnippet(slug, framework))?.ts ?? "";
	const [kind = "", chart = ""] = [
		...code.matchAll(/^import[\s\S]*?from "([^"]+)";/gm),
	].map((m) => m[1] ?? "");
	return { kind, chart };
}

// A sample-data chart exports its documented usage, highlighted here so no highlighter ships.
async function usagePanel(slug: string, framework: Framework) {
	const snippet = await usageSnippet(slug, framework);
	if (!snippet) return null;
	const lang = langFor(snippet.path);
	return {
		id: framework,
		label: framework === "react" ? "React" : "Svelte",
		code: snippet.ts,
		html: await highlight(snippet.ts, lang),
		lang,
	};
}

const EDITABLE = new Set<string>(CHART_KIND_LIST.map((kind) => CHART_KINDS[kind].slug));

export const load: PageServerLoad = async () => {
	const kinds = await Promise.all(
		CHART_KIND_LIST.map(async (kind) => {
			const spec = liveSpecs.find((s) => s.slug === CHART_KINDS[kind].slug);
			if (!spec) throw error(500, `Missing spec for ${CHART_KINDS[kind].slug}`);
			const [react, svelte] = await Promise.all([
				importPaths(spec.slug, "react"),
				importPaths(spec.slug, "svelte"),
			]);
			return { kind, spec, defaults: defaultProps(spec), paths: { react, svelte } };
		}),
	);
	// Every other chart, the base parts aside: tuned on its demo's own data.
	const samples = await Promise.all(
		liveSpecs
			.filter(
				(s) => s.category === "charts" && s.slug !== "chart" && !EDITABLE.has(s.slug),
			)
			.map(async (spec) => ({
				spec,
				defaults: defaultProps(spec),
				panels: (
					await Promise.all([
						usagePanel(spec.slug, "react"),
						usagePanel(spec.slug, "svelte"),
					])
				).flatMap((panel) => (panel ? [panel] : [])),
			})),
	);
	return { kinds, samples };
};
