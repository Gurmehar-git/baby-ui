import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogCtaPill as ogCtaPillVariants } from "./react/variants";

const MODES = ["light", "dark"];
const TONES = ["chart", "primary", "success"];

export const ogCtaPill = defineComponent({
	slug: "og-cta-pill",
	name: "OG CTA Pill",
	description:
		"A 1200x630 card: one huge call-to-action pill on a grained colour field, lit by a warm glow rising from below.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogCtaPillVariants, ["mode", "tone"]),
	props: [
		{
			name: "label",
			type: "string",
			description: "The call to action inside the pill; one short line.",
			required: true,
			default: "Start building",
			control: { kind: "text" },
		},
		{
			name: "logo",
			type: "string",
			description: "Logo image URL above the pill; a white mark reads best on the field.",
			control: { kind: "none" },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description:
				"Field colour; the label ink and the glow are mixed from the same hue.",
			default: "chart",
			control: { kind: "select", options: TONES },
		},
		{
			name: "mode",
			type: MODES.map((v) => `"${v}"`).join(" | "),
			description:
				"Light keeps a cream pill with dark ink; dark turns the pill near black.",
			default: "light",
			control: { kind: "select", options: MODES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"A 7px dot screen gives the field its grain; the glow is one blurred disc below the pill.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag the label and brand as og:image:alt.",
		],
	},
	impl: {
		react: {
			entry: "OgCtaPill",
		},
		svelte: {
			entry: "OgCtaPill",
		},
	},
	keywords: ["og", "open graph", "social card", "cta", "button", "glow", "takumi"],
});
