import { defineComponent } from "../index.ts";

const SIZES = ["sm", "md", "lg"];

export const scrollReveal = defineComponent({
	slug: "scroll-reveal",
	name: "Scroll Reveal",
	description: "Reveals text word by word as an inner container scrolls.",
	category: "text",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	variants: { size: SIZES },
	props: [
		{
			name: "text",
			type: "string",
			description: "The text to reveal word by word as the container scrolls.",
			control: { kind: "text" },
			default: "Scroll to reveal each word of this sentence, one at a time, as you go.",
		},
		{
			name: "minOpacity",
			type: "number",
			description: "Opacity of words not yet reached by the scroll position.",
			default: 0.5,
			control: { kind: "number", min: 0.1, max: 0.9, step: 0.1 },
		},
		{
			name: "blur",
			type: "boolean",
			description: "Also blurs unreached words, sharpening as they're reached.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Type scale.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Every word renders at full opacity, unblurred; the scroll listener still runs but has nothing to fade.",
		behaviour: [
			"One scroll listener sets a single `--sr-progress` custom property on the container; every word derives its own reveal fraction from that with a CSS `calc()`, so no per-word work happens on scroll.",
			"The word list sits in a `sticky` layer while trailing spacer rows give the container scroll length to travel through.",
		],
	},
	a11y: {
		notes: [
			"Every word is real, always-present text (not `aria-hidden`); only its opacity/blur changes, so assistive tech reads the full sentence regardless of scroll position.",
		],
	},

	impl: {
		react: {
			entry: "ScrollReveal",
			files: [
				{ path: "scroll-reveal/scroll-reveal.tsx", type: "registry:ui" },
				{ path: "scroll-reveal/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "ScrollReveal",
			files: [
				{ path: "scroll-reveal/scroll-reveal.svelte", type: "registry:ui" },
				{ path: "scroll-reveal/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["text", "scroll", "reveal", "reading"],
});
