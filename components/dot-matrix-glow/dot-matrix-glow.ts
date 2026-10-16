import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { dotMatrixGlow as dotMatrixGlowVariants } from "./react/variants";

const SHAPES = ["dot", "square", "plus"];
const SIZES = ["sm", "md", "lg"];
const TONES = ["primary", "spectrum", "mono"];
const POSITIONS = ["absolute", "fixed"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const dotMatrixGlow = defineComponent({
	slug: "dot-matrix-glow",
	name: "Dot Matrix Glow",
	description:
		"A hero dot grid that brightens and swells around the pointer and ripples outward on press.",
	category: "backgrounds",
	status: "beta",
	variants: variantsOf(dotMatrixGlowVariants, ["shape", "size", "tone", "position"]),
	props: [
		{
			name: "shape",
			type: union(SHAPES),
			description: "Round dots, squares, or plus marks.",
			default: "dot",
			control: { kind: "select", options: SHAPES },
		},
		{
			name: "size",
			type: union(SIZES),
			description: "Density preset; sets `gap` and `dotSize` unless you pass them.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "tone",
			type: union(TONES),
			description: "Which theme tokens the lit dots take.",
			default: "primary",
			control: { kind: "select", options: TONES },
		},
		{
			name: "glowRadius",
			type: "number",
			description: "Pointer influence radius, in px.",
			default: 160,
			control: { kind: "number", min: 60, max: 360, step: 10 },
		},
		{
			name: "ripple",
			type: "boolean",
			description: "Pointer down sends a ring of light outward that fades as it travels.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "ambient",
			type: "boolean",
			description:
				"A slow shimmer across the grid; keeps the loop running while visible.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "gap",
			type: "number",
			description: "Grid pitch in px; overrides the `size` preset.",
			control: { kind: "none" },
		},
		{
			name: "dotSize",
			type: "number",
			description: "Resting dot radius in px; overrides the `size` preset.",
			control: { kind: "none" },
		},
		{
			name: "position",
			type: union(POSITIONS),
			description:
				"`absolute` fills the nearest positioned parent; `fixed` fills the viewport.",
			default: "absolute",
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description: "Rendered above the grid; the pointer still lights dots through it.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"No ripples and no shimmer; dots under the pointer light and clear instantly with no easing.",
		behaviour: [
			"Dots inside `glowRadius` ease toward a smoothstep falloff of the pointer distance, swelling to 1.9x and taking the tone colour.",
			"Pointer down sends a gaussian ring outward at 0.55px/ms that fades over 1400ms; up to five rings overlap.",
			"The loop runs only while some dot is still changing or `ambient` is on; it stops when the grid settles, offscreen or in a hidden tab.",
			"The resting grid is drawn once per resize or theme change; colours come from theme tokens.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The canvas is aria-hidden and purely decorative; children stay in the normal reading order.",
			"The grid never takes pointer events from content above it.",
		],
	},
	impl: {
		react: {
			entry: "DotMatrixGlow",
		},
		svelte: {
			entry: "DotMatrixGlow",
		},
	},
	keywords: ["background", "dot grid", "hero", "cursor", "glow", "ripple", "canvas"],
});
