import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogStatement as ogStatementVariants } from "./react/variants";

const MODES = ["light", "dark"];

export const ogStatement = defineComponent({
	slug: "og-statement",
	name: "OG Statement",
	description:
		"A 1200x630 card: a mark top left and one large statement bottom left on a quiet field.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogStatementVariants, ["mode"]),
	props: [
		{
			name: "title",
			type: "string",
			description: "The statement, up to three lines, set bottom left.",
			required: true,
			default: "Inspect and give feedback on any live interface",
			control: { kind: "text" },
		},
		{
			name: "logo",
			type: "string",
			description: "Mark image URL, top left. PNG, SVG or WebP.",
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
		behaviour: [
			"Mark and statement pin to opposite corners with flex, so short copy never floats mid-card.",
		],
	},
	a11y: {
		keyboard: [],
		notes: ["Rendered to an image: give the meta tag the statement as og:image:alt."],
	},
	impl: {
		react: {
			entry: "OgStatement",
		},
		svelte: {
			entry: "OgStatement",
		},
	},
	keywords: ["og", "open graph", "social card", "statement", "headline", "takumi"],
});
