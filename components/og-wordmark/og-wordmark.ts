import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogWordmark as ogWordmarkVariants } from "./react/variants";

const MODES = ["light", "dark"];

export const ogWordmark = defineComponent({
	slug: "og-wordmark",
	name: "OG Wordmark",
	description:
		"A 1200x630 brand card with nothing but the logo and wordmark on a plain field.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogWordmarkVariants, ["mode"]),
	props: [
		{
			name: "name",
			type: "string",
			description: "Brand name, set as the wordmark; one line.",
			required: true,
			control: { kind: "text", placeholder: "Brand" },
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
			description: "One quiet line under the wordmark.",
			control: { kind: "text", placeholder: "Tagline" },
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
			"Fixed 1200x630 canvas built from flex layout and theme tokens, so takumi renders it the same as the browser.",
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
			entry: "OgWordmark",
		},
		svelte: {
			entry: "OgWordmark",
		},
	},
	keywords: [
		"og",
		"open graph",
		"social card",
		"brand",
		"logo",
		"wordmark",
		"takumi",
		"image",
	],
});
