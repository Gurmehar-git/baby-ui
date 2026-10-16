import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { composer as composerVariants } from "./react/variants";

const SIZES = ["sm", "md", "lg"];

export const composer = defineComponent({
	slug: "composer",
	name: "Composer",
	description:
		"Chat input that grows with content, sends on Enter, and composes a model picker and an actions menu.",
	category: "agents",
	status: "stable",
	variants: variantsOf(composerVariants, ["size"]),
	props: [
		{
			name: "value",
			type: "string",
			description:
				"Draft text. Controlled if you pass it with `onValueChange`, uncontrolled otherwise (seeded from `defaultValue`).",
			control: { kind: "none" },
		},
		{
			name: "placeholder",
			type: "string",
			description: "Field placeholder.",
			default: "Send a message…",
			control: { kind: "text" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Padding and text size of the field.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "minRows",
			type: "number",
			description: "Rows the field starts at.",
			default: 1,
			control: { kind: "number", min: 1, max: 6, step: 1 },
		},
		{
			name: "maxRows",
			type: "number",
			description: "Rows before the field scrolls.",
			default: 8,
			control: { kind: "number", min: 2, max: 16, step: 1 },
		},
		{
			name: "models",
			type: "ComposerModel[]",
			description:
				"Model choices for the built-in picker. Omit (or pass an empty array) to hide it entirely; there is no fictional default list.",
			control: { kind: "none" },
		},
		{
			name: "actions",
			type: "ComposerAction[]",
			description:
				'Quick actions listed behind the leading "+" button. Omit to hide the button entirely.',
			control: { kind: "none" },
		},
		{
			name: "loading",
			type: "boolean",
			description:
				"A send is in flight; the send button becomes a Stop button, wired to `onStop`.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Disable the composer.",
			default: false,
			control: { kind: "boolean" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Unchanged; the field has no motion beyond its own instant height changes.",
		behaviour: [
			"Height follows content with no easing, for the same reason as Textarea: an eased grow lags the caret.",
			'The "+" action-menu glyph rotates 45° while its menu is open, a plain CSS transform, not a spring.',
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter"], action: "Sends" },
			{ keys: ["Shift+Enter"], action: "Inserts a line break" },
		],
		notes: [
			"Enter sends and Shift+Enter breaks the line, the convention every chat client uses. The reverse strands anyone writing more than a sentence.",
			"A composing Enter (committing an IME conversion) never submits, only a plain Enter does.",
			"The send button is disabled while empty, disabled, or loading rather than hidden, so its position never shifts.",
		],
	},
	licenseOrigin: {
		source: "beUI",
		url: "https://beui.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 beUI",
	},
	impl: {
		react: {
			entry: "Composer",
		},
		svelte: {
			entry: "Composer",
		},
	},
	keywords: ["composer", "prompt", "chat", "input"],
});
