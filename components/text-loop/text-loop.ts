import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { textLoop as textLoopVariants } from "./react/variants";

const SIZES = ["inherit", "sm", "md", "lg"];
const VARIANTS = ["slide", "fade", "roll"];
const DIRECTIONS = ["up", "down"];

export const textLoop = defineComponent({
	slug: "text-loop",
	name: "Text Loop",
	description:
		"Loops through items on an interval: sliding through a window, blurring in place, or rolling like a flip counter.",
	category: "text",
	status: "stable",
	variants: variantsOf(textLoopVariants, ["variant", "direction", "size"]),
	props: [
		{
			name: "items",
			type: "string[]",
			description: "The items to loop through.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "index",
			type: "number",
			description: "Controlled: which item is showing. Omit to let the component loop.",
			control: { kind: "none" },
		},
		{
			name: "defaultIndex",
			type: "number",
			description: "Uncontrolled starting index.",
			default: 0,
			control: { kind: "number", min: 0, max: 10, step: 1 },
		},
		{
			name: "onIndexChange",
			type: "(index: number) => void",
			description: "Fired every time the shown item changes.",
			control: { kind: "none" },
		},
		{
			name: "intervalMs",
			type: "number",
			description: "Time each item stays. Only runs while uncontrolled.",
			default: 1000,
			control: { kind: "number", min: 400, max: 4000, step: 100 },
		},
		{
			name: "durationMs",
			type: "number",
			description: "Enter and exit length.",
			default: 300,
			control: { kind: "number", min: 100, max: 1000, step: 50 },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`slide` moves items through a clipped window; `fade` blurs the next item in place as the last drifts out; `roll` turns a stack of items like a flip counter.",
			default: "slide",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "direction",
			type: DIRECTIONS.map((v) => `"${v}"`).join(" | "),
			description: "Items rise up or drop down.",
			default: "up",
			control: { kind: "select", options: DIRECTIONS },
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
		reducedMotion: "Items crossfade in place instead of sliding.",
		behaviour: [
			"The outgoing item slides a full line out and fades while the next slides in from the other side, 300ms on cubic-bezier(0, 0, 0.58, 1).",
			"Width holds the longest item, so the line never reflows.",
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
			entry: "TextLoop",
		},
		svelte: {
			entry: "TextLoop",
		},
	},
	keywords: ["text", "loop", "rotate", "slide", "cycle"],
});
