import { defineComponent } from "@baby-ui/registry-schema";

const DIRECTIONS = ["up", "down", "left", "right"];

export const mirrorText = defineComponent({
	slug: "mirror-text",
	name: "Mirror Text",
	description:
		"Four clipped copies of the text that stagger apart into a motion trail on hover.",
	category: "text",
	status: "stable",
	variants: { direction: DIRECTIONS },
	props: [
		{
			name: "text",
			type: "string",
			description: "The word or phrase to mirror.",
			control: { kind: "text" },
			default: "This is a text",
		},
		{
			name: "as",
			type: "ElementType",
			description: "Tag to render. Defaults to `span`.",
			default: "span",
			control: { kind: "none" },
		},
		{
			name: "direction",
			type: DIRECTIONS.map((v) => `"${v}"`).join(" | "),
			description: "Which way the trailing copies drift apart on hover.",
			default: "up",
			control: { kind: "select", options: DIRECTIONS },
		},
		{
			name: "durationMs",
			type: "number",
			description: "How long each layer's slide takes.",
			default: 500,
			control: { kind: "number", min: 150, max: 1200, step: 50 },
		},
		{
			name: "staggerMs",
			type: "number",
			description: "Delay step between the four stacked layers.",
			default: 67,
			control: { kind: "number", min: 0, max: 200, step: 10 },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The copies still separate on hover, without the ease.",
		behaviour: [
			"Four clipped rows of the same text, each with an increasing transition delay, drift apart on hover to read as a motion trail.",
		],
	},
	a11y: {
		notes: [
			"The four visual rows are `aria-hidden`; a single `sr-only` copy carries the real text once.",
		],
	},

	impl: {
		react: {
			entry: "MirrorText",
			files: [
				{ path: "mirror-text/mirror-text.tsx", type: "registry:ui" },
				{ path: "mirror-text/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "MirrorText",
			files: [
				{ path: "mirror-text/mirror-text.svelte", type: "registry:ui" },
				{ path: "mirror-text/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["text", "mirror", "hover", "trail"],
});
