import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { cubeText as cubeTextVariants } from "./variants";

export const cubeText = defineComponent({
	slug: "cube-text",
	name: "Cube Text",
	description:
		"Each letter is a cube face that rolls down onto the next, in a wave across the text.",
	category: "text",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	variants: variantsOf(cubeTextVariants, ["size", "stagger"]),
	props: [
		{
			name: "text",
			type: "string",
			description: "Text to roll. Spaces stay as word breaks.",
			required: true,
			default: "Baby UI",
			control: { kind: "text" },
		},
		{
			name: "durationMs",
			type: "number",
			description:
				"One roll: the face turns in the first quarter and rests for the rest.",
			default: 2200,
			control: { kind: "number", min: 800, max: 5000, step: 100 },
		},
		{
			name: "delayMs",
			type: "number",
			description: "Wait before the first roll.",
			default: 0,
			control: { kind: "number", min: 0, max: 2000, step: 100 },
		},
		{
			name: "loop",
			type: "boolean",
			description: "Roll forever, or once.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "stagger",
			type: '"wave" | "together"',
			description:
				"`wave` delays each letter along a quarter-sine ramp; `together` rolls them at once.",
			default: "wave",
			control: { kind: "select", options: ["wave", "together"] },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg"',
			description: "Type scale.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The text is static: no roll.",
		behaviour: [
			"Each letter rotates 90deg on X in the first quarter of `durationMs`, revealing an identical face, then rests until the next loop.",
			"With `wave`, letter delays rise along a quarter sine up to a quarter of the duration, so the roll sweeps left to right.",
			"The roll is pure CSS: two faces per letter drawn with ::before and ::after, no JavaScript timers.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The rolling letters are aria-hidden; a visually hidden copy carries the text, read once and in order.",
		],
	},
	impl: {
		react: {
			entry: "CubeText",
		},
		svelte: {
			entry: "CubeText",
		},
	},
	keywords: ["flip", "cube", "roll", "3d", "letters", "text animation", "loop"],
});
