import { defineComponent } from "@baby-ui/registry-schema";

const sizeProp = {
	name: "size",
	type: '"sm" | "default" | "lg"',
	description: "Day cell size, via `--cell-size`.",
	default: "default",
	control: { kind: "select" as const, options: ["sm", "default", "lg"] },
};

const a11y = {
	keyboard: [
		{ keys: ["Arrow keys"], action: "Moves by day, or by week with Up and Down" },
		{ keys: ["Page Up", "Page Down"], action: "Moves to the previous or next month" },
		{ keys: ["Home", "End"], action: "Jumps to the start or end of the week" },
		{ keys: ["Enter", "Space"], action: "Selects the focused day" },
		{ keys: ["Arrow keys"], action: "In the month and year grids, moves between cells" },
		{ keys: ["Escape"], action: "In the month and year grids, returns to the days" },
	],
	notes: [
		"Grid semantics, focus and keyboard come from react-day-picker (React) and bits-ui (Svelte).",
		"Today is outlined rather than filled, so it never reads as the selected day.",
	],
};

const motion = {
	springs: [],
	reducedMotion: "Views and months cross-fade over 120ms without travel or blur.",
	behaviour: [
		"Every month shows six weeks (`fixedWeeks`, on by default), so the grid keeps one height as months change.",
		"Paging slides the weeks and caption 14px the way they travel, with a 2px blur-fade, 240ms.",
		"Opening the month or year grid zooms out from the days; picking zooms back in, 260ms.",
		"Month and year cells stagger in 14ms apart; days and cells squish on press.",
	],
};

export const calendar = defineComponent({
	slug: "calendar",
	name: "Calendar",
	description:
		"Date grid with month and year grids, direction-aware paging and shadcn's API.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "captionLayout",
			type: '"label" | "dropdown" | "dropdown-months" | "dropdown-years"',
			description:
				"Plain heading, or month and year buttons that open month and year grids.",
			default: "label",
			control: {
				kind: "select",
				options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
			},
		},
		sizeProp,
		{
			name: "buttonVariant",
			type: "ButtonVariant",
			description: "Variant of the previous and next month buttons.",
			default: "ghost",
		},
	],
	motion,
	a11y,
	licenseOrigin: {
		source: "shadcn/ui",
		url: "https://github.com/shadcn-ui/ui",
		license: "MIT",
		copyright: "Copyright (c) 2023 shadcn",
	},
	impl: {
		react: {
			entry: "Calendar",
			files: [
				{ path: "calendar/calendar.tsx", type: "registry:ui" },
				{ path: "calendar/chooser.ts", type: "registry:ui" },
				{ path: "calendar/types.ts", type: "registry:ui" },
				{ path: "calendar/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "react-day-picker"],
			registryDependencies: ["button"],
		},
		svelte: {
			entry: "Calendar",
			files: [
				{ path: "calendar/calendar.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-caption.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-cell.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-chooser.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-chooser-nav.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-day.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-grid.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-grid-body.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-grid-head.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-grid-row.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-head-cell.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-header.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-heading.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-month.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-month-select.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-months.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-nav.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-next-button.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-prev-button.svelte", type: "registry:ui" },
				{ path: "calendar/calendar-year-select.svelte", type: "registry:ui" },
				{ path: "calendar/chooser.ts", type: "registry:ui" },
				{ path: "calendar/chooser-state.svelte.ts", type: "registry:ui" },
				{ path: "calendar/types.ts", type: "registry:ui" },
				{ path: "calendar/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: [
				"clsx",
				"tailwind-merge",
				"tailwind-variants",
				"bits-ui",
				"@internationalized/date",
			],
			registryDependencies: ["button"],
		},
	},
	keywords: ["calendar", "date", "date picker", "day picker", "form"],
});

export const rangeCalendar = defineComponent({
	slug: "range-calendar",
	name: "Range Calendar",
	description:
		"Calendar that selects a start and end date, with the range drawn as one track.",
	category: "base",
	status: "stable",
	props: [sizeProp],
	motion,
	a11y,
	licenseOrigin: {
		source: "shadcn/ui",
		url: "https://github.com/shadcn-ui/ui",
		license: "MIT",
		copyright: "Copyright (c) 2023 shadcn",
	},
	impl: {
		react: {
			entry: "RangeCalendar",
			files: [
				{ path: "range-calendar/range-calendar.tsx", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "react-day-picker"],
			registryDependencies: ["calendar"],
		},
		svelte: {
			entry: "RangeCalendar",
			files: [
				{ path: "range-calendar/range-calendar.svelte", type: "registry:ui" },
				{ path: "range-calendar/range-calendar-caption.svelte", type: "registry:ui" },
				{ path: "range-calendar/range-calendar-cell.svelte", type: "registry:ui" },
				{ path: "range-calendar/range-calendar-day.svelte", type: "registry:ui" },
				{ path: "range-calendar/range-calendar-grid.svelte", type: "registry:ui" },
				{ path: "range-calendar/range-calendar-grid-body.svelte", type: "registry:ui" },
				{ path: "range-calendar/range-calendar-grid-head.svelte", type: "registry:ui" },
				{ path: "range-calendar/range-calendar-grid-row.svelte", type: "registry:ui" },
				{ path: "range-calendar/range-calendar-head-cell.svelte", type: "registry:ui" },
				{ path: "range-calendar/range-calendar-header.svelte", type: "registry:ui" },
				{ path: "range-calendar/range-calendar-heading.svelte", type: "registry:ui" },
				{ path: "range-calendar/range-calendar-month.svelte", type: "registry:ui" },
				{
					path: "range-calendar/range-calendar-month-select.svelte",
					type: "registry:ui",
				},
				{ path: "range-calendar/range-calendar-months.svelte", type: "registry:ui" },
				{ path: "range-calendar/range-calendar-nav.svelte", type: "registry:ui" },
				{ path: "range-calendar/range-calendar-next-button.svelte", type: "registry:ui" },
				{ path: "range-calendar/range-calendar-prev-button.svelte", type: "registry:ui" },
				{ path: "range-calendar/range-calendar-year-select.svelte", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: [
				"clsx",
				"tailwind-merge",
				"tailwind-variants",
				"bits-ui",
				"@internationalized/date",
			],
			registryDependencies: ["calendar", "button"],
		},
	},
	keywords: ["calendar", "date range", "range picker", "booking", "form"],
});
