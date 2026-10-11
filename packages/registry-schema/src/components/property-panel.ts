import { defineComponent } from "../index.ts";

export const propertyPanel = defineComponent({
	slug: "property-panel",
	isNew: true,
	name: "Property Panel",
	description:
		"A dense inspector for settings and tweak panels: compose labelled groups of compact rows by hand, or hand PropertyPanelControls a DialKit-style config and get baby-ui sliders, selects, switches and pickers.",
	category: "advanced",
	status: "experimental",
	variants: { variant: ["default", "card"] },
	props: [
		{
			name: "mode",
			type: '"schema" | "composed"',
			description:
				"Demo only: a PropertyPanelControls built from a config, or groups and Field rows composed by hand.",
			default: "schema",
			control: { kind: "select", options: ["schema", "composed"] },
		},
		{
			name: "variant",
			type: '"default" | "card"',
			description:
				"default: sits on the surface it is placed on. card: lifts the panel onto the card surface.",
			default: "default",
			control: { kind: "select", options: ["default", "card"] },
		},
		{
			name: "collapsible",
			type: "boolean",
			description:
				"PropertyPanelGroup: the label becomes a toggle with a chevron and the content animates its height.",
			default: "false",
			control: { kind: "none" },
		},
		{
			name: "open",
			type: "boolean",
			description:
				"PropertyPanelGroup: open state when collapsible. Bindable in Svelte; `defaultOpen` and `onOpenChange` in React.",
			default: "true",
			control: { kind: "none" },
		},
		{
			name: "schema",
			type: "PropertySchema",
			required: true,
			description:
				'PropertyPanelControls: a DialKit config. `[default, min, max, step?]` is a slider, a number scrubs, a boolean switches, a hex string picks a colour, other strings are text; `{ type: "select" | "combobox" | "segmented", options }` and `{ type: "action" }` are the rest; a nested object is a collapsible folder.',
			control: { kind: "none" },
		},
		{
			name: "values",
			type: "PropertyValues",
			description:
				"PropertyPanelControls: live values shaped like the config (folders nest, actions are left out). Bindable in Svelte; `values` + `onValuesChange` or `defaultValues` in React.",
			control: { kind: "none" },
		},
		{
			name: "onValuesChange",
			type: "(values: PropertyValues, path: string) => void",
			description:
				"PropertyPanelControls: every edit, with the dotted path that changed.",
			control: { kind: "none" },
		},
		{
			name: "onAction",
			type: "(path: string) => void",
			description: "PropertyPanelControls: a clicked action entry, by dotted path.",
			control: { kind: "none" },
		},
		{
			name: "title",
			type: "string",
			description: "PropertyPanelControls: label over the top-level rows.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Collapsing groups open and close instantly.",
		behaviour: [
			"A collapsible group animates grid-template-rows, the same as Collapsible, so nothing is measured.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space"], action: "On a group's label, toggles the group" },
		],
		notes: [
			"Groups are plain containers, as in a sidebar; the label is a visual heading for its rows.",
			"A collapsible label is a button with aria-expanded; the action sits beside it, never inside it.",
			"Rows are Field size=sm, so labels stay real labels for their controls.",
		],
	},
	impl: {
		react: {
			entry: "PropertyPanel",
			files: [
				{ path: "property-panel/property-panel.tsx", type: "registry:ui" },
				{ path: "property-panel/property-panel-controls.tsx", type: "registry:ui" },
				{ path: "property-panel/schema.ts", type: "registry:ui" },
				{ path: "property-panel/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: [
				"collapsible",
				"field",
				"slider",
				"number-input",
				"switch",
				"color-picker",
				"input",
				"select",
				"combobox",
				"toggle-group",
				"button",
			],
		},
		svelte: {
			entry: "PropertyPanel",
			files: [
				{ path: "property-panel/property-panel.svelte", type: "registry:ui" },
				{ path: "property-panel/property-panel-group.svelte", type: "registry:ui" },
				{ path: "property-panel/property-panel-group-label.svelte", type: "registry:ui" },
				{
					path: "property-panel/property-panel-group-action.svelte",
					type: "registry:ui",
				},
				{
					path: "property-panel/property-panel-group-content.svelte",
					type: "registry:ui",
				},
				{ path: "property-panel/property-panel-controls.svelte", type: "registry:ui" },
				{ path: "property-panel/property-panel-row.svelte", type: "registry:ui" },
				{ path: "property-panel/schema.ts", type: "registry:ui" },
				{ path: "property-panel/context.ts", type: "registry:ui" },
				{ path: "property-panel/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "bits-ui"],
			registryDependencies: [
				"collapsible",
				"field",
				"slider",
				"number-input",
				"switch",
				"color-picker",
				"input",
				"select",
				"combobox",
				"toggle-group",
				"button",
				"command",
			],
		},
	},
	keywords: [
		"property panel",
		"inspector",
		"settings",
		"preferences",
		"panel section",
		"dialkit",
		"tweak panel",
		"controls",
	],
});
