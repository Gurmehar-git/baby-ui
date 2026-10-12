import { defineComponent } from "../index.ts";

const LAYOUTS = ["virtual", "server", "infinite"];
const VARIANTS = ["default", "framed"];
const DENSITIES = ["comfortable", "compact"];
const SIMULATE = ["normal", "error", "empty"];

export const dataTable = defineComponent({
	slug: "data-table",
	name: "Data Table",
	description:
		"Composable parts over TanStack Table core: sorting, search, column visibility, pinning, resizing, selection, pagination, virtualized rows and infinite loading, with loading, refetch, empty and error states.",
	category: "base",
	status: "beta",
	variants: { variant: VARIANTS, density: DENSITIES },
	props: [
		{
			name: "layout",
			type: LAYOUTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Demo only: 10,000 client rows virtualized, an async server with paging, sorting and search, or infinite loading.",
			default: "virtual",
			control: { kind: "select", options: LAYOUTS },
		},
		{
			name: "simulate",
			type: SIMULATE.map((v) => `"${v}"`).join(" | "),
			description:
				"Demo only, server layout: the first request fails or comes back empty.",
			default: "normal",
			control: { kind: "select", options: SIMULATE },
			showWhen: { layout: ["server"] },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "DataTable: Table's frame, a bordered grid or a card rim.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "density",
			type: DENSITIES.map((v) => `"${v}"`).join(" | "),
			description: "DataTable: row height for every part inside.",
			default: "comfortable",
			control: { kind: "select", options: DENSITIES },
		},
		{
			name: "loading / fetching / error / onRetry",
			type: "boolean · boolean · unknown · () => void",
			description:
				"DataTable: skeleton rows on first load, a progress bar and dimmed rows on refetch, and an error state with a retry (onretry in Svelte).",
			control: { kind: "none" },
		},
		{
			name: "hasMore / onLoadMore",
			type: "boolean · () => void",
			description:
				"DataTable: infinite loading. `onLoadMore` (onloadmore) fires as the last row nears view, re-armed after each page.",
			control: { kind: "none" },
		},
		{
			name: "useDataTable / createDataTable",
			type: "(options) => Table",
			description:
				"The table instance. Takes every TanStack Table option, controlled state included; `paginate: false` keeps every row for scroll tables. Svelte passes a function returning the options.",
			control: { kind: "none" },
		},
		{
			name: "virtualize / estimateRowHeight / overscan",
			type: "boolean · number · number",
			description:
				"DataTableContent: render only the rows in view. Rows are measured once rendered, so variable heights are fine.",
			control: { kind: "none" },
		},
		{
			name: "worker",
			type: "TableWorker (createDataTableWorker)",
			description:
				"Table option: filter and sort in a Web Worker, for 10K+ rows. Your worker entry calls `initDataTableWorker` with accessor-only columns. Falls back to the main thread where workers don't exist.",
			control: { kind: "none" },
		},
		{
			name: "reorderable",
			type: "boolean",
			description:
				"DataTableContent: drag a header's grip, or press its arrow keys, to move unpinned columns (TanStack `columnOrder`).",
			default: "true",
			control: { kind: "none" },
		},
		{
			name: "columnDef.meta",
			type: "{ label?, align?, headClassName?, cellClassName?, reorderable? }",
			description:
				"Per column: the menu label, text alignment, classes for its head and cells, and whether it can be dragged.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The refetch bar stops sweeping and pulses in place; rows still dim.",
		behaviour: [
			"A refetch keeps the current rows on screen, dimmed to 60%, under a sweeping 2px bar.",
			"Column menus and view options use the shared menu motion; the sort icon swaps with the sort.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Tab"],
				action:
					"Reaches each column header menu, the resize handles and the row checkboxes",
			},
			{
				keys: ["Arrow Left", "Arrow Right"],
				action: "On a resize handle, narrows or widens the column",
			},
			{
				keys: ["Arrow Left", "Arrow Right"],
				action: "On a column grip, moves the column",
			},
			{ keys: ["Escape"], action: "Cancels a column drag" },
		],
		notes: [
			"A real table: headers carry aria-sort, and the root is aria-busy while loading.",
			"The error state is role=alert; the loading-more row is a status region.",
			"Resize handles are focusable separators with their width as aria-valuenow.",
			"Virtualized tables keep only the rows in view in the DOM, so screen readers read the visible window.",
		],
	},
	licenseOrigin: {
		source: "@tanstack/svelte-table (rune reactivity bindings)",
		url: "https://github.com/TanStack/table",
		license: "MIT",
		copyright: "Copyright (c) 2016 Tanner Linsley",
	},
	impl: {
		react: {
			entry: "DataTable",
			files: [
				{ path: "data-table/data-table.tsx", type: "registry:ui" },
				{ path: "data-table/core.ts", type: "registry:ui" },
				{ path: "data-table/worker.ts", type: "registry:ui" },
				{ path: "data-table/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: [
				"clsx",
				"tailwind-merge",
				"tailwind-variants",
				"@tanstack/table-core",
				"@tanstack/virtual-core",
			],
			registryDependencies: [
				"table",
				"button",
				"checkbox",
				"dropdown-menu",
				"empty",
				"input-group",
				"select",
				"skeleton",
				"spinner",
			],
		},
		svelte: {
			entry: "DataTable",
			files: [
				{ path: "data-table/data-table.svelte", type: "registry:ui" },
				{ path: "data-table/data-table-toolbar.svelte", type: "registry:ui" },
				{ path: "data-table/data-table-search.svelte", type: "registry:ui" },
				{ path: "data-table/data-table-view-options.svelte", type: "registry:ui" },
				{ path: "data-table/data-table-column-header.svelte", type: "registry:ui" },
				{ path: "data-table/data-table-content.svelte", type: "registry:ui" },
				{ path: "data-table/data-table-pagination.svelte", type: "registry:ui" },
				{ path: "data-table/data-table-select-all.svelte", type: "registry:ui" },
				{ path: "data-table/data-table-select-row.svelte", type: "registry:ui" },
				{ path: "data-table/data-table-render.svelte", type: "registry:ui" },
				{ path: "data-table/data-table-icon.svelte", type: "registry:ui" },
				{ path: "data-table/create-data-table.svelte.ts", type: "registry:ui" },
				{ path: "data-table/reactivity.svelte.ts", type: "registry:ui" },
				{ path: "data-table/render.ts", type: "registry:ui" },
				{ path: "data-table/select-column.ts", type: "registry:ui" },
				{ path: "data-table/context.ts", type: "registry:ui" },
				{ path: "data-table/core.ts", type: "registry:ui" },
				{ path: "data-table/worker.ts", type: "registry:ui" },
				{ path: "data-table/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: [
				"clsx",
				"tailwind-merge",
				"tailwind-variants",
				"@tanstack/store",
				"@tanstack/table-core",
				"@tanstack/virtual-core",
			],
			registryDependencies: [
				"table",
				"button",
				"checkbox",
				"dropdown-menu",
				"empty",
				"input-group",
				"select",
				"skeleton",
				"spinner",
			],
		},
	},
	keywords: [
		"data table",
		"datagrid",
		"tanstack table",
		"virtualized",
		"infinite scroll",
		"pagination",
		"sorting",
		"server side",
	],
});
