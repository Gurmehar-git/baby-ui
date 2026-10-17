import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogSplit as ogSplitVariants } from "./variants";

const MODES = ["light", "dark"];

export const ogSplit = defineComponent({
	slug: "og-split",
	name: "OG Split",
	description:
		"A 1200x630 brand card: logo and wordmark on the left, an image panel with a curved edge on the right.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogSplitVariants, ["mode"]),
	props: [
		{
			name: "name",
			type: "string",
			description: "Brand name, set as the wordmark; one line.",
			required: true,
			default: "Melius",
			control: { kind: "text" },
		},
		{
			name: "image",
			type: "string",
			description: "Image URL for the curved panel.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "logo",
			type: "string",
			description: "Logo image URL beside the name. PNG, SVG or WebP.",
			control: { kind: "none" },
		},
		{
			name: "tagline",
			type: "string",
			description: "Up to two lines under the wordmark.",
			control: { kind: "text", placeholder: "Tagline" },
		},
		{
			name: "mode",
			type: MODES.map((v) => `"${v}"`).join(" | "),
			description: "Light or dark card, independent of the page theme.",
			default: "dark",
			control: { kind: "select", options: MODES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"The curve is a 315px radius on the panel's left corners, half the canvas height.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt, usually the brand name.",
		],
	},
	impl: {
		react: {
			entry: "OgSplit",
		},
		svelte: {
			entry: "OgSplit",
		},
	},
	keywords: ["og", "open graph", "social card", "brand", "split", "image", "takumi"],
});
