import { defineComponent } from "@baby-ui/registry-schema";

export const bentoGrid = defineComponent({
	slug: "bento-grid",
	name: "Bento Grid",
	description:
		"Asymmetric feature grid where each cell declares its own span and collapses to a single column on small screens.",
	category: "blocks",
	status: "stable",
	retired: true,

	props: [
		{
			name: "columns",
			type: "number",
			description: "Column count at the widest breakpoint.",
			default: 3,
			control: { kind: "number", min: 2, max: 4, step: 1 },
		},
		{
			name: "gap",
			type: "number",
			description: "Gap between cells, in pixels.",
			default: 16,
			control: { kind: "number", min: 8, max: 32, step: 2 },
		},
		{
			name: "rowHeight",
			type: "number",
			description: "Height of one grid row, in pixels. Cells span whole rows.",
			default: 160,
			control: { kind: "number", min: 100, max: 280, step: 10 },
		},
		{
			name: "span",
			type: '"1x1" | "2x1" | "1x2" | "2x2"',
			description: "On BentoCell: how many columns and rows the cell occupies.",
			default: "1x1",
			control: { kind: "none" },
		},
	],

	motion: {
		springs: [],
		reducedMotion: "The hover lift is removed; the border colour change stays.",
		behaviour: [
			"A cell lifts 2px and brightens its border on hover, over 200ms.",
			"Below the medium breakpoint every cell spans one column regardless of `span`, so a 2x2 cell never forces a horizontal scroll.",
			"Row height is fixed so cells align to a shared baseline grid rather than sizing to content.",
		],
	},

	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Reaches each cell that carries its own link or button" },
		],
		notes: [
			"The grid is a plain container with no list semantics; cells carry whatever role their content needs.",
		],
	},

	impl: {
		react: {
			entry: "BentoGrid",
		},
		svelte: {
			entry: "BentoGrid",
		},
	},

	keywords: ["bento", "grid", "layout", "features", "marketing"],
});
