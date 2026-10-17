import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { diaText as diaTextVariants } from "./variants";

const SIZES = ["inherit", "sm", "md", "lg"];

export const diaText = defineComponent({
	slug: "dia-text",
	name: "Dia Text",
	description:
		"A band of colour sweeps across and leaves the text behind it, like the Dia browser.",
	category: "text",
	status: "stable",
	variants: variantsOf(diaTextVariants, ["size"]),
	props: [
		{
			name: "text",
			type: "string | string[]",
			description: "One string, or several to cycle through when repeat is on.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "colors",
			type: "string[]",
			description: "Band colours, left to right. Defaults to chart tokens 5, 2, 4 and 1.",
			control: { kind: "none" },
		},
		{
			name: "textColor",
			type: "string",
			description: "Colour the text settles to behind the band.",
			default: "var(--foreground)",
			control: { kind: "none" },
		},
		{
			name: "index",
			type: "number",
			description: "Controlled: which string is showing.",
			control: { kind: "none" },
		},
		{
			name: "defaultIndex",
			type: "number",
			description: "Uncontrolled starting index.",
			default: 0,
			control: { kind: "none" },
		},
		{
			name: "onIndexChange",
			type: "(index: number) => void",
			description: "Fired when a repeat moves to the next string.",
			control: { kind: "none" },
		},
		{
			name: "durationMs",
			type: "number",
			description: "One sweep.",
			default: 1500,
			control: { kind: "number", min: 500, max: 4000, step: 100 },
		},
		{
			name: "delayMs",
			type: "number",
			description: "Wait before each sweep.",
			default: 0,
			control: { kind: "number", min: 0, max: 2000, step: 100 },
		},
		{
			name: "repeat",
			type: "boolean",
			description: "Sweep again after each pass, moving to the next string.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "repeatDelayMs",
			type: "number",
			description: "Pause between passes.",
			default: 500,
			control: { kind: "number", min: 0, max: 3000, step: 100 },
		},
		{
			name: "triggerOnView",
			type: "boolean",
			description: "Wait until scrolled into view before the first sweep.",
			default: true,
			control: { kind: "none" },
		},
		{
			name: "fixedWidth",
			type: "boolean",
			description: "Keep the widest string's width instead of resizing per string.",
			default: false,
			control: { kind: "boolean" },
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
		reducedMotion: "The text shows in its settled colour with no sweep or loop.",
		behaviour: [
			"The band, 34% of the text wide, crosses left to right over 1500ms on cubic-bezier(0.65, 0, 0.35, 1); text ahead of it is clear.",
			"A new string unblurs from 8px, rising 5.5px, over 340ms on cubic-bezier(0.22, 1, 0.36, 1), and the width eases over 400ms.",
		],
	},
	a11y: {
		notes: ["The current string is in an sr-only span; the painted copy is hidden."],
	},
	licenseOrigin: {
		source: "iconiq",
		url: "https://iconiqui.com",
		license: "MIT",
		copyright: "Copyright (c) 2024-2026 Edwin Vakayil",
	},
	impl: {
		react: {
			entry: "DiaText",
		},
		svelte: {
			entry: "DiaText",
		},
	},
	keywords: ["dia", "gradient", "sweep", "rainbow", "reveal", "text"],
});
