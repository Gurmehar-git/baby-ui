import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = [
	"wavy",
	"circle",
	"highlight",
	"underline",
	"line",
	"dotted-underline",
	"double-underline",
	"strikethrough",
	"cross-out",
	"arrow",
	"bracket",
	"box",
];
const TONES = [
	"auto",
	"primary",
	"muted",
	"info",
	"success",
	"warning",
	"destructive",
	"accent",
];

export const marker = defineComponent({
	slug: "marker",
	name: "Marker",
	description:
		"Hand-drawn annotations that ink themselves around text as it scrolls into view.",
	category: "text",
	status: "stable",
	variants: { variant: VARIANTS, tone: TONES },
	props: [
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Annotation style.",
			default: "wavy",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Ink colour from the theme; auto picks the style's own.",
			default: "auto",
			control: { kind: "select", options: TONES },
		},
		{
			name: "animate",
			type: "boolean",
			description: "Draw in on first view; off renders the mark finished.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "drawn",
			type: "boolean",
			description:
				"Controlled: whether the mark is drawn, e.g. on hover. Omit to draw on view.",
			control: { kind: "none" },
		},
		{
			name: "durationMs",
			type: "number",
			description: "One stroke's draw time.",
			default: 700,
			control: { kind: "number", min: 200, max: 2000, step: 100 },
		},
		{
			name: "delayMs",
			type: "number",
			description: "Wait before drawing.",
			default: 0,
			control: { kind: "number", min: 0, max: 2000, step: 100 },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The mark renders finished with no draw.",
		behaviour: [
			"Strokes draw along their length over 700ms on cubic-bezier(0.65, 0, 0.35, 1), fading in over the first 300ms.",
			"A style's second stroke starts 160ms after the first.",
			"Highlight sweeps its fill in from the left over 770ms; line and dotted styles sweep over 700ms.",
			"Two SVG turbulence filters rough up the edges so the ink reads hand-drawn.",
		],
	},
	a11y: {
		notes: ["The mark is decorative and hidden; the annotated text reads as normal."],
	},
	licenseOrigin: {
		source: "iconiq",
		url: "https://iconiqui.com",
		license: "MIT",
		copyright: "Copyright (c) 2024-2026 Edwin Vakayil",
	},
	impl: {
		react: {
			entry: "Marker",
			files: [
				{ path: "marker/marker.tsx", type: "registry:ui" },
				{ path: "marker/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "Marker",
			files: [
				{ path: "marker/marker.svelte", type: "registry:ui" },
				{ path: "marker/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: [
		"marker",
		"annotation",
		"highlight",
		"underline",
		"circle",
		"hand-drawn",
		"text",
	],
});
