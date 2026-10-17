import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { splitButton as splitButtonVariants } from "./variants";

const VARIANTS = ["default", "secondary", "outline"];
const SIZES = ["sm", "default", "lg"];

export const splitButton = defineComponent({
	slug: "split-button",
	name: "Split Button",
	description:
		"A primary action with a chevron that opens related actions, built from Button Group and Dropdown Menu.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(splitButtonVariants, ["variant", "size"]),
	props: [
		{
			name: "label",
			type: "string",
			description: "The primary action's label.",
			required: true,
			control: { kind: "text" },
		},
		{
			name: "onClick",
			type: "() => void",
			description: "Runs the primary action (`onclick` in Svelte).",
			control: { kind: "none" },
		},
		{
			name: "actions",
			type: "SplitButtonAction[]",
			description:
				"Related actions: `{ label, onSelect, icon?, destructive?, disabled? }`.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "menuLabel",
			type: "string",
			description: "Accessible name of the chevron.",
			default: "More options",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Button look for both segments; filled variants get a hairline divider.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Button size for both segments.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The chevron flips without turning.",
		behaviour: [
			"The chevron turns while the menu is open; the menu opens with the shared anchored motion.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Enter", "Space"],
				action: "Run the primary action, or open the menu from the chevron",
			},
			{ keys: ["ArrowDown", "ArrowUp"], action: "Move through the menu" },
		],
		notes: [
			"Two real buttons in a group; the chevron is named by `menuLabel` and owns a menu.",
		],
	},
	guidance: {
		when: [
			"A main action with a few close alternatives: Save and Save as, Merge and Squash and merge.",
		],
		whenNot: [
			{ text: "Actions of equal weight.", use: "button-group" },
			{ text: "Only a menu with no default action.", use: "dropdown-menu" },
		],
		responsive: ["Keeps its natural width."],
		performance: ["The menu mounts only while open."],
		ai: [
			"Keep the label to the most common action and put alternatives in `actions`.",
			"Mark irreversible alternatives `destructive: true`.",
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
			entry: "SplitButton",
		},
		svelte: {
			entry: "SplitButton",
		},
	},
	keywords: ["split", "button", "menu", "dropdown", "actions"],
});
