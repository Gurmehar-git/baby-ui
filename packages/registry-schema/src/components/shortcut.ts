import { defineComponent } from "../index.ts";

export const shortcut = defineComponent({
	slug: "shortcut",
	name: "Shortcut",
	description:
		"Key caps for a shortcut that also fires it: the combo clicks the button it sits in.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "shortcut",
			type: "string",
			description:
				"Tokens joined by +, such as cmd+k or shift+enter. Rendered as glyph caps.",
			default: "cmd+n",
			control: { kind: "text", placeholder: "cmd+k" },
		},
		{
			name: "ontrigger",
			type: "(event: KeyboardEvent) => void",
			description:
				"Runs on the combo. Without it, the enclosing button or link is clicked.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"default" | "ghost" | "solid" | "outline"',
			description:
				"Cap treatment. Inside a primary button the cap takes the button's foreground.",
			default: "default",
			control: { kind: "select", options: ["default", "ghost", "solid", "outline"] },
		},
		{
			name: "joined",
			type: "boolean",
			description:
				"One cap instead of a cap per key: glyphs run together (⇧⌘K), word keys take a + (Ctrl+K).",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "size",
			type: '"sm" | "md" | "lg" | "xl"',
			description: "Key cap size.",
			default: "md",
			control: { kind: "select", options: ["sm", "md", "lg", "xl"] },
		},
	],
	a11y: {
		keyboard: [],
		notes: [
			"The glyphs are aria-hidden and a spoken form is provided in visually hidden text, so a screen reader says Command K rather than reading the symbol names.",
			"Single-key combos are ignored while typing in an input or textarea; Enter and Escape still fire from inputs.",
			"Glyphs are rendered as kbd elements, which is what the element is for.",
			"The combo clicks the enclosing button, unless focus is in a text field.",
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
			entry: "Shortcut",
			files: [
				{ path: "shortcut/shortcut.tsx", type: "registry:ui" },
				{ path: "shortcut/variants.ts", type: "registry:ui" },
				{ path: "lib/shortcut-keys.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "Shortcut",
			files: [
				{ path: "shortcut/shortcut.svelte", type: "registry:ui" },
				{ path: "shortcut/variants.ts", type: "registry:ui" },
				{ path: "lib/shortcut-keys.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["shortcut"],
});
