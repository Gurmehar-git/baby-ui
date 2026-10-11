import { defineComponent } from "../index.ts";

const VARIANTS = ["default", "muted"];
const SIZES = ["sm", "md", "lg"];
const EFFECTS = ["fade", "blur", "rise", "settle", "wipe"];

export const markdown = defineComponent({
	slug: "markdown",
	name: "Markdown",
	description:
		"CommonMark and GFM from a string, static or streamed in word by word for AI answers.",
	category: "base",
	status: "stable",
	isUpdated: true,
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "content",
			type: "string",
			description:
				"Markdown source. While streaming, pass the whole text so far on every update.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Body text colour. Headings, links and code stay foreground.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Prose scale: body text, heading sizes and block spacing.",
			default: "md",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "streaming",
			type: "boolean",
			description:
				"`true` while chunks arrive, `false` once done. Leave unset for static text, which also renders on the server.",
			control: { kind: "none" },
		},
		{
			name: "animate",
			type: `boolean | ${EFFECTS.map((v) => `"${v}"`).join(" | ")}`,
			description:
				"How new words enter while streaming. `true` fades; `false` turns it off.",
			default: "fade",
			control: { kind: "select", options: EFFECTS },
		},
		{
			name: "caret",
			type: "boolean",
			description: "Blinking caret after the last word while streaming.",
			default: true,
			control: { kind: "boolean" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Words appear without entry motion and the caret stops blinking.",
		behaviour: [
			"Only appended text animates; finished blocks are parsed once and never re-enter.",
			"Half-written syntax is repaired while streaming, so `**bold` renders bold before it closes.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Raw HTML is escaped and `javascript:` URLs are dropped, so untrusted markdown cannot inject markup.",
			"`aria-busy` is set while streaming, so assistive tech waits for the answer to settle.",
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
			entry: "Markdown",
			files: [
				{ path: "markdown/markdown.tsx", type: "registry:ui" },
				{ path: "markdown/motion.ts", type: "registry:ui" },
				{ path: "markdown/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["@docvia/markdown", "clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "Markdown",
			files: [
				{ path: "markdown/markdown.svelte", type: "registry:ui" },
				{ path: "markdown/motion.ts", type: "registry:ui" },
				{ path: "markdown/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["@docvia/markdown", "clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["markdown", "prose", "streaming", "gfm", "ai"],
});
