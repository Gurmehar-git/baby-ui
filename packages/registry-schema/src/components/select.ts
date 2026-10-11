import { defineComponent } from "../index.ts";

export const select = defineComponent({
	slug: "select",
	isNew: true,
	name: "Select",
	description:
		"Listbox at least as wide as its trigger that grows to fit its longest option, keeps the selected option in view and flips when needed.",
	category: "base",
	status: "stable",
	variants: { variant: ["default", "ghost"], size: ["xs", "sm", "default", "lg", "xl"] },
	props: [
		{
			name: "variant",
			type: '"default" | "ghost"',
			description:
				"SelectTrigger: a bordered field, or ghost (text and chevron) for a compact switch beside a heading.",
			default: "default",
			control: { kind: "select", options: ["default", "ghost"] },
		},
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description: "SelectTrigger: height and text size.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
		},
		{
			name: "value",
			type: "string",
			description: "Selected value. Bindable.",
			control: { kind: "none" },
		},
		{
			name: "items",
			type: "{ value: string; label: string; disabled?: boolean }[]",
			description:
				"Value-to-label map, read by SelectValue to render the trigger's text without requiring the list to have mounted first.",
			control: { kind: "none" },
		},
		{
			name: "placeholder",
			type: "string",
			description: "Shown when nothing is selected.",
			default: "Select an option",
			control: { kind: "text" },
		},
		{
			name: "side",
			type: '"top" | "right" | "bottom" | "left"',
			description:
				"SelectContent: preferred side. Flips automatically when there is not room.",
			default: "bottom",
			control: {
				kind: "select",
				options: ["top", "right", "bottom", "left"],
			},
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The list appears without the scale.",
		behaviour: [
			"The list matches the trigger's width, so the option text lines up with the value it replaces.",
			"Available height is measured, so a select near the bottom of the page scrolls internally rather than overflowing.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Arrow Down", "Enter"], action: "Opens the list from the trigger" },
			{ keys: ["Arrow keys"], action: "Moves between options" },
			{ keys: ["Escape"], action: "Closes and returns focus to the trigger" },
		],
		notes: [
			"The trigger is role=combobox with aria-haspopup=listbox, which is the documented pattern for a custom select.",
			"The list opens with focus on the selected option, not the first one.",
			"Positioning, roving focus, typeahead and portaling are delegated to Base UI (React) and bits-ui (Svelte); this component only owns the classes and data-slots.",
			"Svelte: SelectItem needs a `label` prop (used by SelectValue to render the trigger's text) since bits-ui doesn't read it back from the item's own rendered children the way Base UI's React SelectItem does.",
		],
	},
	guidance: {
		when: [
			"Choosing one value from a fixed list of roughly five to fifteen options.",
			"Forms where the options are known and do not need typing to find.",
		],
		whenNot: [
			{ text: "Long or searchable lists.", use: "combobox" },
			{ text: "Picking several values.", use: "multi-select" },
			{ text: "Two to four options that should stay visible.", use: "radio-group" },
			{
				text: "A plain native picker, for example on mobile forms.",
				use: "native-select",
			},
		],
		responsive: [
			"The list is at least as wide as the trigger and grows to fit its longest option.",
			"Height caps at 16rem or the space available, and the list flips to the other side when it runs out of room.",
		],
		performance: ["The list mounts only while open."],
		ai: [
			"Pass `items` (value and label) so the trigger shows the selected label before the list has opened.",
			"Use `value` with `onValueChange` for controlled state; `placeholder` shows while nothing is chosen.",
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
			entry: "Select",
			files: [
				{ path: "select/select.tsx", type: "registry:ui" },
				{ path: "select/variants.ts", type: "registry:ui" },
				{ path: "lib/anchor.ts", type: "registry:lib" },
				{ path: "lib/menu.ts", type: "registry:lib" },
				{ path: "lib/control.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-variants", "clsx", "tailwind-merge", "@base-ui/react"],
		},
		svelte: {
			entry: "Select",
			files: [
				{ path: "select/select.svelte", type: "registry:ui" },
				{ path: "select/select-trigger.svelte", type: "registry:ui" },
				{ path: "select/select-value.svelte", type: "registry:ui" },
				{ path: "select/select-content.svelte", type: "registry:ui" },
				{ path: "select/select-item.svelte", type: "registry:ui" },
				{ path: "select/select-group.svelte", type: "registry:ui" },
				{ path: "select/select-label.svelte", type: "registry:ui" },
				{ path: "select/select-separator.svelte", type: "registry:ui" },
				{ path: "select/variants.ts", type: "registry:ui" },
				{ path: "lib/anchor.ts", type: "registry:lib" },
				{ path: "lib/menu.ts", type: "registry:lib" },
				{ path: "lib/control.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-variants", "clsx", "tailwind-merge", "bits-ui"],
			// select-separator.svelte is still a plain <hr>: bits-ui's Select module has no
			// Select-scoped Separator (unlike Base UI's), and this repo has no standalone one yet.
		},
	},
	keywords: ["select", "overlay"],
});
