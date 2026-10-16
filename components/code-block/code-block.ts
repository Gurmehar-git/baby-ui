import { defineComponent } from "@baby-ui/registry-schema";

export const codeBlock = defineComponent({
	slug: "code-block",
	name: "Code Block",
	description:
		"Scrollable code surface with optional line numbers, filename bar and copy.",
	category: "base",
	status: "stable",
	demo: { mode: "auto", frame: "md" },
	props: [
		{
			name: "code",
			type: "string",
			description: "Source to display. Rendered as text, never as HTML.",
			control: { kind: "none" },
		},
		{
			name: "html",
			type: "string",
			description:
				"Pre-highlighted markup from Shiki, highlight.js or similar. `code` remains the copy source.",
			control: { kind: "none" },
		},
		{
			name: "language",
			type: "string",
			description: "Label shown in the filename bar.",
			default: "ts",
			control: { kind: "text" },
		},
		{
			name: "filename",
			type: "string",
			description: "Shows the header bar when set.",
			default: "button.tsx",
			control: { kind: "text" },
		},
		{
			name: "showLineNumbers",
			type: "boolean",
			description: "Prefix each line with its number.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "maxHeight",
			type: "string",
			description: "CSS max-height before the block scrolls.",
			default: "24rem",
			control: { kind: "text" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The copy button appears without the fade.",
		behaviour: [
			"Without a filename the copy button fades in on hover and focus-within, so a wall of blocks is not covered in chrome.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Code is rendered as text nodes, never through innerHTML, so a snippet cannot inject markup.",
			"Line numbers are aria-hidden and unselectable, so copying the block does not pick them up.",
			"Highlighting is deliberately not included: it belongs in a build step, not in a component that ships a parser to the browser.",
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
			entry: "CodeBlock",
			files: [
				{ path: "code-block/code-block.tsx", type: "registry:ui" },
				{ path: "copy-button/copy-button.tsx", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge"],
		},
		svelte: {
			entry: "CodeBlock",
			files: [
				{ path: "code-block/code-block.svelte", type: "registry:ui" },
				{ path: "copy-button/copy-button.svelte", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge"],
		},
	},
	keywords: ["code", "block"],
});
