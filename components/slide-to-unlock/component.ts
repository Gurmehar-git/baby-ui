import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { slideToUnlock as slideToUnlockVariants } from "./variants";

const VARIANTS = ["default", "secondary", "destructive", "success", "warning", "info"];
const SIZES = ["xs", "sm", "default", "lg", "xl"];

export const slideToUnlock = defineComponent({
	slug: "slide-to-unlock",
	name: "Slide to Unlock",
	description: "A deliberate drag confirmation for consequential actions.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(slideToUnlockVariants, ["variant", "size"]),
	props: [
		{
			name: "label",
			type: "string",
			description: "Accessible action name applied to the slider handle.",
			required: true,
			control: { kind: "text" },
		},
		{
			name: "value",
			type: "number",
			description: "Controlled progress from 0 to 100; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((value) => `"${value}"`).join(" | "),
			description:
				"Tone, matching Button: the handle takes the solid colour, the track a tint.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((value) => `"${value}"`).join(" | "),
			description:
				"Outer height on the Button ladder (24 to 48px); handle and text scale with it.",
			default: "xl",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "threshold",
			type: "number",
			description: "Progress required when the gesture commits.",
			default: 90,
			control: { kind: "number", min: 50, max: 100, step: 5 },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Stops pointer and keyboard input.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "loading",
			type: "boolean",
			description:
				"The caller's action is running: the handle shows a spinner and input stops.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "handleSize",
			type: "number | string",
			description: "Overrides the size's handle diameter, as pixels or a CSS length.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Progress still follows direct manipulation; settling snaps without travel.",
		behaviour: [
			"The handle follows pointer movement 1:1 through the shared slider primitive.",
			"A committed gesture below the threshold settles back to the start.",
			"A completed gesture settles at 100 and leaves outcome rendering to the caller.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Arrow Right", "Arrow Left", "Page Up", "Page Down"],
				action: "Step progress; it stays put and completes at the threshold",
			},
			{ keys: ["Home", "End"], action: "Move to the start or complete" },
		],
		notes: [
			"The handle is a native slider primitive with a caller-supplied action label.",
			"The caller announces and renders the real action outcome.",
		],
	},
	guidance: {
		when: [
			"A rare, consequential action benefits from deliberate physical confirmation.",
		],
		whenNot: [
			{
				text: "Routine primary actions that should complete with one activation.",
				use: "button",
			},
			{
				text: "A destructive action that still needs a written explanation.",
				use: "alert-dialog",
			},
		],
		responsive: [
			"The track fills its parent up to a per-size max width; prefer `lg` or `xl` on touch.",
		],
		performance: [
			"The Base UI and Bits UI slider engines own pointer and keyboard tracking.",
		],
		ai: [
			"Keep value and completion outcome controlled; never simulate processing inside the component.",
		],
	},
	licenseOrigin: {
		source: "sv-chanhdai",
		url: "https://github.com/sv-chanhdai/sv-chanhdai",
		license: "MIT",
		copyright: "Copyright (c) 2026 Sikandar Bhide",
	},
	impl: {
		react: { entry: "SlideToUnlock" },
		svelte: { entry: "SlideToUnlock" },
	},
	keywords: ["slide", "unlock", "confirm", "drag", "destructive"],
});
