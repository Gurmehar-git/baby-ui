import { defineComponent } from "../index.ts";

const SIZES = ["sm", "md", "lg"];

export const typingText = defineComponent({
	slug: "typing-text",
	name: "Typing Text",
	description:
		"A classic typewriter reveal, with a blinking cursor and optional erase-and-repeat.",
	category: "text",
	status: "stable",
	variants: { size: SIZES },
	props: [
		{
			name: "text",
			type: "string",
			description: "Text to type.",
			control: { kind: "text" },
			default: "Creates a typing effect for given text",
		},
		{
			name: "delay",
			type: "number",
			description: "Delay between typing each character (or word, in `smooth` mode).",
			default: 32,
			control: { kind: "number", min: 8, max: 200, step: 8 },
		},
		{
			name: "repeat",
			type: "boolean",
			description: "Erase after typing, then type again.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "waitMs",
			type: "number",
			description:
				"Time to hold before the next cycle. Only applies when `repeat` is true.",
			default: 1000,
			control: { kind: "number", min: 0, max: 4000, step: 100 },
			showWhen: { repeat: [true] },
		},
		{
			name: "smooth",
			type: "boolean",
			description: "Fades whole words in instead of typing character by character.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "fadeDurationMs",
			type: "number",
			description:
				"How long each word's fade-in takes, in ms. Only applies when `smooth` is true.",
			default: 300,
			control: { kind: "number", min: 50, max: 1000, step: 50 },
			showWhen: { smooth: [true] },
		},
		{
			name: "grow",
			type: "boolean",
			description:
				"Grow the container to fit the text as it types, instead of reserving full width up front.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "hideCursorOnComplete",
			type: "boolean",
			description: "Hide the blinking cursor once typing completes.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "stumbles",
			type: "boolean",
			description:
				"Types like a person: wrong keys appear and get corrected on the way. The same string always stumbles the same way; `delay` scales the pace.",
			default: false,
			control: { kind: "boolean" },
			showWhen: { smooth: [false] },
		},
		{
			name: "onComplete",
			type: "() => void",
			description: "Fired once, when typing finishes and `repeat` is false.",
			control: { kind: "none" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Type scale.",
			default: "md",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Still types on the same interval; the cursor blink is the only pure decoration and keeps blinking (it carries information about typing state).",
		behaviour: [
			"Characters (or words, in `smooth` mode) appear on a fixed interval. With `repeat`, the text erases backward on the same interval after a hold, then types forward again.",
		],
	},
	a11y: {
		notes: [
			"The text updates live in the DOM as it types; treat as decorative copy for headings/labels, not content a screen reader user needs to read mid-cycle.",
		],
	},

	impl: {
		react: {
			entry: "TypingText",
			files: [
				{ path: "typing-text/typing-text.tsx", type: "registry:ui" },
				{ path: "typing-text/stumble.ts", type: "registry:ui" },
				{ path: "typing-text/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "TypingText",
			files: [
				{ path: "typing-text/typing-text.svelte", type: "registry:ui" },
				{ path: "typing-text/stumble.ts", type: "registry:ui" },
				{ path: "typing-text/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["text", "typing", "typewriter", "cursor"],
});
