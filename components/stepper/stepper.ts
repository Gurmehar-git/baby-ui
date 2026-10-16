import { defineComponent } from "@baby-ui/registry-schema";

const ORIENTATIONS = ["horizontal", "vertical"];
const DETAILS = ["all", "current"];

const files = (main: string) => [
	{ path: `stepper/${main}`, type: "registry:ui" as const },
	{ path: "stepper/steps.ts", type: "registry:ui" as const },
	{ path: "stepper/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

export const stepper = defineComponent({
	slug: "stepper",
	name: "Stepper",
	description:
		"A steps indicator for onboarding, checkout and setup flows, with connectors that fill in turn and a check that draws in.",
	category: "advanced",
	status: "stable",
	variants: { orientation: ORIENTATIONS },
	props: [
		{
			name: "steps",
			type: "StepperStep[]",
			description:
				"`{ id, label, description?, error? }`; an `error` turns the marker into an alert.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "current",
			type: "number",
			description:
				"Index of the step in progress; `steps.length` marks the flow complete.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "onStepSelect",
			type: "(index: number) => void",
			description:
				"Lets people choose a completed step; without it the stepper is read-only.",
			control: { kind: "none" },
		},
		{
			name: "orientation",
			type: ORIENTATIONS.map((v) => `"${v}"`).join(" | "),
			description: "Above the content, or beside it.",
			default: "horizontal",
			control: { kind: "select", options: ORIENTATIONS },
		},
		{
			name: "details",
			type: DETAILS.map((v) => `"${v}"`).join(" | "),
			description:
				"`current` shows only the active step's description; errors always show.",
			default: "all",
			control: { kind: "select", options: DETAILS },
		},
		{
			name: "compact",
			type: "boolean",
			description:
				"Markers only, with the current label underneath; horizontal does this below 30rem anyway.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "completeLabel",
			type: "string",
			description: "Announced and captioned once every step is complete.",
			default: "All steps complete",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Fills, pops and draws are instant.",
		behaviour: [
			"A jump across several steps fills or drains the connectors one after another.",
			"The number shrinks away as the check pops in and draws; the current ring grows once progress lands.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["ArrowLeft", "ArrowRight"],
				action: "Move between reachable steps (horizontal)",
			},
			{ keys: ["ArrowUp", "ArrowDown"], action: "Move between reachable steps" },
			{ keys: ["Home", "End"], action: "First step or the current one" },
		],
		notes: [
			"The current step has aria-current=step; each step speaks its status.",
			'Progress changes are announced as "Step n of m".',
		],
	},
	guidance: {
		when: ["Multi-step flows where people need to see where they are."],
		whenNot: [
			{ text: "An agent's running plan.", use: "task-steps" },
			{ text: "Single continuous progress.", use: "progress" },
		],
		responsive: [
			"Horizontal folds to markers with a caption below 30rem of its own width.",
		],
		performance: ["CSS transitions only."],
		ai: ["Keep labels to one or two words; put detail in `description`."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "Stepper",
			files: files("stepper.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: [],
		},
		svelte: {
			entry: "Stepper",
			files: files("stepper.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: [],
		},
	},
	keywords: ["stepper", "steps", "wizard", "progress", "checkout", "onboarding"],
});
