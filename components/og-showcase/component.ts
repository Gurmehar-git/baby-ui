import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogShowcase as ogShowcaseVariants } from "./variants";

const MODES = ["light", "dark"];

export const ogShowcase = defineComponent({
	slug: "og-showcase",
	name: "OG Showcase",
	description:
		"A 1200x630 product card: a big headline bottom left, two offset columns of framed screenshots on the right.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogShowcaseVariants, ["mode"]),
	props: [
		{
			name: "title",
			type: "string",
			description: "Headline, bottom left; clamps to four lines.",
			required: true,
			default: "Never run out of design inspiration again.",
			control: { kind: "text" },
		},
		{
			name: "images",
			type: "string[]",
			description: "Screenshot URLs for the six frames; they repeat to fill.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "site",
			type: "string",
			description: "Product name beside the logo.",
			control: { kind: "text", placeholder: "Product" },
		},
		{
			name: "logo",
			type: "string",
			description: "Logo image URL, top left. PNG, SVG or WebP.",
			control: { kind: "none" },
		},
		{
			name: "description",
			type: "string",
			description: "Supporting line under the headline; clamps to two lines.",
			control: { kind: "text", placeholder: "Description" },
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
		behaviour: [
			"Frames bleed off the top and bottom edges so the columns read as a scroll.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt, usually the headline.",
		],
	},
	impl: {
		react: {
			entry: "OgShowcase",
		},
		svelte: {
			entry: "OgShowcase",
		},
	},
	keywords: [
		"og",
		"open graph",
		"social card",
		"product",
		"screenshots",
		"takumi",
		"image",
	],
});
