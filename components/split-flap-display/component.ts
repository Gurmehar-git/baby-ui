import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { splitFlap as splitFlapVariants } from "./variants";

const VARIANTS = ["solid", "card"];
const SIZES = ["sm", "md", "lg"];
const INDICATORS = ["none", "success", "primary", "warning", "destructive"];
const LAYOUTS = ["board", "line"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const splitFlapDisplay = defineComponent({
	slug: "split-flap-display",
	name: "Split Flap Display",
	description:
		"A departures-board display whose cells flip through the character drum to each new value.",
	category: "animated",
	status: "stable",
	variants: variantsOf(splitFlapVariants, ["variant", "size", "indicator"]),
	props: [
		{
			name: "value",
			type: "string",
			description: "Board text; a newline starts a new row. Uppercased.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "layout",
			type: union(LAYOUTS),
			description:
				"Demo only: a rotating departures board or one rotating line (the real component takes `value`).",
			default: "board",
			control: { kind: "select", options: LAYOUTS },
		},
		{
			name: "columns",
			type: "number",
			description: "Cells per row; shorter rows pad with blanks, longer ones are cut.",
			default: 24,
			control: { kind: "number", min: 4, max: 32, step: 1 },
		},
		{
			name: "variant",
			type: union(VARIANTS),
			description: "Inverted solid board or a bordered card board.",
			default: "solid",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: union(SIZES),
			description: "Largest glyph size; the board shrinks below it to fit its container.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "indicator",
			type: union(INDICATORS),
			description: "Colour of the side strips on each row; `none` hides them.",
			default: "success",
			control: { kind: "select", options: INDICATORS },
		},
		{
			name: "stepMs",
			type: "number",
			description: "Time for one flap to fall, per character step.",
			default: 60,
			control: { kind: "number", min: 20, max: 300, step: 10 },
		},
		{
			name: "staggerMs",
			type: "number",
			description: "Delay between neighbouring cells starting, for a wave.",
			default: 30,
			control: { kind: "number", min: 0, max: 150, step: 5 },
		},
		{
			name: "characters",
			type: "string",
			description: "Drum order each cell flips through. Glyphs outside it snap in.",
			default: " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$.,!?:;+-=%&#@/'",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Cells show the new value immediately with no flaps.",
		behaviour: [
			"Each cell steps forward through the drum from its current glyph to the target, one flap per step.",
			"Per step the old glyph's top half falls on rotateX(0 to -90deg), then the new glyph's bottom half lands (90 to 0deg) with a small settle.",
			"Cells that already match do not flap; the rest start staggerMs apart per column and row, so a change rolls across the board.",
			"Rows and cells added or removed (row count, columns) open and close on grid-template-rows/columns and stay mounted, inert when closed.",
			"The glyph size fits the container width, capped by size.",
			"On mount every cell flips up from blank.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The board is aria-hidden; a visually hidden aria-live polite copy carries the value once.",
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
			entry: "SplitFlapDisplay",
		},
		svelte: {
			entry: "SplitFlapDisplay",
		},
	},
	keywords: ["split flap", "solari", "departures", "board", "flip", "airport"],
});
