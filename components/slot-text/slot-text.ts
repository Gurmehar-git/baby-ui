import { defineComponent } from "@baby-ui/registry-schema";

const SIZES = ["inherit", "sm", "default", "lg"];
const VARIANTS = ["default", "mono"];

const files = (main: string) => [
	{ path: `slot-text/${main}`, type: "registry:ui" as const },
	{ path: "slot-text/slot.ts", type: "registry:ui" as const },
	{ path: "slot-text/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

export const slotText = defineComponent({
	slug: "slot-text",
	name: "Slot Text",
	description:
		"Text and numbers that spin into their new value like slot machine reels: digits count the way the number moved, letters shuffle, and reels land left to right.",
	category: "text",
	status: "stable",
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "value",
			type: "string | number",
			description: "The value to show; numbers pass through `format`.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "format",
			type: "(value: number) => string",
			description: "Formats a number; en-US grouping by default, so 12480 reads 12,480.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "The surrounding font, or monospace for codes and tickers.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Inherit the text size, or a display step.",
			default: "inherit",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "duration",
			type: "number",
			description: "Seconds the first reel spins; later reels add `stagger`.",
			default: 0.9,
			control: { kind: "number", min: 0.3, max: 2, step: 0.1 },
		},
		{
			name: "stagger",
			type: "number",
			description: "Seconds between reels stopping, left to right.",
			default: 0.07,
			control: { kind: "none" },
		},
		{
			name: "spins",
			type: "number",
			description:
				"Extra full turns a digit makes before it lands; 0 rolls straight there.",
			default: 1,
			control: { kind: "number", min: 0, max: 3, step: 1 },
		},
		{
			name: "align",
			type: '"start" | "end"',
			description:
				"Which end reels match from when the length changes; numbers default to the end.",
			control: { kind: "none" },
		},
		{
			name: "announce",
			type: "boolean",
			description: "Announce new values politely to screen readers.",
			default: false,
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Values swap in place without spinning.",
		behaviour: [
			"Each character is a reel; digits count through the wheel in the direction the number moved and letters shuffle through the alphabet.",
			"Reels stop one after another from left to right with a soft landing that never overshoots, blurred while fast.",
			"A change mid-spin restarts from the cell on screen; new characters grow in and removed ones fold away.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The reels are aria-hidden; the real value sits in a visually hidden span, live when `announce` is set.",
		],
	},
	guidance: {
		when: ["Prices, stats, counters and launch moments where a change deserves a beat."],
		whenNot: [
			{ text: "Numbers that tick often, such as a live counter.", use: "rolling-digits" },
			{ text: "A board of rows and columns.", use: "split-flap-display" },
		],
		responsive: [
			"Inherits the font size; reels size to their glyphs, so it wraps like text.",
		],
		performance: [
			"Each change builds short strips and animates them with CSS; nothing runs at rest.",
		],
		ai: [
			"Pass the number itself and a `format` for currency or units, so digits keep their reels as it grows.",
			"Keep `spins` at 0 or 1 for frequent updates; save larger values for one-off reveals.",
		],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "SlotText",
			files: files("slot-text.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "SlotText",
			files: files("slot-text.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["slot", "reel", "number", "counter", "price", "text animation"],
});
