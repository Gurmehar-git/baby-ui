import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["default", "track", "inline", "bubble", "fluid", "wave", "ruler"];

export const slider = defineComponent({
	slug: "slider",
	name: "Slider",
	description:
		"Range input on a spring glide, in seven looks from a classic thumb to a wave, a ruler and a thumbless pill.",
	category: "base",
	status: "stable",
	variants: { variant: VARIANTS, size: ["sm", "default", "lg"] },
	props: [
		{
			name: "value",
			type: "number | number[]",
			description:
				"Current value. Bindable. An array renders one thumb per entry (a range slider).",
			default: 50,
			control: { kind: "number", min: 0, max: 100, step: 1 },
		},
		{
			name: "min",
			type: "number",
			description: "Lower bound.",
			default: 0,
			control: { kind: "number", min: 0, max: 100, step: 1 },
		},
		{
			name: "max",
			type: "number",
			description: "Upper bound.",
			default: 100,
			control: { kind: "number", min: 0, max: 200, step: 10 },
		},
		{
			name: "step",
			type: "number",
			description: "Increment.",
			default: 1,
			control: { kind: "number", min: 1, max: 25, step: 1 },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Disable the control.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Look. `inline`, `fluid`, `wave` and `ruler` take one value (a range falls back to `track`); `default`, `track` and `bubble` also go vertical.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "orientation",
			type: '"horizontal" | "vertical"',
			description:
				"Layout and which arrow keys move the thumb. `default`, `track` and `bubble` only; the others carry text, bars or a scale.",
			default: "horizontal",
			control: { kind: "select", options: ["horizontal", "vertical"] },
			showWhen: { variant: ["default", "track", "bubble"] },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg"',
			description:
				"Scale of the `default`, `track`, `inline`, `bubble` and `fluid` looks.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg"] },
			showWhen: { variant: ["default", "track", "inline", "bubble", "fluid"] },
		},
		{
			name: "showValue",
			type: "boolean",
			description: "Header with the label and the live value.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "formatValue",
			type: "(value: number) => string",
			description:
				"Formats the value wherever it shows: header, inline text, bubble, ruler readout, and the announced value.",
			control: { kind: "none" },
		},
		{
			name: "marks",
			type: "{ value: number; label?: string }[]",
			description:
				"Ticks under a horizontal track; a labelled mark jumps there on click.",
			control: { kind: "none" },
		},
		{
			name: "elastic",
			type: "boolean",
			description:
				"Dragging past either end stretches the track like elastic, then it springs back on release.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "onValueCommit",
			type: "(value: number | number[]) => void",
			description: "Fires once a drag or key press settles.",
			control: { kind: "none" },
		},
		{
			name: "range",
			type: "boolean",
			description:
				"Demo-only: renders two thumbs and a value tuple, since `value` accepts `number | number[]` on the real component (an array renders one thumb per entry).",
			default: false,
			control: { kind: "boolean" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Thumb, fill and ruler jump straight to the value; the bubble only fades and the wave holds flat bars.",
		behaviour: [
			"The thumb and fill glide to a clicked or keyed value on the snappy spring token (400ms); a held thumb follows the pointer within 100ms.",
			"The thumb scales to 1.08 on hover and 1.15 while dragging; the track thickens by 2px on hover, over 140ms.",
			"`track` and `inline` stretch their pill handle 1.35x while dragging; `inline` parts it into two dots where it crosses the label or value.",
			"`bubble` pops a value bubble out of the thumb while it's dragged; `fluid` presses to 1.03 and inverts its text under the fill.",
			"`wave` raises 32 bars into a Gaussian crest around the value, each bar delayed by its distance; `ruler` scrolls a scale under a fixed needle and settles onto the nearest step.",
			"Vertical orientation needs an explicit height on an ancestor (percentage sizing has nothing to resolve against otherwise); the demo sets one directly since it's a one-off layout concern, not a design token.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Arrow keys"], action: "Moves by one step" },
			{ keys: ["Page Up", "Page Down"], action: "Moves by ten steps" },
			{ keys: ["Home", "End"], action: "Jumps to the bounds" },
		],
		notes: [
			"A real range input underneath (Base UI's Thumb, React) or a real focusable div driving the same keyboard model (bits-ui, Svelte), so every one of those keys works without being reimplemented.",
			"Dragging or clicking a Slider nested inside a Drawer (vaul / vaul-svelte) can conflict with the Drawer's own swipe-to-dismiss gesture tracking; this is a Drawer-level characteristic, not specific to Slider.",
		],
	},
	licenseOrigin: {
		source: "sivir-ui",
		url: "https://github.com/aidan-neel/sivir-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Aidan Neel",
	},
	impl: {
		react: {
			entry: "Slider",
			files: [
				{ path: "slider/slider.tsx", type: "registry:ui" },
				{ path: "slider/variants.ts", type: "registry:ui" },
				{ path: "slider/core.ts", type: "registry:ui" },
				{ path: "slider/elastic.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "@base-ui/react"],
		},
		svelte: {
			entry: "Slider",
			files: [
				{ path: "slider/slider.svelte", type: "registry:ui" },
				{ path: "slider/variants.ts", type: "registry:ui" },
				{ path: "slider/core.ts", type: "registry:ui" },
				{ path: "slider/elastic.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "bits-ui"],
		},
	},
	keywords: ["slider", "range", "form", "input", "ruler", "wave", "equalizer"],
});
