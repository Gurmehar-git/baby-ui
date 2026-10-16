import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { scrollTiltedGrid as scrollTiltedGridVariants } from "./react/variants";

const SIZES = ["sm", "md", "lg", "auto"];
const ASPECTS = ["portrait", "square", "landscape"];
const RADII = ["none", "sm", "md", "lg"];

export const scrollTiltedGrid = defineComponent({
	slug: "scroll-tilted-grid",
	name: "Scroll Tilted Grid",
	description:
		"A two-column image grid whose tiles tilt, blur and dim in 3D as they scroll in and out of view.",
	category: "animated",
	status: "stable",
	variants: variantsOf(scrollTiltedGridVariants, ["size", "aspect", "radius"]),
	props: [
		{
			name: "image",
			type: "(props: ImageSlotProps) => ReactNode | Snippet<[ImageSlotProps]>",
			description:
				"Renders each image with `{ src, alt, width?, height?, className?, loading? }`, e.g. through your framework's image component. Defaults to `<img>`.",
			control: { kind: "none" },
		},
		{
			name: "images",
			type: "{ src: string; alt: string }[]",
			description: "The images, laid out left then right down two columns.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description:
				"Height of its own scroll box; `auto` rides the nearest scrolling ancestor.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "aspect",
			type: ASPECTS.map((v) => `"${v}"`).join(" | "),
			description: "Tile shape.",
			default: "portrait",
			control: { kind: "select", options: ASPECTS },
		},
		{
			name: "radius",
			type: RADII.map((v) => `"${v}"`).join(" | "),
			description: "Tile corner radius.",
			default: "sm",
			control: { kind: "select", options: RADII },
		},
		{
			name: "maxTilt",
			type: "number",
			description: "Largest X tilt in degrees, reached at the edges of the scroll box.",
			default: 62,
			control: { kind: "number", min: 0, max: 80, step: 2 },
		},
		{
			name: "maxBlur",
			type: "number",
			description: "Largest blur in px at the edges.",
			default: 7,
			control: { kind: "number", min: 0, max: 16, step: 1 },
		},
		{
			name: "perspective",
			type: "number",
			description: "CSS perspective on each tile, in px.",
			default: 1000,
			control: { kind: "number", min: 300, max: 2000, step: 100 },
		},
		{
			name: "repeat",
			type: "number",
			description: "How many times the image list repeats down the grid.",
			default: 1,
			control: { kind: "number", min: 1, max: 4, step: 1 },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name of the gallery.",
			default: "Image gallery",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Tiles sit flat and sharp; no scroll-linked motion.",
		behaviour: [
			"Each figure is its own view timeline: tiles are flat mid-view and tilt, lift, skew, blur and dim toward either edge, mirrored per column.",
			"Pure CSS scroll-driven keyframes; browsers without scroll timelines scrub the same paused keyframes from a rAF-throttled scroll listener.",
			"`size` other than `auto` gives it its own scroll box, so it works inside any frame, not only the page.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Focuses the scroll box" },
			{ keys: ["Arrow keys", "Page Up", "Page Down"], action: "Scroll it" },
		],
		notes: ["A labelled region of figures; each image keeps its own alt text."],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "ScrollTiltedGrid",
		},
		svelte: {
			entry: "ScrollTiltedGrid",
		},
	},
	keywords: ["scroll", "gallery", "3d", "tilt", "parallax", "images"],
});
