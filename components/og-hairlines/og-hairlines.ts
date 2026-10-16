import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogHairlines as ogHairlinesVariants } from "./react/variants";

const MODES = ["light", "dark"];

export const ogHairlines = defineComponent({
	slug: "og-hairlines",
	name: "OG Hairlines",
	description:
		"A 1200x630 card: centred brand, title and description inside hairline guides that cross at the corners.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogHairlinesVariants, ["mode"]),
	props: [
		{
			name: "name",
			type: "string",
			description: "Brand name above the title; one line.",
			required: true,
			default: "Next.js",
			control: { kind: "text" },
		},
		{
			name: "title",
			type: "string",
			description: "Up to two lines, centred.",
			required: true,
			default: "Modern Next.js Templates",
			control: { kind: "text" },
		},
		{
			name: "description",
			type: "string",
			description: "Up to two quiet lines under the title.",
			default: "Built with React, TypeScript, shadcn/ui, Tailwind CSS and Motion.",
			control: { kind: "text" },
		},
		{
			name: "logo",
			type: "string",
			description: "Logo image URL beside the name. PNG, SVG or WebP.",
			control: { kind: "none" },
		},
		{
			name: "mode",
			type: MODES.map((v) => `"${v}"`).join(" | "),
			description: "Light or dark card, independent of the page theme.",
			default: "light",
			control: { kind: "select", options: MODES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: ["Four 1px guides sit 64px in from each edge and run the full canvas."],
	},
	a11y: {
		keyboard: [],
		notes: ["Rendered to an image: give the meta tag the title as og:image:alt."],
	},
	impl: {
		react: {
			entry: "OgHairlines",
		},
		svelte: {
			entry: "OgHairlines",
		},
	},
	keywords: ["og", "open graph", "social card", "brand", "grid", "hairline", "takumi"],
});
