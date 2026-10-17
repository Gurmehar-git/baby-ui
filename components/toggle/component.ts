import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { toggleButton as toggleButtonVariants } from "./variants";

export const toggle = defineComponent({
	slug: "toggle",
	name: "Toggle",
	description: "Two-state button that stays pressed, for formatting and view switches.",
	category: "base",
	status: "stable",
	variants: variantsOf(toggleButtonVariants, ["variant", "size"]),
	props: [
		{
			name: "pressed",
			type: "boolean",
			description: "Pressed state. Bindable.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "variant",
			type: '"default" | "outline" | "primary"',
			description:
				"`outline` keeps a field-style border at rest, so the toggle reads as a button; `primary` shows the pressed state in the brand tint, for toolbar emphasis.",
			default: "default",
			control: { kind: "select", options: ["default", "outline", "primary"] },
		},
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description: "Control size.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
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
			description: "Accessible name when the content is an icon.",
			default: "Bookmark",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The press scale is removed; the background change stays.",
		behaviour: [
			"Presses to 0.97 like every other button here, so a toggle does not feel different from the buttons beside it.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Space", "Enter"], action: "Toggles" }],
		notes: [
			"aria-pressed, not aria-checked: this is a button that stays down, not a checkbox.",
			"An icon-only toggle needs `label`, or it is announced as an unnamed button.",
			"State is delegated to Base UI (React) and bits-ui (Svelte); this component only owns the classes and data-slots.",
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
			entry: "Toggle",
		},
		svelte: {
			entry: "Toggle",
		},
	},
	keywords: ["toggle"],
});
