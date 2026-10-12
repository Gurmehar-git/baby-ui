import { defineComponent } from "../index.ts";

export const clickSpark = defineComponent({
	slug: "click-spark",
	name: "Click Spark",
	description:
		"A burst of short lines wherever the page is pressed, drawn on one fixed canvas.",
	category: "advanced",
	status: "stable",
	variants: { tone: ["foreground", "primary", "muted"], scope: ["page", "parent"] },
	props: [
		{
			name: "tone",
			type: '"foreground" | "primary" | "muted"',
			description: "Spark colour from the theme; it follows light and dark on its own.",
			default: "foreground",
			control: { kind: "select", options: ["foreground", "primary", "muted"] },
		},
		{
			name: "scope",
			type: '"page" | "parent"',
			description:
				"`page` covers the viewport and hears every press; `parent` fills a positioned parent and hears only presses inside it.",
			default: "page",
			control: { kind: "none" },
		},
		{
			name: "count",
			type: "number",
			description: "Lines per burst.",
			default: 8,
			control: { kind: "number", min: 4, max: 16, step: 1 },
		},
		{
			name: "size",
			type: "number",
			description: "Starting line length, px.",
			default: 10,
			control: { kind: "number", min: 4, max: 24, step: 1 },
		},
		{
			name: "radius",
			type: "number",
			description: "How far the lines travel, px.",
			default: 15,
			control: { kind: "number", min: 8, max: 60, step: 1 },
		},
		{
			name: "durationMs",
			type: "number",
			description: "Burst length.",
			default: 400,
			control: { kind: "number", min: 200, max: 1200, step: 50 },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "No bursts.",
		behaviour: [
			"Each primary pointer press draws `count` lines that fly out `radius` px and shrink to nothing over `durationMs`, easing out.",
			"With `page` it listens on the whole document and draws on one fixed, click-through canvas; the frame loop runs only while a burst is alive.",
			"Keyboard-triggered clicks draw nothing, and a tap draws one burst, not two.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Decorative: an empty canvas that assistive tech skips, and it ignores pointer events, so nothing underneath changes.",
		],
	},
	impl: {
		react: {
			entry: "ClickSpark",
			files: [
				{ path: "click-spark/click-spark.tsx", type: "registry:ui" },
				{ path: "click-spark/sparks.ts", type: "registry:ui" },
				{ path: "click-spark/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "ClickSpark",
			files: [
				{ path: "click-spark/click-spark.svelte", type: "registry:ui" },
				{ path: "click-spark/sparks.ts", type: "registry:ui" },
				{ path: "click-spark/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["click", "spark", "cursor", "burst", "effect", "canvas", "splash"],
});
