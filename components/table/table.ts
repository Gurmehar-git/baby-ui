import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { table as tableVariants } from "./react/variants";

const DENSITIES = ["comfortable", "compact"];
const VARIANTS = ["default", "framed"];

export const table = defineComponent({
	slug: "table",
	name: "Table",
	description:
		"Styled semantic table primitives: Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption.",
	category: "base",
	status: "stable",
	variants: variantsOf(tableVariants, ["variant", "density"]),
	props: [
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Bordered grid, or a card rim around a rounded inset body.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "density",
			type: DENSITIES.map((v) => `"${v}"`).join(" | "),
			description:
				"Row height for every TableHead/TableCell inside, set once on Table and read by its children.",
			default: "comfortable",
			control: { kind: "select", options: DENSITIES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "No motion beyond the shared row hover/selected colour transition.",
		behaviour: [
			"Density is set once on `<Table density>` and read by every `TableHead`/`TableCell` beneath it, so nested cells never repeat the prop.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"A real `<table>`/`<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>` tree; no ARIA role overrides needed.",
			'Mark a selected row with `data-state="selected"` (or `aria-selected`) to pick up the built-in selected-row background.',
		],
	},
	impl: {
		react: {
			entry: "Table",
		},
		svelte: {
			entry: "Table",
		},
	},
	keywords: ["table", "data", "grid", "rows", "columns"],
});
