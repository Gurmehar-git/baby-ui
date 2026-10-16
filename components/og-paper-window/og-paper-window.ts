import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogPaperWindow as ogPaperWindowVariants } from "./react/variants";

const MODES = ["light", "dark"];

export const ogPaperWindow = defineComponent({
	slug: "og-paper-window",
	name: "OG Paper Window",
	description:
		"A 1200x630 card: a paper window with traffic lights, a wordmark and serif copy, lying over artwork and running off the bottom edge.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogPaperWindowVariants, ["mode"]),
	props: [
		{
			name: "name",
			type: "string",
			description: "Brand name set as the wordmark; one line.",
			required: true,
			default: "Notion",
			control: { kind: "text" },
		},
		{
			name: "title",
			type: "string",
			description: "Up to three lines in the serif (`--font-serif`).",
			required: true,
			default: "the AI notepad for back-to-back meetings",
			control: { kind: "text" },
		},
		{
			name: "image",
			type: "string",
			description: "Artwork URL behind the window; busy, colourful art works best.",
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
			name: "mode",
			type: MODES.map((v) => `"${v}"`).join(" | "),
			description: "Light or dark paper, independent of the page theme.",
			default: "light",
			control: { kind: "select", options: MODES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"The traffic lights use the destructive, warning and success tokens, so they follow the theme.",
			"The serif needs a font registered under the `--font-serif` family, or takumi falls back to sans.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag the name and title as og:image:alt.",
		],
	},
	impl: {
		react: {
			entry: "OgPaperWindow",
		},
		svelte: {
			entry: "OgPaperWindow",
		},
	},
	keywords: ["og", "open graph", "social card", "window", "paper", "serif", "takumi"],
});
