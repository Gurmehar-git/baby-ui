import { defineComponent } from "@baby-ui/registry-schema";

const sizeProp = {
	name: "size",
	type: '"xs" | "sm" | "default" | "lg" | "xl"',
	description: "Field height.",
	default: "default",
	control: { kind: "select" as const, options: ["xs", "sm", "default", "lg", "xl"] },
};

const localeProp = {
	name: "locale",
	type: "string",
	description: "BCP 47 locale; sets the segment order, separators and calendar.",
	control: { kind: "select" as const, options: ["en-US", "en-GB", "de-DE", "ja-JP"] },
};

const invalidProp = {
	name: "invalid",
	type: "boolean",
	description: "Marks the field invalid from outside, e.g. a form error.",
	default: "false",
	control: { kind: "boolean" as const },
};

const segmentMotion = {
	springs: [],
	reducedMotion: "Nothing animates.",
	behaviour: [
		"The focused segment takes a soft primary tint over 100ms; the group rings while any segment has focus.",
	],
};

const popoverMotion = {
	springs: [],
	reducedMotion: "The popover appears and leaves without scaling.",
	behaviour: [
		...segmentMotion.behaviour,
		"The calendar opens on the shared anchored contract: zoom from 0.9 and a 4px lean, 150ms in, 100ms out.",
		"The calendar button stays tinted while open; picking a range end previews a fainter track first.",
	],
};

const timeMotion = {
	springs: [],
	reducedMotion: "The hands jump to the new time.",
	behaviour: [
		...segmentMotion.behaviour,
		"The clock icon's hands point at the value and sweep the short way round over 300ms.",
		"The clear button pops in from 0.75 when the field gains a value.",
	],
};

const segmentKeys = [
	{
		keys: ["Arrow Up", "Arrow Down"],
		action: "Step the focused segment; an empty one starts from today",
	},
	{ keys: ["Arrow Left", "Arrow Right"], action: "Move between segments" },
	{ keys: ["Digits"], action: "Type a value and jump to the next segment when complete" },
	{ keys: ["Backspace"], action: "Clears the segment, then moves back" },
];

const segmentNote =
	"Each segment is a labelled spinbutton with its range and a spoken value; empty ones read as Empty.";

const shadcn = {
	source: "shadcn/ui",
	url: "https://github.com/shadcn-ui/ui",
	license: "MIT",
	copyright: "Copyright (c) 2023 shadcn",
};

export const dateField = defineComponent({
	slug: "date-field",
	name: "Date Field",
	description:
		"Segmented month, day and year in the locale's order, typed or stepped with the arrow keys.",
	category: "base",
	status: "beta",
	props: [
		{
			name: "value",
			type: "Date | null (React) · DateValue | undefined (Svelte)",
			description:
				"The day, or empty while any segment is. Svelte takes an `@internationalized/date` value, bindable.",
			control: { kind: "none" },
		},
		{
			name: "onValueChange",
			type: "(value) => void",
			description: "Called when the segments complete to a new day, or empty out.",
			control: { kind: "none" },
		},
		localeProp,
		{
			name: "min / max",
			type: "Date (React) · DateValue (Svelte)",
			description:
				"Earliest and latest valid day; a date outside marks the field invalid.",
			control: { kind: "none" },
		},
		invalidProp,
		sizeProp,
		{
			name: "labels",
			type: "Partial<DateFieldLabels>",
			description: "Group and segment names, placeholders (React) and the range error.",
			control: { kind: "none" },
		},
	],
	motion: segmentMotion,
	a11y: {
		keyboard: segmentKeys,
		notes: [
			segmentNote,
			"An out-of-range date is announced through the field's error, linked by aria-describedby.",
		],
	},
	impl: {
		react: {
			entry: "DateField",
		},
		svelte: {
			entry: "DateField",
		},
	},
	keywords: ["date field", "date input", "segmented date", "birthday", "form"],
});

export const datePicker = defineComponent({
	slug: "date-picker",
	name: "Date Picker",
	description: "A segmented date field with a calendar popover on the button at its end.",
	category: "base",
	status: "beta",
	props: [
		{
			name: "value",
			type: "Date | null (React) · DateValue | undefined (Svelte)",
			description:
				"The chosen day. React takes a `Date`; Svelte takes an `@internationalized/date` value, bindable.",
			control: { kind: "none" },
		},
		{
			name: "onValueChange",
			type: "(value) => void",
			description: "Called with the new day, or empty when a segment is cleared.",
			control: { kind: "none" },
		},
		localeProp,
		{
			name: "min / max",
			type: "Date (React) · DateValue (Svelte)",
			description:
				"Earliest and latest selectable day; a typed date outside shows an error.",
			control: { kind: "none" },
		},
		{
			name: "disabledDates / isDateDisabled",
			type: "Matcher | Matcher[] (React) · (date) => boolean (Svelte)",
			description: "Extra unavailable days, in each calendar's own format.",
			control: { kind: "none" },
		},
		{
			name: "captionLayout",
			type: '"label" | "dropdown" | "dropdown-months" | "dropdown-years"',
			description: "Calendar heading style; dropdowns suit far-off dates like birthdays.",
			default: "dropdown",
			control: {
				kind: "select",
				options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
			},
		},
		invalidProp,
		sizeProp,
		{
			name: "labels",
			type: "Partial<DatePickerLabels>",
			description: "DateField's labels plus the calendar button's name.",
			control: { kind: "none" },
		},
	],
	motion: popoverMotion,
	a11y: {
		keyboard: [
			...segmentKeys,
			{ keys: ["Alt+Arrow Down"], action: "Opens the calendar" },
			{ keys: ["Escape"], action: "Closes the calendar and returns focus to its button" },
			{ keys: ["Arrow keys"], action: "Move by day in the calendar" },
			{ keys: ["Enter"], action: "Selects the focused day" },
		],
		notes: [
			segmentNote,
			"The calendar button has aria-haspopup and aria-expanded from the popover primitive.",
		],
	},
	licenseOrigin: shadcn,
	impl: {
		react: {
			entry: "DatePicker",
		},
		svelte: {
			entry: "DatePicker",
		},
	},
	keywords: ["date picker", "datepicker", "calendar popover", "date input", "form"],
});

export const dateRangePicker = defineComponent({
	slug: "date-range-picker",
	name: "Date Range Picker",
	description:
		"Segmented start and end dates with a two-month calendar, a presets rail and optional Apply.",
	category: "base",
	status: "beta",
	props: [
		{
			name: "value",
			type: "DateRange | undefined",
			description:
				"React: react-day-picker's `{ from, to }`. Svelte: bits-ui's `{ start, end }`, bindable.",
			control: { kind: "none" },
		},
		{
			name: "presets",
			type: "DateRangePreset[]",
			description:
				"Quick ranges built from today. Defaults to Today, Last 7 days, This month and Last 30 days; pass [] to hide the rail.",
			control: { kind: "none" },
		},
		{
			name: "confirm",
			type: "boolean",
			description:
				"Hold the pick in a draft until Apply, instead of committing each click.",
			default: "false",
			control: { kind: "boolean" },
		},
		localeProp,
		invalidProp,
		sizeProp,
		{
			name: "labels",
			type: "Partial<DateRangePickerLabels>",
			description:
				"Start and end names, the reversed-range error, presets, Apply and Cancel.",
			control: { kind: "none" },
		},
	],
	motion: popoverMotion,
	a11y: {
		keyboard: [
			...segmentKeys,
			{ keys: ["Alt+Arrow Down"], action: "Opens the calendar" },
			{ keys: ["Tab"], action: "Moves from the presets to the calendar" },
		],
		notes: [
			segmentNote,
			"Focus runs from the start date's segments into the end date's.",
			"An end date before the start date marks both invalid and explains why.",
			"Two months show from 640px up, one below, so the popover never overflows a phone.",
		],
	},
	licenseOrigin: shadcn,
	impl: {
		react: {
			entry: "DateRangePicker",
		},
		svelte: {
			entry: "DateRangePicker",
		},
	},
	keywords: ["date range picker", "range", "presets", "report filter", "booking", "form"],
});

export const timePicker = defineComponent({
	slug: "time-picker",
	name: "Time Picker",
	description:
		"Segmented hour and minute, with AM/PM on a 12-hour clock, typed or stepped with the arrows.",
	category: "base",
	status: "beta",
	props: [
		{
			name: "value",
			type: "string | null",
			description:
				'24-hour "HH:mm", the same string `<input type="time">` uses; empty while half typed. Bindable in Svelte.',
			control: { kind: "none" },
		},
		{
			name: "hourCycle",
			type: "12 | 24",
			description: "Clock style. Defaults to the locale's own.",
			control: { kind: "select", options: ["12", "24"] },
		},
		{
			name: "step",
			type: "number",
			description: "Minutes moved per arrow press, snapping to the step grid.",
			default: "1",
			control: { kind: "select", options: ["1", "5", "15", "30"] },
		},
		{
			name: "locale",
			type: "string",
			description: "BCP 47 locale for the AM/PM label and the default clock.",
			control: { kind: "none" },
		},
		{
			name: "min / max",
			type: 'string "HH:mm"',
			description:
				"Earliest and latest allowed time; a value outside marks the field invalid.",
			control: { kind: "none" },
		},
		{
			name: "clearable",
			type: "boolean",
			description:
				"Show an X button at the end while the field has a value, resetting it to null.",
			default: "false",
			control: { kind: "boolean" as const },
		},
		{
			name: "showNow",
			type: "boolean",
			description:
				"Show a 'Now' chip that sets the value to the current local time as HH:mm.",
			default: "false",
			control: { kind: "boolean" as const },
		},
		invalidProp,
		sizeProp,
		{
			name: "labels",
			type: "Partial<TimePickerLabels>",
			description:
				"Group and segment names plus the trailing buttons: clear, now, outOfRange.",
			control: { kind: "none" },
		},
	],
	motion: timeMotion,
	a11y: {
		keyboard: [...segmentKeys, { keys: ["A", "P"], action: "Sets the period" }],
		notes: [
			segmentNote,
			"Clear and Now trailing buttons mirror the group's focus ring; both expose aria-label.",
			"An out-of-range value is announced through the field's error, linked by aria-describedby.",
		],
	},
	impl: {
		react: {
			entry: "TimePicker",
		},
		svelte: {
			entry: "TimePicker",
		},
	},
	keywords: ["time picker", "time field", "time input", "clock", "booking", "form"],
});
