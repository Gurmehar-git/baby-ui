import { defineComponent } from "@baby-ui/registry-schema";

export const fileDiff = defineComponent({
	slug: "file-diff",
	name: "File Diff",
	description: "Unified diff with added and removed lines carried by more than colour.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "filename",
			type: "string",
			description: "Path shown in the header.",
			default: "src/button.tsx",
			control: { kind: "text" },
		},
		{
			name: "lines",
			type: "DiffLine[]",
			description: "Lines in order, each tagged add, remove or context.",
			control: { kind: "none" },
		},
		{
			name: "showLineNumbers",
			type: "boolean",
			description: "Prefix each line with its number.",
			default: true,
			control: { kind: "boolean" },
		},
	],
	a11y: {
		keyboard: [],
		notes: [
			"Each changed line carries a visually hidden Added or Removed prefix, so the diff is not conveyed by colour alone.",
			"The plus and minus markers are aria-hidden because the hidden prefix already says it.",
			"Line numbers and markers are unselectable, so copying a hunk gives you the code.",
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
			entry: "FileDiff",
		},
		svelte: {
			entry: "FileDiff",
		},
	},
	keywords: ["file", "diff"],
});
