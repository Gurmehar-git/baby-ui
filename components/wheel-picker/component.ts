import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { wheelPicker as wheelPickerVariants } from "./variants";

const ROWS = ["3", "5", "7"];

export const wheelPicker = defineComponent({
	slug: "wheel-picker",
	name: "Wheel Picker",
	description:
		"iOS-style barrel columns that flick, snap and loop, for times, dates and lists.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(wheelPickerVariants, ["rows"]),
	props: [
		{
			name: "rows",
			type: ROWS.map((v) => `"${v}"`).join(" | "),
			description: "Rows visible at once, on WheelPicker.",
			default: "5",
			control: { kind: "select", options: ROWS },
		},
		{
			name: "itemHeight",
			type: "number",
			description: "Row height in px, on WheelPicker.",
			default: 44,
			control: { kind: "number", min: 32, max: 64, step: 4 },
		},
		{
			name: "lens",
			type: "boolean",
			description: "Tint behind the selected row, on WheelPicker.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "options",
			type: "(string | { value: string; label?: string; disabled?: boolean })[]",
			description: "A column's rows, on WheelPickerColumn.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "string",
			description: "Controlled selected value; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "defaultValue",
			type: "string",
			description: "Uncontrolled starting value.",
			control: { kind: "none" },
		},
		{
			name: "onValueChange",
			type: "(value: string) => void",
			description: "Fires as each row passes the centre.",
			control: { kind: "none" },
		},
		{
			name: "onValueCommit",
			type: "(value: string) => void",
			description: "Fires once the wheel comes to rest.",
			control: { kind: "none" },
		},
		{
			name: "loop",
			type: "boolean",
			description: "Wrap around; needs at least rows + 2 options.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Lock the column.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "name",
			type: "string",
			description: "Adds a hidden input so the column submits with a form.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Rows stay flat and every jump is instant.",
		behaviour: [
			"Scrolling is native with scroll-snap, so touch flicks, the wheel and trackpads keep the platform's momentum.",
			"Each row follows a barrel curve on a scroll-driven view() timeline: y = R sin(a), rotateX(-a), fading by cos(a) to the power 1.15.",
			"A mouse drag carries 22% of its release velocity past the pointer, then snaps to the nearest enabled row.",
			"Looping wheels triple the list and recentre silently once scrolling stops.",
		],
	},
	a11y: {
		role: "listbox",
		keyboard: [
			{ keys: ["Arrow Up", "Arrow Down"], action: "Moves one row" },
			{ keys: ["Page Up", "Page Down"], action: "Move a screenful" },
			{ keys: ["Home", "End"], action: "Jumps to the first and last enabled row" },
		],
		notes: [
			"Each column is a listbox tracking the centred row with aria-activedescendant; loop copies are hidden.",
			"Where scroll-driven animations are unsupported the column falls back to a flat snapping list.",
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
			entry: "WheelPicker",
		},
		svelte: {
			entry: "WheelPicker",
		},
	},
	keywords: ["wheel", "picker", "time", "barrel", "ios", "scroll", "select"],
});
