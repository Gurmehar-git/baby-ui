import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { caseStudyFlipStack as caseStudyFlipStackVariants } from "./variants";

const TONES = ["card", "inverse", "chart"];
const SIZES = ["sm", "md", "lg"];

export const caseStudyFlipStack = defineComponent({
	slug: "case-study-flip-stack",
	name: "Case Study Flip Stack",
	description:
		"A pile of case study cards; scrolling flips each one up and away to reveal the next.",
	category: "animated",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	variants: variantsOf(caseStudyFlipStackVariants, ["tone", "size"]),
	props: [
		{
			name: "image",
			type: "(props: ImageSlotProps) => ReactNode | Snippet<[ImageSlotProps]>",
			description:
				"Renders each image with `{ src, alt, width?, height?, className?, loading? }`, e.g. through your framework's image component. Defaults to `<img>`.",
			control: { kind: "none" },
		},
		{
			name: "items",
			type: "CaseStudyFlipItem[]",
			description:
				"`{ eyebrow, title, description, image, imageAlt, number? }`, one card each.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Card surface: card, inverted, or cycling chart colours.",
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
			name: "index",
			type: "number",
			description:
				"The card facing the reader; setting it scrolls there. Bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "defaultIndex",
			type: "number",
			description: "Starting card when uncontrolled (React).",
			default: 0,
			control: { kind: "none" },
		},
		{
			name: "onIndexChange",
			type: "(index: number) => void",
			description: "Called when scrolling brings another card to the front.",
			control: { kind: "none" },
		},
		{
			name: "hint",
			type: "string",
			description: "Shown between two bobbing arrows above the stack.",
			default: "Scroll down",
			control: { kind: "text" },
		},
		{
			name: "heading",
			type: "string",
			description: "Heading under the hint.",
			control: { kind: "text" },
		},
		{
			name: "endLabel",
			type: "string",
			description: "Closes the scroll once every card has flipped away.",
			control: { kind: "text" },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name of the scroll region.",
			default: "Case studies",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Cards stay flat and cross-fade in place as you scroll; the hint arrows stop bobbing.",
		behaviour: [
			"The component is its own scroll box; a CSS view() timeline on the stack drives one `--scroll-p` property, with a rAF-throttled scroll listener writing it where timelines are missing.",
			"The stack takes one box height of scroll per card. In its slice a card rises 118% and tilts 22deg back on X, while the card under it rises from its resting offset and scale to the front.",
			"Resting cards sit up to 34px lower and 3.5% smaller; the hint arrows bob 10px every 1.4s, the second 180ms behind.",
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
			"The scroll box is a focusable labelled region; the front card carries `data-active`.",
			"All card text stays in the DOM, so screen readers read every case study in order.",
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
			entry: "CaseStudyFlipStack",
		},
		svelte: {
			entry: "CaseStudyFlipStack",
		},
	},
	keywords: ["scroll", "cards", "stack", "flip", "case study", "portfolio"],
});
