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
		},
		svelte: {
			entry: "Calendar",
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
		},
		svelte: {
			entry: "RangeCalendar",
		},
	},
	keywords: ["calendar", "date range", "range picker", "booking", "form"],
});
