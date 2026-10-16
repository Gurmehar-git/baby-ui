import { defineComponent } from "@baby-ui/registry-schema";

export const wheelCarousel = defineComponent({
	slug: "wheel-carousel",
	name: "Wheel Carousel",
	description:
		"Labels on a turning wheel beside a crossfading photo; scroll, drag or click to spin it.",
	category: "advanced",
	status: "stable",
	variants: {
		photoSide: ["left", "right"],
		aspect: ["3/4", "1/1", "4/3", "3/2"],
		size: ["sm", "default", "lg"],
	},
	props: [
		{
			name: "items",
			type: "WheelCarouselItem[]",
			description: "label, image and optional imageAlt per stop on the wheel.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "activeIndex",
			type: "number",
			description:
				"Selected item. Controlled with onActiveIndexChange (React) or bindable (Svelte).",
			control: { kind: "none" },
		},
		{
			name: "photoSide",
			type: '"left" | "right"',
			description: "Which side the photo sits on.",
			default: "left",
			control: { kind: "select", options: ["left", "right"] },
		},
		{
			name: "aspect",
			type: '"3/4" | "1/1" | "4/3" | "3/2"',
			description: "Photo aspect ratio.",
			default: "3/4",
			control: { kind: "select", options: ["3/4", "1/1", "4/3", "3/2"] },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg"',
			description: "Label size and minimum height.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg"] },
		},
		{
			name: "visibleItems",
			type: "number",
			description: "Labels drawn either side of the selected one.",
			default: 7,
			control: { kind: "number", min: 3, max: 10, step: 1 },
		},
		{
			name: "spacing",
			type: "number",
			description: "Degrees between neighbouring labels.",
			default: 14,
			control: { kind: "number", min: 8, max: 24, step: 1 },
		},
		{
			name: "radius",
			type: "number",
			description: "Distance from the apex to the wheel's centre, px.",
			default: 320,
			control: { kind: "number", min: 160, max: 600, step: 20 },
		},
		{
			name: "scrollSpeed",
			type: "number",
			description:
				"Rotation per wheel pixel. 0 leaves page scroll alone while the pointer is over it.",
			default: 0.008,
			control: { kind: "none" },
		},
		{
			name: "snap",
			type: "boolean",
			description: "Settle on the nearest label after a spin.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "momentum",
			type: "boolean",
			description: "Keep spinning after a flick, decaying to a stop.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "showMarker",
			type: "boolean",
			description: "Dot at the apex marking the selected label.",
			default: true,
			control: { kind: "boolean" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "No momentum or easing: the wheel snaps straight to each label.",
		behaviour: [
			"Labels sit on a circle: each steps `spacing` degrees round, fades on a cosine and shrinks 4% per step from the apex.",
			"A flick keeps spinning with momentum, then eases onto the nearest label; a click on a label turns the wheel to it.",
			"The photo crossfades over 280ms, the new one scaling down from 104%.",
			"The wheel draws only while it moves; transforms are written directly, not re-rendered.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Focuses the wheel" },
			{ keys: ["Arrow keys"], action: "Moves one label" },
			{ keys: ["Home", "End"], action: "Jumps to the first and last" },
		],
		notes: [
			"A listbox of options with aria-activedescendant; a polite live region announces the label and its position.",
			"Scroll capture can be turned off with scrollSpeed 0 so the page keeps scrolling over it.",
		],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://github.com/harshjadhav/componentry",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "WheelCarousel",
			files: [
				{ path: "wheel-carousel/wheel-carousel.tsx", type: "registry:ui" },
				{ path: "wheel-carousel/wheel.ts", type: "registry:ui" },
				{ path: "wheel-carousel/types.ts", type: "registry:ui" },
				{ path: "wheel-carousel/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "WheelCarousel",
			files: [
				{ path: "wheel-carousel/wheel-carousel.svelte", type: "registry:ui" },
				{ path: "wheel-carousel/wheel.ts", type: "registry:ui" },
				{ path: "wheel-carousel/types.ts", type: "registry:ui" },
				{ path: "wheel-carousel/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["carousel", "wheel", "picker", "gallery", "scroll", "drag", "rotary"],
});
