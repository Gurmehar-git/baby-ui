import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogTagline as ogTaglineVariants } from "./react/variants";

const MODES = ["light", "dark"];
const TONES = ["success", "primary", "info", "warning"];

export const ogTagline = defineComponent({
	slug: "og-tagline",
	name: "OG Tagline",
	description:
		"A 1200x630 card: the brand over a centred two-line headline, the second line in an accent colour.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogTaglineVariants, ["mode", "tone"]),
	props: [
		{
			name: "name",
			type: "string",
			description: "Brand name beside the logo; one line.",
			required: true,
			default: "supabase",
			control: { kind: "text" },
		},
		{
			name: "title",
			type: "string",
			description: "First headline line.",
			required: true,
			default: "Build in a weekend",
			control: { kind: "text" },
		},
		{
			name: "accent",
			type: "string",
			description: "Second headline line, set in the tone colour.",
			required: true,
			default: "Scale to millions",
			control: { kind: "text" },
		},
		{
			name: "logo",
			type: "string",
			description: "Logo image URL beside the name. PNG, SVG or WebP.",
			control: { kind: "none" },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Colour of the second line.",
			default: "success",
			control: { kind: "select", options: TONES },
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
		behaviour: ["Each headline line clamps to one line, so the stack stays centred."],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag both headline lines as og:image:alt.",
		],
	},
	impl: {
		react: {
			entry: "OgTagline",
		},
		svelte: {
			entry: "OgTagline",
		},
	},
	keywords: ["og", "open graph", "social card", "brand", "tagline", "headline", "takumi"],
});
