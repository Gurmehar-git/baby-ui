import { defineComponent } from "@baby-ui/registry-schema";

export const multiSelect = defineComponent({
	slug: "multi-select",
	name: "Multi Select",
	description:
		"Pick several options from a searchable list; choices show as removable chips, with select all, clear and a +N overflow.",
	category: "base",
	status: "beta",
	variants: { size: ["xs", "sm", "default", "lg", "xl"] },
	props: [
		{
			name: "options",
			type: "{ value: string; label: string; keywords?: string; disabled?: boolean }[]",
			description: "Options, in the order chips and the list show them.",
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "string[]",
			description: "Selected values. Bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "maxChips",
			type: "number",
			description: "Chips shown before the rest collapse into +N.",
			default: 3,
			control: { kind: "number", min: 1, max: 6, step: 1 },
		},
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description: "Field height.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Disable the field.",
			default: false,
			control: { kind: "boolean" },
		},
	],
	a11y: {
		role: "combobox",
		keyboard: [
			{ keys: ["Enter", "Space"], action: "Opens the list" },
			{
				keys: ["Backspace"],
				action: "On the field or in an empty search, removes the last chip",
			},
			{ keys: ["Arrow keys"], action: "Moves through options and Enter toggles one" },
		],
		notes: [
			"Each chip has its own labelled remove button.",
			"Chosen options read as selected, apart from the list's own highlight.",
		],
	},
	impl: {
		react: {
			entry: "MultiSelect",
			files: [
				{ path: "multi-select/multi-select.tsx", type: "registry:ui" },
				{ path: "multi-select/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["badge", "command", "popover", "rolling-digits"],
		},
		svelte: {
			entry: "MultiSelect",
			files: [
				{ path: "multi-select/multi-select.svelte", type: "registry:ui" },
				{ path: "multi-select/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["badge", "command", "popover", "rolling-digits"],
		},
	},
	keywords: ["multi select", "multiselect", "chips", "combobox", "tags", "select many"],
});
