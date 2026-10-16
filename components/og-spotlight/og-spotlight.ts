import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogSpotlight as ogSpotlightVariants } from "./react/variants";

const MODES = ["light", "dark"];

export const ogSpotlight = defineComponent({
	slug: "og-spotlight",
	name: "OG Spotlight",
	description:
		"A 1200x630 card: a centred headline with the brand under it on a faint grid, ringed by portrait tiles.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogSpotlightVariants, ["mode"]),
	props: [
		{
			name: "title",
			type: "string",
			description: "Centred headline; clamps to two lines.",
			required: true,
			default: "Agents that live in the cloud",
			control: { kind: "text" },
		},
		{
			name: "images",
			type: "string[]",
			description: "Portrait URLs for the eight tiles; they repeat to fill.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "site",
			type: "string",
			description: "Product name under the headline, muted.",
			default: "Skydive",
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
		behaviour: ["Tiles hug the side edges so the headline keeps a clear 600px column."],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt, usually the headline.",
		],
	},
	impl: {
		react: {
			entry: "OgSpotlight",
		},
		svelte: {
			entry: "OgSpotlight",
		},
	},
	keywords: [
		"og",
		"open graph",
		"social card",
		"headline",
		"team",
		"portraits",
		"takumi",
		"image",
	],
});
