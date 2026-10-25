import { defaultProps, FRAMEWORKS } from "@baby-ui/registry-schema";
import { liveSpecs } from "#lib/server/registry.js";
import { usageSnippet } from "#lib/usage.js";
import type { PageServerLoad } from "./$types";

export const prerender = true;

export const load: PageServerLoad = async () => {
	const templates = await Promise.all(
		liveSpecs
			.filter((spec) => spec.category === "og-images" && spec.impl.svelte !== undefined)
			.map(async (spec) => {
				const imports = Object.fromEntries(
					await Promise.all(
						FRAMEWORKS.map(async (framework) => {
							const snippet = await usageSnippet(spec.slug, framework);
							return [framework, snippet?.ts.match(/^import .*$/m)?.[0] ?? ""];
						}),
					),
				);
				return {
					spec,
					entry: spec.impl.svelte?.entry ?? "",
					defaults: defaultProps(spec),
					imports: { react: imports.react ?? "", svelte: imports.svelte ?? "" },
				};
			}),
	);
	templates.sort((a, b) => a.spec.name.localeCompare(b.spec.name));
	return { templates };
};
