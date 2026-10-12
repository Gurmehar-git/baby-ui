import { defineComponent } from "../index.ts";

export const switchComponent = defineComponent({
	slug: "switch",
	name: "Switch",
	description: "On/off control whose thumb travels rather than teleports.",
	category: "base",
	status: "stable",
	variants: { size: ["sm", "default", "lg", "xl"] },
	props: [
		{
			name: "checked",
			type: "boolean",
			description: "On state. Bindable.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Disable the control.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg" | "xl"',
			description: "Track and thumb size.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg", "xl"] },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name for the switch.",
			default: "Notifications",
			control: { kind: "text" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The thumb jumps to its position; the track still changes colour.",
		behaviour: [
			"The thumb travels over 140ms with an ease-out curve, the same duration as a button press.",
			"The track colour changes over the same duration so the two land together.",
		],
	},
	a11y: {
		role: "switch",
		keyboard: [
			{ keys: ["Space"], action: "Toggles the switch" },
			{ keys: ["Enter"], action: "Toggles the switch" },
		],
		notes: [
			"Uses role=switch with aria-checked, not a checkbox: a switch takes effect immediately, a checkbox waits for submit.",
			"State, keyboard and the hidden input are delegated to Base UI (React) and bits-ui (Svelte); this component only owns the classes and data-slots.",
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
			entry: "Switch",
			files: [
				{ path: "switch/switch.tsx", type: "registry:ui" },
				{ path: "switch/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "@base-ui/react"],
		},
		svelte: {
			entry: "Switch",
			files: [
				{ path: "switch/switch.svelte", type: "registry:ui" },
				{ path: "switch/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "bits-ui"],
		},
	},
	keywords: ["switch", "toggle", "form", "setting"],
});
