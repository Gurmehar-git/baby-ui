import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { progress as progressVariants } from "./react/variants";

export const progress = defineComponent({
	slug: "progress",
	name: "Progress",
	description:
		"Bar or ring progress with tones, a spring-filled value and a glossy indeterminate sweep.",
	category: "base",
	status: "stable",
	variants: variantsOf(progressVariants, ["size", "tone", "variant"]),
	props: [
		{
			name: "value",
			type: "number",
			description: "Completion from 0 to 100. Ignored when indeterminate.",
			default: 40,
			control: { kind: "number", min: 0, max: 100, step: 1 },
			showWhen: { indeterminate: [false] },
		},
		{
			name: "indeterminate",
			type: "boolean",
			description: "Unknown duration: the bar sweeps instead of filling.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg" | "xl"',
			description: "Track thickness.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg", "xl"] },
		},
		{
			name: "variant",
			type: '"linear" | "circular"',
			description: "A bar, or a ring with a gap either side of the fill.",
			default: "linear",
			control: { kind: "select", options: ["linear", "circular"] },
		},
		{
			name: "tone",
			type: '"default" | "info" | "success" | "destructive"',
			description: "Fill colour from the theme.",
			default: "default",
			control: { kind: "select", options: ["default", "info", "success", "destructive"] },
		},
		{
			name: "min",
			type: "number",
			description: "Value at an empty bar.",
			default: 0,
			control: { kind: "none" },
		},
		{
			name: "max",
			type: "number",
			description: "Value at a full bar.",
			default: 100,
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description:
				"Accessible name. Shown under a ring, and as a bar's header title when showValue or helper is set.",
			control: { kind: "text" },
		},
		{
			name: "helper",
			type: "string",
			description: "Secondary line under the label, on bars and rings.",
			control: { kind: "text" },
		},
		{
			name: "showValue",
			type: "boolean",
			description: "Header value on a bar, centre value on a ring.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "formatValue",
			type: "(value: number, percent: number) => string",
			description: "Formats the shown value. Defaults to a rounded percent.",
			control: { kind: "none" },
		},
		{
			name: "indeterminateLabel",
			type: "string",
			description: "Shown in place of the value while indeterminate.",
			default: "Loading",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The indeterminate sweep stops and the track shows a static partial fill.",
		behaviour: [
			"The fill scales on the snappy spring token (400ms), so a jump from 10 to 90 reads as progress.",
			"The indeterminate bar sweeps a glossy band across every 1.55s, fading in over the first 14% and out over the last 16%.",
			"The ring's fill and its gapped track glide together on the same spring; an indeterminate ring spins a 28% arc every 1.15s.",
		],
	},
	a11y: {
		role: "progressbar",
		keyboard: [],
		notes: [
			"Determinate sets aria-valuenow, aria-valuemin and aria-valuemax; indeterminate omits aria-valuenow entirely rather than reporting 0.",
			"aria attributes are delegated to Base UI (React) and bits-ui (Svelte); this component only owns the classes and data-slots.",
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
			entry: "Progress",
		},
		svelte: {
			entry: "Progress",
		},
	},
	keywords: ["progress", "loading", "bar"],
});
