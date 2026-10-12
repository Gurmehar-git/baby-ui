import { defineComponent } from "../index.ts";

export const colorPicker = defineComponent({
	slug: "color-picker",
	name: "Color Picker",
	description:
		"Every colour control in one: a swatch + hex field, a labelled panel row, the full picker, a saturation area, a hue slider, a swatch and a swatch picker.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "variant",
			type: '"field" | "row" | "inline" | "area" | "slider" | "swatch" | "swatches"',
			description:
				"field: type a hex or press its swatch for the picker. row: a full-width label, hex and swatch row for settings panels. inline: the full picker. area: the saturation square. slider: the hue strip. swatch: one colour disc. swatches: pick from `swatches`.",
			default: "field",
			control: {
				kind: "select",
				options: ["field", "row", "inline", "area", "slider", "swatch", "swatches"],
			},
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg"',
			description:
				"Size of the field, area, slider and discs; the inline panel keeps its width.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg"] },
		},
		{
			name: "invalid",
			type: "boolean",
			description:
				"Field and row variants: mark the hex input invalid from outside, e.g. a form error.",
			default: "false",
			control: { kind: "boolean" },
		},
		{
			name: "value",
			type: "string",
			description: "Current colour as hex. Bindable.",
			default: "#7dd3fc",
			control: { kind: "color" },
		},
		{
			name: "format",
			type: '"hsv" | "hsl" | "rgb"',
			description: "Which channel sliders the panel shows. Bindable.",
			default: "hsv",
			control: { kind: "select", options: ["hsv", "hsl", "rgb"] },
		},
		{
			name: "swatches",
			type: "string[]",
			description: "Preset colours.",
			control: { kind: "none" },
		},
		{
			name: "recent",
			type: "string[]",
			description: "Recently used colours, newest first. The parent owns the list.",
			control: { kind: "none" },
		},
		{
			name: "eyedropper",
			type: "boolean",
			description:
				"Offer the screen eyedropper where the browser has the EyeDropper API.",
			default: "true",
			control: { kind: "boolean" },
		},
		{
			name: "open",
			type: "boolean",
			description: "Popover open state (field and row variants). Bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name for the control.",
			default: "Colour",
			control: { kind: "text" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Unchanged: dragging is direct manipulation, not animation.",
		behaviour: [
			"The square and the strip track the pointer with no easing, because a lagging handle reads as a dropped input.",
			"A pointer capture keeps the drag alive when the pointer leaves the square, so the colour never freezes mid-gesture.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Tab"],
				action:
					"Reaches the area, the hue strip, the hex field, each channel slider and each preset",
			},
			{
				keys: ["Arrow keys"],
				action:
					"Move the area (saturation across, brightness up and down) and the hue strip",
			},
			{ keys: ["Shift+Arrow keys"], action: "Move by 10" },
			{
				keys: ["Arrow keys"],
				action: "Swatches: move and choose, as native radios do (one tab stop)",
			},
			{ keys: ["Enter"], action: "Field and row: applies a typed hex" },
			{ keys: ["Arrow Up", "Arrow Down"], action: "Field and row: steps the value by 1" },
			{ keys: ["Page Up", "Page Down"], action: "Field and row: steps the value by 16" },
			{ keys: ["Escape"], action: "Field and row: reverts the edit" },
			{
				keys: ["Enter", "Space"],
				action: "Field and row: on the swatch, opens the picker",
			},
			{ keys: ["Escape"], action: "Closes the picker and returns focus to the swatch" },
		],
		notes: [
			"The area and the hue strip are sliders with spoken values, so the area and slider variants work without a pointer.",
			"Swatches are a radio group named by `label`; the chosen disc reports aria-checked and wears a ring in its own colour.",
			"The hex field is editable and labelled, which is the only path for anyone who cannot use a visual picker.",
		],
	},
	licenseOrigin: {
		source: "sivir-ui",
		url: "https://github.com/aidan-neel/sivir-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Aidan Neel",
	},
	impl: {
		react: {
			entry: "ColorPicker",
			files: [
				{ path: "color-picker/color-picker.tsx", type: "registry:ui" },
				{ path: "color-picker/variants.ts", type: "registry:ui" },
				{ path: "lib/color.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["popover", "input-group"],
		},
		svelte: {
			entry: "ColorPicker",
			files: [
				{ path: "color-picker/color-picker.svelte", type: "registry:ui" },
				{ path: "color-picker/variants.ts", type: "registry:ui" },
				{ path: "lib/color.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["popover", "input-group"],
		},
	},
	keywords: [
		"color",
		"picker",
		"color field",
		"hex input",
		"eyedropper",
		"swatch",
		"form",
	],
});
