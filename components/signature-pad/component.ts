import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { signaturePad as signaturePadVariants } from "./variants";

const VARIANTS = ["default", "line"];

export const signaturePad = defineComponent({
	slug: "signature-pad",
	name: "Signature Pad",
	description:
		"A signature field with real ink: width follows pen pressure or speed, ends taper, with three inks, undo, redo, a time-true replay, a wiping clear and cropped PNG or SVG export.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(signaturePadVariants, ["variant"]),
	props: [
		{
			name: "value",
			type: "InkStroke[]",
			description:
				"The strokes; empty means unsigned. Controlled with onValueChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "A bordered pad, or only the baseline.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "signer",
			type: "string",
			description: "Printed under the line.",
			control: { kind: "none" },
		},
		{
			name: "hint",
			type: "string",
			description: "Rests on the baseline until the first stroke.",
			default: "Sign here",
			control: { kind: "none" },
		},
		{
			name: "defaultTone",
			type: '"default" | "primary" | "violet"',
			description: "The ink selected at first.",
			default: "default",
			control: { kind: "none" },
		},
		{
			name: "defaultWidth",
			type: '"fine" | "medium" | "bold"',
			description: "The nib selected at first.",
			default: "medium",
			control: { kind: "none" },
		},
		{
			name: "downloadable",
			type: "boolean",
			description:
				"Adds Save as PNG and SVG buttons; both crop to the ink on a transparent background.",
			default: false,
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Clearing removes the ink at once; the hint and swaps fade without moving.",
		behaviour: [
			"Ink follows the pointer with light streamlining; pen pressure or drawing speed sets the width.",
			"Replay redraws each stroke at its own pace with a nib riding the tip; pauses are held to 90 to 260ms and long signatures play faster.",
			"Clear cuts the ink away behind a squeegee edge that crosses the pad over 560ms.",
			"Redone strokes fade back in; the hint rises and blurs away on the first stroke.",
			"Save buttons swap to Saved for 1.8s; Play swaps to Stop while a replay runs.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Mod+Z"], action: "Undo the last stroke" },
			{ keys: ["Shift+Mod+Z", "Mod+Y"], action: "Redo" },
			{ keys: ["Delete"], action: "Clear the pad" },
			{ keys: ["Escape"], action: "Stop a replay" },
		],
		notes: [
			"The pad is focusable and named as signed or empty; the shortcuts are described to screen readers.",
			"Every action also has a toolbar button, so nothing depends on the keyboard shortcuts.",
			"Strokes added, undo, redo, clears, replays and saves are announced through a polite live region.",
		],
	},
	guidance: {
		when: [
			"Contracts, consent forms and delivery confirmations that need a drawn signature.",
		],
		whenNot: [{ text: "An animated handwritten name.", use: "signature" }],
		responsive: ["The pad keeps a 60:26 ratio and scales strokes with it."],
		performance: [
			"Coalesced pointer events keep fast strokes smooth without extra renders.",
		],
		ai: [
			"Store `value` or the `signatureToSvg` output; strokes are in pad units, independent of size.",
		],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "SignaturePad",
		},
		svelte: {
			entry: "SignaturePad",
		},
	},
	keywords: ["signature", "sign", "pad", "draw", "ink", "pen", "form"],
});
