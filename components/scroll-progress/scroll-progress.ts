import { defineComponent } from "@baby-ui/registry-schema";

const POSITIONS = ["left", "right", "bottom-left", "bottom-right"];

export const scrollProgress = defineComponent({
	slug: "scroll-progress",
	name: "Scroll Progress",
	description:
		"A ruler of ticks that fills as the page or a container scrolls, with a live percentage.",
	category: "blocks",
	status: "stable",
	variants: { position: POSITIONS },
	props: [
		{
			name: "value",
			type: "number",
			description: "Controlled progress, 0 to 100. Omit to follow the scroll position.",
			control: { kind: "none" },
		},
		{
			name: "onValueChange",
			type: "(value: number) => void",
			description: "Fired with the scroll position as it changes.",
			control: { kind: "none" },
		},
		{
			name: "position",
			type: POSITIONS.map((v) => `"${v}"`).join(" | "),
			description: "Edge the rail sits on; the label faces inward.",
			default: "right",
			control: { kind: "select", options: POSITIONS },
		},
		{
			name: "container",
			type: "RefObject<HTMLElement> | HTMLElement",
			description:
				"Track this element's scroll instead of the page. A ref in React, an element in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "tickCount",
			type: "number",
			description: "Ticks on the rail.",
			default: 40,
			control: { kind: "number", min: 10, max: 80, step: 5 },
		},
		{
			name: "height",
			type: "number",
			description: "Rail height in px.",
			default: 160,
			control: { kind: "number", min: 80, max: 320, step: 20 },
		},
		{
			name: "width",
			type: "number",
			description: "Rail width in px.",
			default: 14,
			control: { kind: "number", min: 6, max: 32, step: 2 },
		},
		{
			name: "showLabel",
			type: "boolean",
			description: "Percentage that rides the fill edge.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name of the progress bar.",
			default: "Scroll progress",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Nothing animates; the fill tracks scroll position directly.",
		behaviour: [
			"The solid ticks are clipped to the scrolled share; the label follows the clip edge.",
		],
	},
	a11y: {
		role: "progressbar",
		notes: [
			"aria-valuenow carries the rounded percentage; the ticks and label are hidden.",
		],
	},
	licenseOrigin: {
		source: "iconiq",
		url: "https://iconiqui.com",
		license: "MIT",
		copyright: "Copyright (c) 2024-2026 Edwin Vakayil",
	},
	impl: {
		react: {
			entry: "ScrollProgress",
			files: [
				{ path: "scroll-progress/scroll-progress.tsx", type: "registry:ui" },
				{ path: "scroll-progress/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "ScrollProgress",
			files: [
				{ path: "scroll-progress/scroll-progress.svelte", type: "registry:ui" },
				{ path: "scroll-progress/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["scroll", "progress", "ruler", "ticks", "indicator"],
});
