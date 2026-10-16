import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["roll", "odometer", "count"];
const DIRECTIONS = ["dynamic", "up", "down"];
const SIZES = ["inherit", "sm", "md", "lg"];

export const rollingDigits = defineComponent({
	slug: "rolling-digits",
	name: "Rolling Digits",
	description:
		"An animated number: changed digits spring in and out, digit strips turn like an odometer, or the value counts up.",
	category: "text",
	status: "stable",
	variants: { variant: VARIANTS, direction: DIRECTIONS, size: SIZES },
	props: [
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`roll` springs each changed digit in and out; `odometer` slides each digit's 0 to 9 strip to its row; `count` tweens the whole number.",
			default: "roll",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "durationMs",
			type: "number",
			description:
				"How long one change takes, in ms: 500 for `odometer`, 1200 for `count`.",
			control: { kind: "number", min: 100, max: 3000, step: 100 },
			showWhen: { variant: ["odometer", "count"] },
		},
		{
			name: "value",
			type: "number",
			description: "The number to show, rounded to an integer.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "pad",
			type: "number",
			description: "Minimum digit count, zero-padded.",
			control: { kind: "number", min: 0, max: 8, step: 1 },
		},
		{
			name: "locale",
			type: "true | string | Intl.NumberFormatOptions",
			description:
				"Grouping and format: true for the runtime locale, a tag, or Intl options.",
			control: { kind: "select", options: ["en-US", "de-DE", "fr-FR", "hi-IN"] },
		},
		{
			name: "format",
			type: "(value: number) => string",
			description: "Custom formatter; wins over locale.",
			control: { kind: "none" },
		},
		{
			name: "startOnView",
			type: "boolean",
			description:
				"Roll up from 0 the first time it scrolls into view. The server always renders the real value.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "stepMs",
			type: "number",
			description: "Gap between queued steps when the value changes faster than a roll.",
			default: 80,
			control: { kind: "number", min: 0, max: 400, step: 20 },
			showWhen: { variant: ["roll"] },
		},
		{
			name: "coalesce",
			type: "boolean",
			description: "Jump to the latest value instead of stepping through each update.",
			default: false,
			control: { kind: "boolean" },
			showWhen: { variant: ["roll"] },
		},
		{
			name: "direction",
			type: DIRECTIONS.map((v) => `"${v}"`).join(" | "),
			description: "Roll by whether a digit grew or shrank, or always one way.",
			default: "dynamic",
			control: { kind: "select", options: DIRECTIONS },
			showWhen: { variant: ["roll"] },
		},
		{
			name: "offset",
			type: "number",
			description: "Travel of a rolling digit, in px.",
			default: 32,
			control: { kind: "number", min: 8, max: 64, step: 4 },
			showWhen: { variant: ["roll"] },
		},
		{
			name: "onAnimationComplete",
			type: "() => void",
			description: "Fired when the display catches up with the value.",
			control: { kind: "none" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Type scale; inherit takes the surrounding text size.",
			default: "inherit",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Digits crossfade in place; columns fade instead of opening.",
		behaviour: [
			"A changed digit rises in from 32px at 0.84 scale on a sampled 170/10 spring, overshooting about 27%, over 1239ms.",
			"The old digit leaves the other way on a sampled 170/15 spring over 822ms.",
			"A gained or lost digit opens or closes its column over --duration-overlay, so the number never jumps width.",
		],
	},
	a11y: {
		notes: [
			"A polite live region carries the formatted value; the rolling glyphs are hidden.",
		],
	},
	licenseOrigin: {
		source: "iconiq",
		url: "https://iconiqui.com",
		license: "MIT",
		copyright: "Copyright (c) 2024-2026 Edwin Vakayil",
	},
	impl: {
		react: {
			entry: "RollingDigits",
			files: [
				{ path: "rolling-digits/rolling-digits.tsx", type: "registry:ui" },
				{ path: "rolling-digits/format.ts", type: "registry:ui" },
				{ path: "rolling-digits/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "RollingDigits",
			files: [
				{ path: "rolling-digits/rolling-digits.svelte", type: "registry:ui" },
				{ path: "rolling-digits/rolling-digit.svelte", type: "registry:ui" },
				{ path: "rolling-digits/format.ts", type: "registry:ui" },
				{ path: "rolling-digits/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["number", "digits", "counter", "odometer", "spring", "text"],
});
