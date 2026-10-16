import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { buttonGroup as buttonGroupVariants } from "./react/variants";

const ORIENTATIONS = ["horizontal", "vertical"];

export const buttonGroup = defineComponent({
	slug: "button-group",
	name: "Button Group",
	description:
		"Buttons, inputs and selects joined into one control: inner corners square off and shared borders merge.",
	category: "base",
	status: "stable",
	variants: variantsOf(buttonGroupVariants, ["orientation"]),
	props: [
		{
			name: "orientation",
			type: ORIENTATIONS.map((v) => `"${v}"`).join(" | "),
			description: "A row or a column of segments.",
			default: "horizontal",
			control: { kind: "select", options: ORIENTATIONS },
		},
		{
			name: "ButtonGroupText",
			type: "component",
			description:
				"A static segment for labels or units; `render` (React) or `child` (Svelte) swaps its element, e.g. for a Label.",
			control: { kind: "none" },
		},
		{
			name: "ButtonGroupSeparator",
			type: "component",
			description:
				"A divider between segments that have no border of their own, such as filled buttons.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "No motion of its own.",
		behaviour: ["None; each segment keeps its own press feedback."],
	},
	a11y: {
		keyboard: [{ keys: ["Tab"], action: "Move between segments" }],
		notes: [
			'A role="group"; give it an aria-label when the segments need a shared name.',
			"A focused segment lifts above its neighbours so its ring is never clipped.",
		],
	},
	guidance: {
		when: [
			"Related actions that read as one control: Archive and Report, a value with a unit, a search field with its button.",
		],
		whenNot: [
			{ text: "Choosing one of several values.", use: "toggle-group" },
			{ text: "A primary action with a menu of related ones.", use: "split-button" },
		],
		responsive: [
			"Keeps its natural width; switch to `vertical` or a menu when a row would overflow.",
		],
		performance: ["Pure layout classes; no script."],
		ai: [
			"Wrap Buttons of the same `variant` and `size`; add ButtonGroupSeparator between filled buttons.",
			"Nest ButtonGroups to space clusters apart inside one toolbar.",
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
			entry: "ButtonGroup",
		},
		svelte: {
			entry: "ButtonGroup",
		},
	},
	keywords: ["button", "group", "segmented", "toolbar", "attached"],
});
