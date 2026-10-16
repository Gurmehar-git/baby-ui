import { defineComponent } from "@baby-ui/registry-schema";

export const switchComponent = defineComponent({
	slug: "switch",
	name: "Switch",
	description: "On/off control whose thumb travels rather than teleports.",
	category: "base",
	status: "stable",
	variants: {
		variant: ["default", "round", "marked"],
		size: ["sm", "default", "lg", "xl"],
	},
	props: [
		{
			name: "variant",
			type: '"default" | "round" | "marked"',
			description:
				"`default`: a pill thumb; `round`: a circular thumb; `marked`: round, with an on bar and an off ring in the free half of the track, so state never rests on colour alone.",
			default: "default",
			control: { kind: "select", options: ["default", "round", "marked"] },
		},
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
			"The thumb travels over 300ms on the drawer curve; the track colour changes alongside it.",
			"Pressed, the thumb stretches 15% toward its travel and eases back on release.",
			"Marked: the on bar and off ring cross-fade over 150ms as the thumb leaves their half.",
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
