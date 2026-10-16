import { defineComponent } from "@baby-ui/registry-schema";

const SIZES = ["sm", "md", "lg"];

export const splitText = defineComponent({
	slug: "split-text",
	name: "Split Text",
	description:
		"Each letter splits top/bottom around the hovered one, fanning out its neighbours.",
	category: "text",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	variants: { size: SIZES },
	props: [
		{
			name: "text",
			type: "string",
			description: "The word to split.",
			control: { kind: "text" },
			default: "BABY UI",
		},
		{
			name: "durationMs",
			type: "number",
			description: "How long the fan-out transition takes.",
			default: 300,
			control: { kind: "number", min: 100, max: 800, step: 50 },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Type scale; `lg` is fluid, 36px up to 128px with the viewport.",
			default: "lg",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The split still applies, just without the ease.",
		behaviour: [
			"Hovering a letter splits it top/bottom by the most; its 1-2 nearest neighbours split by less, falling off with distance.",
		],
	},
	a11y: {
		notes: [
			"The split letters are `aria-hidden`; a single `sr-only` copy carries the real text.",
		],
	},

	impl: {
		react: {
			entry: "SplitText",
			files: [
				{ path: "split-text/split-text.tsx", type: "registry:ui" },
				{ path: "split-text/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "SplitText",
			files: [
				{ path: "split-text/split-text.svelte", type: "registry:ui" },
				{ path: "split-text/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["text", "split", "hover", "hero"],
});
