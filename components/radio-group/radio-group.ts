import { defineComponent } from "@baby-ui/registry-schema";

export const radioGroup = defineComponent({
	slug: "radio-group",
	name: "Radio Group",
	description: "Single-choice group with roving focus and an indicator that scales in.",
	category: "base",
	status: "stable",
	variants: {
		variant: ["default", "solid", "card", "list"],
		orientation: ["vertical", "horizontal", "grid"],
	},
	props: [
		{
			name: "value",
			type: "string",
			description: "Selected option value. Bindable.",
			control: { kind: "none" },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg" | "xl"',
			description: "Control size.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg", "xl"] },
		},
		{
			name: "variant",
			type: '"default" | "solid" | "card" | "list"',
			description:
				"Bare rows; `solid` fills the checked ring so selection reads at small sizes; `card` puts each option in a bordered tile; `list` tints the checked row.",
			default: "default",
			control: { kind: "select", options: ["default", "solid", "card", "list"] },
		},
		{
			name: "orientation",
			type: '"vertical" | "horizontal" | "grid"',
			description: "Layout direction; `grid` places `card` items in responsive columns.",
			default: "vertical",
			control: { kind: "select", options: ["vertical", "horizontal", "grid"] },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Disable the whole group.",
			default: false,
			control: { kind: "boolean" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The indicator appears at full size.",
		behaviour: [
			"`list`: one highlight glides to the checked row instead of each row tinting itself.",
			"The selected dot scales from 0.6 to 1 over 140ms, the same duration as a button press.",
			"It never scales from 0: nothing in the world appears from nothing.",
		],
	},
	a11y: {
		role: "radiogroup",
		keyboard: [
			{ keys: ["Arrow keys"], action: "Moves between options and select as they go" },
			{ keys: ["Tab"], action: "Enters the group at the selected option, not the first" },
		],
		notes: [
			"Roving tabindex, so the group is one tab stop. Arrow keys selecting on move is the documented radio pattern, not an accident.",
			"State, roving focus and keyboard are delegated to Base UI (React) and bits-ui (Svelte); this component only owns the classes and data-slots.",
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
			entry: "RadioGroup",
			files: [
				{ path: "radio-group/radio-group.tsx", type: "registry:ui" },
				{ path: "radio-group/variants.ts", type: "registry:ui" },
				{ path: "radio-group/glide.ts", type: "registry:ui" },
				{ path: "lib/pill.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "@base-ui/react"],
		},
		svelte: {
			entry: "RadioGroup",
			files: [
				{ path: "radio-group/radio-group.svelte", type: "registry:ui" },
				{ path: "radio-group/radio-group-item.svelte", type: "registry:ui" },
				{ path: "radio-group/context.ts", type: "registry:ui" },
				{ path: "radio-group/variants.ts", type: "registry:ui" },
				{ path: "radio-group/glide.ts", type: "registry:ui" },
				{ path: "lib/pill.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "bits-ui"],
		},
	},
	keywords: ["radio", "form", "choice", "selection"],
});
