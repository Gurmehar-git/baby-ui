import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { checkbox as checkboxVariants } from "./react/variants";

export const checkbox = defineComponent({
	slug: "checkbox",
	name: "Checkbox",
	description: "Checkbox with an animated tick and a real indeterminate state.",
	category: "base",
	status: "stable",
	variants: variantsOf(checkboxVariants, ["variant", "size"]),
	props: [
		{
			name: "checked",
			type: "boolean",
			description: "Checked state. Bindable.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "variant",
			type: '"default" | "circle" | "card"',
			description:
				"`default`: a square box; `circle`: a round box, for task lists; `card`: the whole labelled tile is the hit area and edges in the primary colour once checked.",
			default: "default",
			control: { kind: "select", options: ["default", "circle", "card"] },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg" | "xl"',
			description: "Control size.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg", "xl"] },
		},
		{
			name: "description",
			type: "string",
			description: "Secondary line under the label.",
			control: { kind: "text" },
		},
		{
			name: "indeterminate",
			type: "boolean",
			description: "Partial state for a parent of mixed children.",
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
			name: "label",
			type: "string",
			description: "Text rendered beside the box and wired to it.",
			default: "Accept terms",
			control: { kind: "text" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The tick appears without drawing; the box still changes colour.",
		behaviour: [
			"Indeterminate morphs the tick into the dash along the same three points, and back.",
			"The tick draws itself over 200ms using stroke-dashoffset rather than fading in.",
			"The box fills before the tick draws, so the colour change reads as the cause.",
			"Indeterminate shows a dash and takes precedence over checked, matching the native control.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Backed by a real checkbox input, visually hidden rather than replaced, so form submission and the indeterminate DOM property both work.",
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
			entry: "Checkbox",
		},
		svelte: {
			entry: "Checkbox",
		},
	},
	keywords: ["checkbox", "form", "toggle", "selection"],
});
