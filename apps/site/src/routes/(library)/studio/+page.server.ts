import { defaultProps } from "@baby-ui/registry-schema";
import { liveSpecs } from "#lib/server/registry.js";
import { STUDIOS } from "#lib/studio/studios.js";
import type { PageServerLoad } from "./$types";

export const prerender = true;

export const load: PageServerLoad = () => ({
	studios: STUDIOS.map(({ slug, name, description, href, preview }) => {
		const spec = liveSpecs.find((s) => s.slug === preview.slug);
		const has = (prop: string) => spec?.props.some((p) => p.name === prop) ?? false;
		return {
			slug,
			name,
			description,
			href,
			preview,
			entry: spec?.impl.svelte?.entry ?? "",
			// A component preview: default look, filling the card, ignoring the pointer.
			thumb: {
				...(spec ? defaultProps(spec) : {}),
				...(has("position") ? { position: "absolute" } : {}),
				...(has("interactive") ? { interactive: false } : {}),
			},
		};
	}),
});
