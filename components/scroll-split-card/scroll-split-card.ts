import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { scrollSplitCard as scrollSplitCardVariants } from "./react/variants";

const TONES = ["card", "inverse", "chart"];
const SIZES = ["sm", "md", "lg"];

export const scrollSplitCard = defineComponent({
	slug: "scroll-split-card",
	name: "Scroll Split Card",
	description:
		"One image splits into three panels that separate, then flip over to reveal cards as you scroll.",
	category: "animated",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	variants: variantsOf(scrollSplitCardVariants, ["tone", "size"]),
	props: [
		{
			name: "image",
			type: "string",
			description: "The image split across the three panels' front faces.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "imageAlt",
			type: "string",
			description: "Alt text for the image.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "cards",
			type: "ScrollSplitCardItem[]",
			description: "`{ title, description }`; the first three become the back faces.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Back face surface: card, inverted, or one chart colour per panel.",
			default: "card",
			control: { kind: "select", options: TONES },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Height of the scroll box.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "hint",
			type: "string",
			description: "Shown until scrolling starts.",
			default: "Scroll down",
			control: { kind: "text" },
		},
		{
			name: "endLabel",
			type: "string",
			description: "Fades in once the panels have flipped.",
			control: { kind: "text" },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name of the scroll region.",
			default: "Scroll to flip the cards",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The three cards show face up in a row; nothing moves and the box does not scroll.",
		behaviour: [
			"The component is its own scroll box; a CSS view() timeline on the track drives one `--scroll-p` property, with a rAF-throttled scroll listener writing it where timelines are missing.",
			"0 to 40%: panels round their inner corners, part and scale to 90%. 40 to 80%: they flip 180deg and tilt 6deg outward while closing up. 80 to 100%: the row rises and `endLabel` fades in.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Arrow keys", "Page Up", "Page Down", "Home", "End"],
				action: "Scrolls the focused box",
			},
		],
		notes: [
			"The scroll box is a focusable labelled region.",
			"Card text is always in the DOM; only the first panel's image carries the alt text.",
		],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "ScrollSplitCard",
		},
		svelte: {
			entry: "ScrollSplitCard",
		},
	},
	keywords: ["scroll", "flip", "split", "cards", "3d"],
});
