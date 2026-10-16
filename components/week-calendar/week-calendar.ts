import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["card", "plain"];

export const weekCalendar = defineComponent({
	slug: "week-calendar",
	name: "Week Calendar",
	description:
		"A week strip that swipes between weeks and pulls open into the full month.",
	category: "advanced",
	status: "stable",
	variants: { variant: VARIANTS },
	props: [
		{
			name: "selected",
			type: "Date | null",
			description: "Controlled selected day; null clears it. Bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "defaultSelected",
			type: "Date | null",
			description: "Uncontrolled starting selection. Defaults to today.",
			control: { kind: "none" },
		},
		{
			name: "onSelect",
			type: "(date: Date) => void",
			description: "Fired when a day is picked, including days outside the month.",
			control: { kind: "none" },
		},
		{
			name: "expanded",
			type: "boolean",
			description: "Controlled: month grid instead of a week strip. Bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "defaultExpanded",
			type: "boolean",
			description: "Start as the month grid.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "onExpandedChange",
			type: "(expanded: boolean) => void",
			description: "Fired when the handle is dragged, clicked or pressed.",
			control: { kind: "none" },
		},
		{
			name: "month",
			type: "Date",
			description:
				"Controlled: any day inside the week or month on screen. Bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "defaultMonth",
			type: "Date",
			description: "Uncontrolled starting period. Defaults to the selection.",
			control: { kind: "none" },
		},
		{
			name: "onMonthChange",
			type: "(month: Date) => void",
			description:
				"Fired when the arrows, a swipe, Today or the keyboard move the period.",
			control: { kind: "none" },
		},
		{
			name: "weekStartsOn",
			type: "0 | 1 | 2 | 3 | 4 | 5 | 6",
			description: "First weekday, 0 for Sunday.",
			default: 0,
			control: { kind: "number", min: 0, max: 6, step: 1 },
		},
		{
			name: "locale",
			type: "string",
			description: "BCP 47 locale for weekday, range and month labels.",
			default: "en-US",
			control: { kind: "select", options: ["en-US", "en-GB", "de-DE", "fr-FR", "ja-JP"] },
		},
		{
			name: "today",
			type: "Date",
			description: "Overrides today, for tests or another time zone.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<WeekCalendarLabels>",
			description: "Button, handle and live-region copy.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Bordered card, or no surface.",
			default: "card",
			control: { kind: "select", options: VARIANTS },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Weeks and months crossfade; rows and swipes snap without travel.",
		behaviour: [
			"Expanding grows every other week's row open over --duration-overlay, 45ms apart outward from the current week; collapsing mirrors it.",
			"A new week or month dissolves in from an 8px blur at 0.96 scale as the old one dissolves out; the range label crossfades through a 4px blur.",
			"The selected pill slides between days within a week; hover lifts a day to 1.06 and a press sinks it to 0.86.",
			"Dragging the week follows at 55% with up to 3.5deg of tilt; 45px or 350px/s commits to the next or previous week.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Arrow keys"],
				action: "Moves between days, crossing into the next week or month",
			},
			{ keys: ["Enter", "Space"], action: "Selects the focused day" },
			{ keys: ["Enter", "Space"], action: "On the handle, toggles the month grid" },
		],
		notes: [
			"Days are buttons with aria-pressed for the selection and aria-current=date for today.",
			"A polite live region announces the selected date.",
		],
	},
	licenseOrigin: {
		source: "iconiq",
		url: "https://iconiqui.com",
		license: "MIT",
		copyright: "Copyright (c) 2024-2026 Edwin Vakayil",
	},
	impl: {
		react: {
			entry: "WeekCalendar",
			files: [
				{ path: "week-calendar/week-calendar.tsx", type: "registry:ui" },
				{ path: "week-calendar/dates.ts", type: "registry:ui" },
				{ path: "week-calendar/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "WeekCalendar",
			files: [
				{ path: "week-calendar/week-calendar.svelte", type: "registry:ui" },
				{ path: "week-calendar/dates.ts", type: "registry:ui" },
				{ path: "week-calendar/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["calendar", "week", "month", "date", "swipe", "picker"],
});
