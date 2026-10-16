import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["drift", "fisheye", "gallery"];
const SHAPES = ["square", "rounded"];
const LAYOUTS = ["grid", "staggered"];
const SIZES = ["sm", "md", "lg"];

export const infiniteImageField = defineComponent({
	slug: "infinite-image-field",
	name: "Infinite Image Field",
	description:
		"An endless image field that drifts toward the pointer, or pans by drag through a fisheye or WebGL lens.",
	category: "animated",
	status: "stable",
	demo: { mode: "auto", frame: "lg" },
	variants: { variant: VARIANTS, shape: SHAPES, layout: LAYOUTS, size: SIZES },
	props: [
		{
			name: "items",
			type: "{ src: string; alt: string; title?: string; caption?: string }[]",
			description: "Tiles repeat endlessly; each cell always shows the same item.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`drift` follows the pointer; `fisheye` pans by drag through a 2D lens; `gallery` pans through a WebGL barrel lens with captions.",
			default: "drift",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Height of the field.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "shape",
			type: SHAPES.map((v) => `"${v}"`).join(" | "),
			description: "Drift: tile corners.",
			default: "rounded",
			control: { kind: "select", options: SHAPES },
			showWhen: { variant: ["drift"] },
		},
		{
			name: "layout",
			type: LAYOUTS.map((v) => `"${v}"`).join(" | "),
			description: "Drift: `staggered` offsets every other column by half a tile.",
			default: "grid",
			control: { kind: "select", options: LAYOUTS },
			showWhen: { variant: ["drift"] },
		},
		{
			name: "imageWidth",
			type: "number",
			description:
				"Drift and fisheye: tile width in CSS px. 160 for drift, 150 for fisheye.",
			control: { kind: "number", min: 60, max: 320, step: 10 },
			showWhen: { variant: ["drift", "fisheye"] },
		},
		{
			name: "imageHeight",
			type: "number",
			description:
				"Drift and fisheye: tile height in CSS px. 220 for drift, 180 for fisheye.",
			control: { kind: "number", min: 60, max: 400, step: 10 },
			showWhen: { variant: ["drift", "fisheye"] },
		},
		{
			name: "gap",
			type: "number",
			description:
				"Drift and fisheye: space between tiles in CSS px. 24 for drift, 8 for fisheye.",
			control: { kind: "number", min: 0, max: 64, step: 2 },
			showWhen: { variant: ["drift", "fisheye"] },
		},
		{
			name: "maxSpeed",
			type: "number",
			description: "Drift: top speed in CSS px per frame at 60fps.",
			default: 5,
			control: { kind: "number", min: 1, max: 20, step: 1 },
			showWhen: { variant: ["drift"] },
		},
		{
			name: "smoothing",
			type: "number",
			description: "Drift: how quickly the drift follows the pointer, 0 to 1 per frame.",
			default: 0.07,
			control: { kind: "number", min: 0.01, max: 0.5, step: 0.01 },
			showWhen: { variant: ["drift"] },
		},
		{
			name: "lens",
			type: "number",
			description:
				"Fisheye and gallery: lens strength, 0 is flat. 0.8 magnification for fisheye, 0.08 barrel for gallery.",
			control: { kind: "number", min: 0, max: 2, step: 0.02 },
			showWhen: { variant: ["fisheye", "gallery"] },
		},
		{
			name: "inertia",
			type: "number",
			description: "Fisheye: momentum kept after a drag, 0 to 0.98.",
			default: 0.94,
			control: { kind: "number", min: 0, max: 0.98, step: 0.02 },
			showWhen: { variant: ["fisheye"] },
		},
		{
			name: "captions",
			type: "boolean",
			description: "Fisheye: frame each image with a title and caption row.",
			default: true,
			control: { kind: "boolean" },
			showWhen: { variant: ["fisheye"] },
		},
		{
			name: "cellSize",
			type: "number",
			description: "Gallery: cell size in world units; the view is 2 units tall.",
			default: 0.75,
			control: { kind: "number", min: 0.3, max: 1.5, step: 0.05 },
			showWhen: { variant: ["gallery"] },
		},
		{
			name: "dragZoom",
			type: "number",
			description: "Gallery: how far the view pulls back while dragging; 1 disables it.",
			default: 1.25,
			control: { kind: "number", min: 1, max: 2, step: 0.05 },
			showWhen: { variant: ["gallery"] },
		},
		{
			name: "showHint",
			type: "boolean",
			description: 'Gallery: the "drag to explore" hint.',
			default: true,
			control: { kind: "boolean" },
			showWhen: { variant: ["gallery"] },
		},
		{
			name: "labels",
			type: "Partial<InfiniteImageFieldLabels>",
			description:
				"label: the accessible name and instructions (defaults per variant); hint and loading for the gallery.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Drift is static and arrow keys jump a tile; fisheye and gallery pan without momentum or easing.",
		behaviour: [
			"Drift: the pointer's offset from the centre sets a velocity up to `maxSpeed`, eased by `smoothing`; a dead zone in the middle lets it rest.",
			"Fisheye: drag pans with inertia and arrow keys glide one cell; tiles magnify toward the centre.",
			"Gallery: a WebGL shader draws the grid through a barrel lens and pulls back while dragging; without WebGL it falls back to a plain image grid.",
			"Every engine idles once nothing moves, offscreen or in a hidden tab, and repaints with theme tokens on theme change.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Focuses the field" },
			{ keys: ["Arrow keys"], action: "Drifts or pan" },
			{ keys: ["Home"], action: "Recentres the fisheye" },
		],
		notes: [
			"A labelled region; the canvas is aria-hidden and a visually hidden list names every item.",
		],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "InfiniteImageField",
			files: [
				{ path: "infinite-image-field/infinite-image-field.tsx", type: "registry:ui" },
				{ path: "infinite-image-field/field.ts", type: "registry:ui" },
				{ path: "infinite-image-field/fisheye.ts", type: "registry:ui" },
				{ path: "infinite-image-field/gallery.ts", type: "registry:ui" },
				{ path: "infinite-image-field/labels.ts", type: "registry:ui" },
				{ path: "infinite-image-field/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["spinner"],
		},
		svelte: {
			entry: "InfiniteImageField",
			files: [
				{
					path: "infinite-image-field/infinite-image-field.svelte",
					type: "registry:ui",
				},
				{ path: "infinite-image-field/drift-field.svelte", type: "registry:ui" },
				{ path: "infinite-image-field/fisheye-field.svelte", type: "registry:ui" },
				{ path: "infinite-image-field/gallery-field.svelte", type: "registry:ui" },
				{ path: "infinite-image-field/item-list.svelte", type: "registry:ui" },
				{ path: "infinite-image-field/field.ts", type: "registry:ui" },
				{ path: "infinite-image-field/fisheye.ts", type: "registry:ui" },
				{ path: "infinite-image-field/gallery.ts", type: "registry:ui" },
				{ path: "infinite-image-field/labels.ts", type: "registry:ui" },
				{ path: "infinite-image-field/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["spinner"],
		},
	},
	keywords: [
		"images",
		"field",
		"infinite",
		"drift",
		"fisheye",
		"lens",
		"webgl",
		"canvas",
		"gallery",
		"drag",
	],
});
