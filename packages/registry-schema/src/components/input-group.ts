import { defineComponent } from "../index.ts";

export const inputGroup = defineComponent({
	slug: "input-group",
	name: "Input Group",
	description:
		"An input or textarea with icons, text or buttons docked inside its border, sharing one focus ring.",
	category: "base",
	status: "stable",
	variants: {
		size: ["xs", "sm", "default", "lg", "xl"],
		align: ["inline-start", "inline-end", "block-start", "block-end"],
	},
	props: [
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description: "InputGroup height.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
		},
		{
			name: "align",
			type: '"inline-start" | "inline-end" | "block-start" | "block-end"',
			description: "InputGroupAddon only. Which edge the addon docks to.",
			default: "inline-start",
			control: { kind: "none" },
		},
	],
	a11y: {
		role: "group",
		keyboard: [],
		notes: [
			"Clicking an addon's padding focuses the control, as a label would. Buttons inside keep their own click.",
			"The group's ring follows the control's focus and aria-invalid, so the whole box reads as one field.",
		],
	},
	licenseOrigin: {
		source: "shadcn/ui",
		url: "https://github.com/shadcn-ui/ui",
		license: "MIT",
		copyright: "Copyright (c) 2023 shadcn",
	},
	impl: {
		react: {
			entry: "InputGroup",
			files: [
				{ path: "input-group/input-group.tsx", type: "registry:ui" },
				{ path: "input-group/variants.ts", type: "registry:ui" },
				{ path: "lib/control.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "input", "textarea"],
		},
		svelte: {
			entry: "InputGroup",
			files: [
				{ path: "input-group/input-group.svelte", type: "registry:ui" },
				{ path: "input-group/input-group-addon.svelte", type: "registry:ui" },
				{ path: "input-group/input-group-button.svelte", type: "registry:ui" },
				{ path: "input-group/input-group-input.svelte", type: "registry:ui" },
				{ path: "input-group/input-group-text.svelte", type: "registry:ui" },
				{ path: "input-group/input-group-textarea.svelte", type: "registry:ui" },
				{ path: "input-group/variants.ts", type: "registry:ui" },
				{ path: "lib/control.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "input", "textarea"],
		},
	},
	keywords: ["input group", "addon", "prefix", "suffix", "input", "icon"],
});
