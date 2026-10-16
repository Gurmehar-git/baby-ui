import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogHalo as ogHaloVariants } from "./react/variants";

const MODES = ["light", "dark"];
const TONES = ["neutral", "primary", "chart"];

export const ogHalo = defineComponent({
	slug: "og-halo",
	name: "OG Halo",
	description: "A 1200x630 card: one mark centred in a soft halo of light, nothing else.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogHaloVariants, ["mode", "tone"]),
	props: [
		{
			name: "logo",
			type: "string",
			description:
				"Mark image URL, centred over the halo; a dark mark on the dark card reads as a silhouette.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Colour of the halo behind the mark.",
			default: "neutral",
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
		behaviour: ["The halo is one blurred disc behind the mark at 70% opacity."],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image with no text: give the meta tag the brand name as og:image:alt.",
		],
	},
	impl: {
		react: {
			entry: "OgHalo",
		},
		svelte: {
			entry: "OgHalo",
		},
	},
	keywords: ["og", "open graph", "social card", "logo", "glow", "halo", "takumi"],
});
