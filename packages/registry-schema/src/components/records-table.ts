import { defineComponent } from "../index.ts";

const DENSITIES = ["comfortable", "compact"];

export const recordsTable = defineComponent({
	slug: "records-table",
	name: "Records Table",
	description:
		"An AI-spreadsheet grid: columns are configurable properties, each with a type, a tool and a prompt.",
	category: "advanced",
	status: "stable",
	variants: { density: DENSITIES },
	props: [
		{
			name: "rows",
			type: "RecordRow[]",
			description:
				"Every company row shown. Required: this table has no sample data of its own.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<RecordsTableLabels>",
			description:
				"Every user-facing string: headers, strength names, menu items, aria labels and footer counts.",
			control: { kind: "none" },
		},
		{
			name: "fill",
			type: "boolean",
			description:
				"Stretches to fill its container instead of sizing to its own columns.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "density",
			type: DENSITIES.map((v) => `"${v}"`).join(" | "),
			description: "Row height and default column widths.",
			default: "comfortable",
			control: { kind: "select", options: DENSITIES },
		},
		{
			name: "modelOptions",
			type: "string[]",
			description:
				"Real model names offered by the Tool picker; empty offers nothing, not a fictional default list.",
			control: { kind: "none" },
		},
		{
			name: "calculatingColumn",
			type: "string | null",
			description:
				"Column currently revealing computed values row by row. Omit/`null` shows none; the caller owns the reveal timing.",
			control: { kind: "none" },
		},
		{
			name: "resolvedCount",
			type: "number",
			description: "Row count already resolved for `calculatingColumn`.",
			default: 0,
			control: { kind: "none" },
		},
		{
			name: "selected",
			type: "string[]",
			description:
				"Selected row ids. Controlled with `onSelectedChange` (React also takes `defaultSelected`; Svelte binds).",
			control: { kind: "none" },
		},
		{
			name: "sort",
			type: "RecordSort",
			description:
				"Sort key and direction. Controlled with `onSortChange` (React `defaultSort`).",
			control: { kind: "none" },
		},
		{
			name: "pinned",
			type: "ColumnKey[]",
			description:
				"Columns kept sticky while the table scrolls sideways. Controlled with `onPinnedChange` (React `defaultPinned`).",
			control: { kind: "none" },
		},
		{
			name: "config",
			type: "RecordsTableConfig",
			description:
				"Per-column type, tool, inputs, grounding and behaviour switches. Controlled with `onConfigChange` (React `defaultConfig`).",
			control: { kind: "none" },
		},
		{
			name: "showAiColumn",
			type: "boolean",
			description:
				"Shows the AI column. Controlled with `onShowAiColumnChange` (React `defaultShowAiColumn`).",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "onCalculate",
			type: "(column: ColumnKey) => void",
			description: 'Fired when "Go calculate" is pressed for a column.',
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The calculating dot pulse, sort arrow turn and More settings grid-row collapse all drop to instant under reduced motion.",
		behaviour: [
			"Column headers open a config popover (type, tool, inputs, prompt preview) built from the real Select/Popover/Switch/HoverCard primitives, not a hand-rolled menu.",
			"More settings collapses via grid-template-rows and stays mounted, so it animates both ways.",
			"Pinned columns stick with an opaque background; widths follow density until resized or reset.",
			'Row calculation reveal (row-by-row "Calculating…") is entirely driven by `calculatingColumn`/`resolvedCount`; the component never times its own reveal.',
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Tab"],
				action:
					"Reaches each header's sort/config controls, the resize handle, and every row checkbox",
			},
		],
		notes: [
			'Column resize handles are `role="separator"` with an `aria-label` naming the column.',
			"Sort buttons carry an `aria-label` naming the column and `aria-pressed` when active.",
			"Every checkbox and switch has an accessible name from `labels`.",
		],
	},
	licenseOrigin: {
		source: "beUI",
		url: "https://beui.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 beUI",
	},
	impl: {
		react: {
			entry: "RecordsTable",
			files: [
				{ path: "records-table/records-table.tsx", type: "registry:ui" },
				{ path: "records-table/config-popover.tsx", type: "registry:ui" },
				{ path: "records-table/tag-list.tsx", type: "registry:ui" },
				{ path: "records-table/types.ts", type: "registry:ui" },
				{ path: "records-table/model.ts", type: "registry:ui" },
				{ path: "records-table/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: [
				"avatar",
				"checkbox",
				"dropdown-menu",
				"popover",
				"select",
				"switch",
				"hover-card",
				"button",
			],
		},
		svelte: {
			entry: "RecordsTable",
			files: [
				{ path: "records-table/records-table.svelte", type: "registry:ui" },
				{ path: "records-table/config-popover.svelte", type: "registry:ui" },
				{ path: "records-table/glyph-icon.svelte", type: "registry:ui" },
				{ path: "records-table/tag-list.svelte", type: "registry:ui" },
				{ path: "records-table/types.ts", type: "registry:ui" },
				{ path: "records-table/model.ts", type: "registry:ui" },
				{ path: "records-table/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: [
				"avatar",
				"checkbox",
				"dropdown-menu",
				"popover",
				"select",
				"switch",
				"hover-card",
				"button",
			],
		},
	},
	keywords: ["table", "records", "spreadsheet", "ai", "columns"],
});
