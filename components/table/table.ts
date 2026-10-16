import { defineComponent } from "@baby-ui/registry-schema";

const DENSITIES = ["comfortable", "compact"];
const VARIANTS = ["default", "framed"];

export const table = defineComponent({
	slug: "table",
	name: "Table",
	description:
		"Styled semantic table primitives: Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption.",
	category: "base",
	status: "stable",
	variants: { variant: VARIANTS, density: DENSITIES },
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
			files: [
				{ path: "table/table.tsx", type: "registry:ui" },
				{ path: "table/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "Table",
			files: [
				{ path: "table/table.svelte", type: "registry:ui" },
				{ path: "table/table-header.svelte", type: "registry:ui" },
				{ path: "table/table-body.svelte", type: "registry:ui" },
				{ path: "table/table-footer.svelte", type: "registry:ui" },
				{ path: "table/table-row.svelte", type: "registry:ui" },
				{ path: "table/table-head.svelte", type: "registry:ui" },
				{ path: "table/table-cell.svelte", type: "registry:ui" },
				{ path: "table/table-caption.svelte", type: "registry:ui" },
				{ path: "table/context.ts", type: "registry:ui" },
				{ path: "table/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["table", "data", "grid", "rows", "columns"],
});
