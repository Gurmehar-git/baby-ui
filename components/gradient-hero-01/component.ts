import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { gradientHero01 as gradientHero01Variants } from "./variants";

const TONES = ["chart", "spectrum", "primary"];
const SIZES = ["screen", "section"];

export const gradientHero01 = defineComponent({
	slug: "gradient-hero-01",
	name: "Gradient Hero 01",
	description:
		"A centred hero with a pill, headline, copy and actions over a soft glow rising from the bottom edge.",
	category: "blocks",
	status: "stable",
	retired: true,
	demo: { mode: "auto", frame: "none" },
	variants: variantsOf(gradientHero01Variants, ["tone", "size"]),
	props: [
		{
			name: "headline",
			type: "string",
			description: "The h1.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "description",
			type: "string",
			description: "Copy under the headline.",
			control: { kind: "none" },
		},
		{
			name: "badge",
			type: "string",
			description: "Pill above the headline.",
			control: { kind: "none" },
		},
		{
			name: "actions",
			type: "GradientHero01Action[]",
			description:
				"Buttons (label with href or onClick); the first is primary, the rest outlined. Actions with neither are skipped.",
			control: { kind: "none" },
		},
		{
			name: "install",
			type: "string",
			description: "An install command in a pill with a copy button.",
			control: { kind: "text" },
		},
		{
			name: "meta",
			type: "string[]",
			description: "Small facts under the actions, such as the version and licence.",
			control: { kind: "none" },
		},
		{
			name: "media",
			type: "ReactNode | Snippet",
			description: "A visual beside the copy; the hero switches to a split layout.",
			control: { kind: "none" },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description:
				"Glow colours: chart colour 1, chart colours 1 to 3, or the primary colour.",
			default: "chart",
			control: { kind: "select", options: TONES },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "At least the viewport's height, or padded to its content.",
			default: "screen",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Nothing animates apart from the buttons' own press feedback.",
		behaviour: ["Static: the glow is layered gradients from theme tokens, no animation."],
	},
	a11y: {
		keyboard: [],
		notes: ["Gradient layers are aria-hidden; the headline is the page's h1."],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "GradientHero01",
		},
		svelte: {
			entry: "GradientHero01",
		},
	},
	keywords: ["hero", "landing", "gradient", "glow", "headline", "cta"],
});
