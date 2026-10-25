import { type ComponentSpec, defaultProps, FRAMEWORKS } from "@baby-ui/registry-schema";
import { liveSpecs } from "#lib/server/registry.js";
import { usageSnippet } from "#lib/usage.js";
import type { PageServerLoad } from "./$types";

export const prerender = true;

// A background needing data the studio can't invent (an image `src`) stays on its own page.
const tunable = (spec: ComponentSpec) =>
	spec.category === "backgrounds" &&
	spec.impl.svelte !== undefined &&
	spec.props.every((prop) => !prop.required || prop.default !== undefined);

const has = (spec: ComponentSpec, name: string) =>
	spec.props.some((p) => p.name === name);

export const load: PageServerLoad = async () => {
	const backgrounds = await Promise.all(
		liveSpecs.filter(tunable).map(async (spec) => {
			const imports = Object.fromEntries(
				await Promise.all(
					FRAMEWORKS.map(async (framework) => {
						const snippet = await usageSnippet(spec.slug, framework);
						return [framework, snippet?.ts.match(/^import .*$/m)?.[0] ?? ""];
					}),
				),
			);
			const defaults = defaultProps(spec);
			return {
				spec,
				entry: spec.impl.svelte?.entry ?? "",
				defaults,
				positioned: has(spec, "position"),
				// Library thumbnails: the default look, filling their box, ignoring the pointer.
				thumb: {
					...defaults,
					...(has(spec, "position") ? { position: "absolute" } : {}),
					...(has(spec, "interactive") ? { interactive: false } : {}),
				},
				imports: { react: imports.react ?? "", svelte: imports.svelte ?? "" },
			};
		}),
	);
	return { backgrounds };
};
