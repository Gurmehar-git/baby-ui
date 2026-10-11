import { defineComponent } from "../index.ts";

export const toggleGroup = defineComponent({
	slug: "toggle-group",
	name: "Toggle Group",
	description: "Row of toggles in single or multiple mode, sharing one tab stop.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "value",
			type: "string | string[]",
			description: "Selected value, or values when multiple. Bindable.",
			control: { kind: "none" },
		},
		{
			name: "type",
			type: '"single" | "multiple"',
			description: "Whether more than one item can be pressed at once.",
			default: "single",
			control: { kind: "select", options: ["single", "multiple"] },
		},
		{
			name: "variant",
			type: '"default" | "outline"',
			description: "Filled track with a raised pressed item, or a bordered row.",
			default: "default",
			control: { kind: "select", options: ["default", "outline"] },
		},
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description: "Item size.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Disable the whole group.",
			default: false,
			control: { kind: "boolean" },
		},
	],
	a11y: {
		keyboard: [{ keys: ["Tab"], action: "Moves into the group, then between options" }],
		notes: [
			"role=group with a label. In multiple mode each option carries aria-pressed; in single mode the group is a real radiogroup (role=radio, aria-checked) per WAI-ARIA, since bits-ui distinguishes the two but Base UI does not (React uses aria-pressed either way).",
			"In single mode clicking the active option clears it. If clearing makes no sense for your data, this should be a radio group instead.",
			"Roving focus, keyboard nav and selection state are delegated to Base UI (React) and bits-ui (Svelte); this component only owns the classes and data-slots.",
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
			entry: "ToggleGroup",
			files: [
				{ path: "toggle-group/toggle-group.tsx", type: "registry:ui" },
				{ path: "toggle-group/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "@base-ui/react"],
		},
		svelte: {
			entry: "ToggleGroup",
			files: [
				{ path: "toggle-group/toggle-group.svelte", type: "registry:ui" },
				{ path: "toggle-group/toggle-group-item.svelte", type: "registry:ui" },
				{ path: "toggle-group/context.ts", type: "registry:ui" },
				{ path: "toggle-group/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "bits-ui"],
		},
	},
	keywords: ["toggle", "group"],
});
