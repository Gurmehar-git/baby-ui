import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { revealText as revealTextVariants } from "./react/variants";

const SIZES = ["inherit", "sm", "md", "lg"];
const VARIANTS = ["default", "tracking", "wipe"];
const SPLITS = ["word", "char", "line"];
const DIRECTIONS = ["up", "down", "left", "right"];
const ORIGINS = ["start", "end", "center", "edges", "random"];
const TRIGGERS = ["mount", "view"];

export const revealText = defineComponent({
	slug: "reveal-text",
	name: "Reveal Text",
	description:
		"Words or letters rise out of a blur one after another, on mount or in view.",
	category: "text",
	status: "stable",
	variants: variantsOf(revealTextVariants, [
		"variant",
		"split",
		"trigger",
		"direction",
		"staggerFrom",
		"size",
	]),
	props: [
		{
			name: "text",
			type: "string | string[]",
			description: "One string, or one per line.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`default` rises units out of a blur; `tracking` letters converge from loose spacing; `wipe` uncovers the text through a soft edge.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "split",
			type: SPLITS.map((v) => `"${v}"`).join(" | "),
			description: "Stagger by line, word or letter.",
			default: "word",
			control: { kind: "select", options: SPLITS },
		},
		{
			name: "trigger",
			type: TRIGGERS.map((v) => `"${v}"`).join(" | "),
			description: "Reveal on mount, or when scrolled into view.",
			default: "mount",
			control: { kind: "select", options: TRIGGERS },
		},
		{
			name: "once",
			type: "boolean",
			description: 'With trigger="view": reveal only the first time.',
			default: true,
			control: { kind: "boolean" },
			showWhen: { trigger: ["view"] },
		},
		{
			name: "revealed",
			type: "boolean",
			description: "Controlled: whether the text shows. Omit to follow trigger.",
			control: { kind: "none" },
		},
		{
			name: "onRevealedChange",
			type: "(revealed: boolean) => void",
			description: "Fired when the trigger reveals or hides the text.",
			control: { kind: "none" },
		},
		{
			name: "staggerMs",
			type: "number",
			description: "Gap between units.",
			default: 90,
			control: { kind: "number", min: 10, max: 300, step: 10 },
		},
		{
			name: "delayMs",
			type: "number",
			description: "Wait before the first unit.",
			default: 0,
			control: { kind: "number", min: 0, max: 1000, step: 50 },
		},
		{
			name: "blur",
			type: "number",
			description: "Starting blur in px; skipped on touch screens.",
			default: 12,
			control: { kind: "number", min: 0, max: 24, step: 2 },
		},
		{
			name: "direction",
			type: DIRECTIONS.map((v) => `"${v}"`).join(" | "),
			description: "The side each unit travels in from.",
			default: "up",
			control: { kind: "select", options: DIRECTIONS },
		},
		{
			name: "staggerFrom",
			type: ORIGINS.map((v) => `"${v}"`).join(" | "),
			description:
				"Where the stagger wave starts; random is seeded, so it is the same every run.",
			default: "start",
			control: { kind: "select", options: ORIGINS },
		},
		{
			name: "mask",
			type: "boolean",
			description:
				"Clip each unit so it rises out of its own line box instead of floating in.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Type scale; inherit takes the surrounding text size.",
			default: "inherit",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "as",
			type: "string",
			description: "Element to render.",
			default: "span",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Units only fade, over 250ms, with a third of the stagger.",
		behaviour: [
			"Each unit rises 40% of its height, fades in and unblurs over 900ms on cubic-bezier(0.16, 1, 0.3, 1), 90ms after the one before.",
			"Leaving view with once off hides the text instantly so the next entry replays.",
			"`tracking` splits by letter and slides each one in from its word's centre; `wipe` sweeps a feathered mask across the whole text.",
		],
	},
	a11y: {
		notes: ["Screen readers get the whole text once; the split units are hidden."],
	},
	licenseOrigin: {
		source: "iconiq",
		url: "https://iconiqui.com",
		license: "MIT",
		copyright: "Copyright (c) 2024-2026 Edwin Vakayil",
	},
	impl: {
		react: {
			entry: "RevealText",
		},
		svelte: {
			entry: "RevealText",
		},
	},
	keywords: ["reveal", "stagger", "blur", "scroll", "words", "letters"],
});
