import { defineComponent } from "@baby-ui/registry-schema";

export const filterTable = defineComponent({
	slug: "filter-table",
	name: "Filter Table",
	description: "Status chips directly filter a task table, rows collapsing in place.",
	category: "advanced",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	props: [
		{
			name: "rows",
			type: "FilterRow[]",
			description: "The task rows to show.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "FilterTableLabels",
			description: "Column header text.",
			control: { kind: "none" },
		},
		{
			name: "filter",
			type: '"all" | FilterRowStatus',
			description: "Controlled active status filter. Omit to let the table own it.",
			default: "all",
			control: { kind: "none" },
		},
		{
			name: "onFilterChange",
			type: '(filter: "all" | FilterRowStatus) => void',
			description: "Fired when a filter chip is picked.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The row collapse is a grid-template-rows transition; still respects reduced motion via the shared ease token, no separate override needed.",
		behaviour: [
			"Filtering never unmounts a row: it collapses via `grid-template-rows: 1fr → 0fr` plus a fade, so the transition animates instead of jump-cutting.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Tab"],
				action: "Reaches each filter chip and the scrollable table region",
			},
		],
		notes: [
			"Filter chips are toggle buttons with `aria-pressed`, not a radio group: only one is visually active but they're independently focusable.",
			'The table region has `role="region"` and a `tabIndex` so keyboard users can scroll it horizontally.',
			"Status pills carry their label as text, not colour alone.",
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
			entry: "FilterTable",
		},
		svelte: {
			entry: "FilterTable",
		},
	},
	keywords: ["table", "filter", "tasks", "status"],
});
