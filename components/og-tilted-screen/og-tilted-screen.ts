import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogTiltedScreen as ogTiltedScreenVariants } from "./react/variants";

const MODES = ["light", "dark"];
const TONES = ["neutral", "chart", "primary"];

export const ogTiltedScreen = defineComponent({
	slug: "og-tilted-screen",
	name: "OG Tilted Screen",
	description:
		"A 1200x630 product card: headline on the left, one screenshot tilted off the right edge over a soft tone glow.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogTiltedScreenVariants, ["mode", "tone"]),
	props: [
		{
			name: "title",
			type: "string",
			description: "Headline; clamps to three lines.",
			required: true,
			default: "The design platform for web shaders",
			control: { kind: "text" },
		},
		{
			name: "image",
			type: "string",
			description:
				"Screenshot URL; anchored top left, so keep the interesting part there.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "site",
			type: "string",
			description: "Product name beside the logo.",
			default: "shaders",
			control: { kind: "text" },
		},
		{
			name: "logo",
			type: "string",
			description: "Logo image URL, top left. PNG, SVG or WebP.",
			control: { kind: "none" },
		},
		{
			name: "description",
			type: "string",
			description: "Supporting line under the headline; clamps to two lines.",
			default:
				"Ship creative frontend effects with a component library and a design editor.",
			control: { kind: "text" },
		},
		{
			name: "mode",
			type: MODES.map((v) => `"${v}"`).join(" | "),
			description: "Light or dark card, independent of the page theme.",
			default: "dark",
			control: { kind: "select", options: MODES },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Colour of the glow behind the screenshot.",
			default: "primary",
			control: { kind: "select", options: TONES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"Depth is faked with a 2D rotate and skew; the renderer has no 3D transforms.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt, usually the headline.",
		],
	},
	impl: {
		react: {
			entry: "OgTiltedScreen",
		},
		svelte: {
			entry: "OgTiltedScreen",
		},
	},
	keywords: [
		"og",
		"open graph",
		"social card",
		"product",
		"screenshot",
		"takumi",
		"image",
	],
});
