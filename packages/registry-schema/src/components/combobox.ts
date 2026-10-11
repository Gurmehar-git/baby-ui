import { defineComponent } from "../index.ts";

export const combobox = defineComponent({
	slug: "combobox",
	isNew: true,
	name: "Combobox",
	description:
		"A Popover whose content is a Command: searchable selection, shadcn/ui's own recipe.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "open",
			type: "boolean",
			description: "Controlled open state. Bindable.",
			control: { kind: "none" },
		},
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description:
				"ComboboxTrigger and ComboboxContent: height, width and padding. Pass the same size to both so the trigger and the opened list line up.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The list appears without the scale, and rows no longer stagger in.",
		behaviour: [
			"Positioning, dismiss and layout are Popover's; filtering, the active-row marker and keyboard nav are Command's. Combobox itself adds no motion of its own.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Arrow keys"], action: "Moves through the filtered results" },
			{ keys: ["Enter"], action: "Selects the highlighted result" },
			{ keys: ["Escape"], action: "Closes the list" },
		],
		notes: [
			"aria-activedescendant points at the highlighted option, so focus stays in the input while the list is navigated.",
			"The empty state is rendered rather than collapsing the list, so the absence of matches is announced.",
			"There is no dedicated Combobox markup: ComboboxTrigger/ComboboxContent are thin Popover wrappers, and ComboboxInput/List/Empty/Group/Item are Command's own parts re-exported under a Combobox-friendly name.",
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
			entry: "Combobox",
			files: [
				{ path: "combobox/combobox.tsx", type: "registry:ui" },
				{ path: "combobox/variants.ts", type: "registry:ui" },
				{ path: "lib/control.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["popover", "command"],
		},
		svelte: {
			entry: "Combobox",
			files: [
				{ path: "combobox/combobox.svelte", type: "registry:ui" },
				{ path: "combobox/combobox-trigger.svelte", type: "registry:ui" },
				{ path: "combobox/combobox-content.svelte", type: "registry:ui" },
				{ path: "combobox/variants.ts", type: "registry:ui" },
				{ path: "lib/control.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["popover", "command"],
		},
	},
	keywords: ["combobox", "overlay"],
});
