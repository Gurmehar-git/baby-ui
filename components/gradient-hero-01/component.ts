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
	variants: variantsOf(gradientHero01Variants, ["tone", "size"]),
	props: [
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"GradientHero01: GradientHero01Content (GradientHero01Badge, GradientHero01Title, GradientHero01Description, GradientHero01Actions, GradientHero01Install, GradientHero01Meta), then an optional GradientHero01Media that switches to a split layout.",
			control: { kind: "none" },
		},
		{
			name: "command",
			type: "string",
			description: "GradientHero01Install: the command in the pill, with a copy button.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "href",
			type: "string",
			description:
				'GradientHero01Action: renders a link, otherwise a button with onClick. `variant="outline"` for secondary actions.',
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
