import { defineComponent } from "../index.ts";

const VARIANTS = ["sweep", "double", "draw", "bar"];
const TONES = ["default", "primary", "accent"];
const TRIGGERS = ["hover", "always"];

export const underlineHoverText = defineComponent({
	slug: "underline-hover-text",
	name: "Underline Hover Text",
	description:
		"Inline text with a hover underline in four strokes: a centre sweep, a lifting double hairline, a drawn hairline, or a sliding bar.",
	category: "text",
	status: "stable",
	variants: { variant: VARIANTS, tone: TONES, trigger: TRIGGERS },
	props: [
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"The text to underline; it stays inline, so it sits inside a sentence.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`sweep` grows a stroke from the centre over a faint baseline and lifts the text; `double` lifts a second hairline above the first; `draw` grows a hairline from the start; `bar` slides a thick bar in from the start and out past the end.",
			default: "sweep",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Text and stroke colour.",
			default: "default",
			control: { kind: "select", options: TONES },
		},
		{
			name: "trigger",
			type: TRIGGERS.map((v) => `"${v}"`).join(" | "),
			description:
				"`hover` draws the stroke on hover and keyboard focus; `always` keeps it drawn.",
			default: "hover",
			control: { kind: "select", options: TRIGGERS },
		},
		{
			name: "durationMs",
			type: "number",
			description: "How long the stroke takes, in ms.",
			default: 500,
			control: { kind: "number", min: 100, max: 1500, step: 50 },
		},
		{
			name: "as",
			type: "string",
			description: "Element to render, e.g. `a` for a link.",
			default: "span",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The stroke still appears on hover; only its easing travel is shortened.",
		behaviour: [
			"Every stroke answers keyboard focus as well as hover.",
			"`bar` flips its transform origin with the hover, so it grows in from the start and shrinks off the end in pure CSS.",
		],
	},
	a11y: {
		notes: ["The strokes are `aria-hidden`; the children carry the real text."],
	},
	impl: {
		react: {
			entry: "UnderlineHoverText",
			files: [
				{ path: "underline-hover-text/underline-hover-text.tsx", type: "registry:ui" },
				{ path: "underline-hover-text/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "UnderlineHoverText",
			files: [
				{ path: "underline-hover-text/underline-hover-text.svelte", type: "registry:ui" },
				{ path: "underline-hover-text/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["text", "underline", "hover", "link", "double underline", "border", "metis"],
});
