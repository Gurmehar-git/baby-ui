import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { topographicLines as topographicLinesVariants } from "./variants";

const VARIANTS = ["lines", "filled"];
const TONES = ["mono", "primary"];
const POSITIONS = ["absolute", "fixed"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const topographicLines = defineComponent({
	slug: "topographic-lines",
	name: "Topographic Lines",
	description:
		"A slowly drifting contour map traced from a seeded height field, with heavier index contours.",
	category: "backgrounds",
	status: "beta",
	variants: variantsOf(topographicLinesVariants, ["variant", "tone", "position"]),
	props: [
		{
			name: "variant",
			type: union(VARIANTS),
			description: "Contour lines alone, or lines over soft banded elevation fills.",
			default: "lines",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "tone",
			type: union(TONES),
			description:
				"Muted lines with foreground index contours, or everything in primary.",
			default: "mono",
			control: { kind: "select", options: TONES },
		},
		{
			name: "levels",
			type: "number",
			description: "Contour lines across the full height range.",
			default: 14,
			control: { kind: "number", min: 4, max: 32, step: 1 },
		},
		{
			name: "indexEvery",
			type: "number",
			description: "Every Nth line is an index contour, drawn heavier; 0 turns them off.",
			default: 5,
			control: { kind: "number", min: 0, max: 10, step: 1 },
		},
		{
			name: "scale",
			type: "number",
			description: "Size of one hill, in px.",
			default: 280,
			control: { kind: "number", min: 80, max: 800, step: 20 },
		},
		{
			name: "speed",
			type: "number",
			description: "Drift rate; 0 holds the map still.",
			default: 1,
			control: { kind: "number", min: 0, max: 4, step: 0.25 },
		},
		{
			name: "seed",
			type: "number",
			description: "Picks the terrain; the same seed always draws the same map.",
			default: 7,
			control: { kind: "number", min: 1, max: 999, step: 1 },
		},
		{
			name: "lineWidth",
			type: "number",
			description: "Regular line width in px; index contours draw at 1.8x.",
			default: 1,
			control: { kind: "number", min: 0.5, max: 3, step: 0.25 },
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
			description: "Rendered above the map.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The map is drawn once and never drifts.",
		behaviour: [
			"Two layers of seeded value-noise fBm drift apart, so hills swell and merge instead of the whole map sliding.",
			"Contours are traced with marching squares on a 10px grid at even height levels; every `indexEvery` line is heavier and uses the index token.",
			"Redraws are capped at one per 40ms and stop entirely offscreen, in a hidden tab, or when `speed` is 0.",
			"Line colours come from theme tokens and resample on theme change.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The canvas is aria-hidden and purely decorative; children stay in the normal reading order.",
			"Lines stay at low contrast so text above keeps its own contrast.",
		],
	},
	impl: {
		react: {
			entry: "TopographicLines",
		},
		svelte: {
			entry: "TopographicLines",
		},
	},
	keywords: ["background", "topographic", "contour", "map", "terrain", "hero", "canvas"],
});
