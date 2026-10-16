import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { textRepel as textRepelVariants } from "./react/variants";

const MODES = ["repel", "attract", "inertia"];
const SIZES = ["inherit", "sm", "md", "lg"];

export const textRepel = defineComponent({
	slug: "text-repel",
	name: "Text Repel",
	description:
		"Letters shy away from, lean toward, or get flicked by the pointer, then spring back.",
	category: "text",
	status: "stable",
	variants: variantsOf(textRepelVariants, ["mode", "size"]),
	props: [
		{
			name: "text",
			type: "string",
			description: "The text to render; read once by screen readers.",
			default: "Move your cursor here",
			control: { kind: "text" },
		},
		{
			name: "mode",
			type: MODES.map((v) => `"${v}"`).join(" | "),
			description:
				"Repel pushes letters away from the pointer, attract pulls them toward it, inertia flicks each letter it crosses by the pointer's speed.",
			default: "repel",
			control: { kind: "select", options: MODES },
		},
		{
			name: "radius",
			type: "number",
			description: "Pointer influence radius, in px.",
			default: 120,
			control: { kind: "number", min: 40, max: 300, step: 10 },
			showWhen: { mode: ["repel", "attract"] },
		},
		{
			name: "strength",
			type: "number",
			description: "Largest displacement, in px, for a letter right under the pointer.",
			default: 45,
			control: { kind: "number", min: 5, max: 120, step: 5 },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Type scale; inherit keeps the surrounding size.",
			default: "inherit",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Letters stay put; the pointer has no effect.",
		behaviour: [
			"Force falls off quadratically to zero at `radius`, and each letter tilts with its sideways shift.",
			"Offsets are written as CSS custom properties per pointer move (no re-render); a spring sampled into linear() eases every letter, and a new target retargets mid-flight.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The letters are aria-hidden; a visually hidden copy carries the text once.",
			"Purely decorative motion: nothing depends on moving the pointer.",
		],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "TextRepel",
		},
		svelte: {
			entry: "TextRepel",
		},
	},
	keywords: ["text", "cursor", "repel", "attract", "letters", "hover"],
});
