import { defineComponent } from "@baby-ui/registry-schema";

const SIZES = ["sm", "default", "lg"];
const ORIENTATIONS = ["horizontal", "vertical"];
const VARIANTS = ["default", "line", "overlay"];

export const imageCompare = defineComponent({
	slug: "image-compare",
	name: "Image Compare",
	description:
		"Before and after split by a divider you drag anywhere, with rubber-banded edges and a quarter-turn swing between orientations.",
	category: "advanced",
	status: "stable",
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "before",
			type: "ReactNode | Snippet",
			description:
				"The original, left (or top). Render an image with its own alt; it covers the frame.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "after",
			type: "ReactNode | Snippet",
			description: "The result, right (or bottom).",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "orientation",
			type: ORIENTATIONS.map((v) => `"${v}"`).join(" | "),
			description:
				"`vertical` stacks the images. Changing it swings the divider a quarter turn instead of swapping layouts.",
			default: "horizontal",
			control: { kind: "select", options: ORIENTATIONS },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`default` capsule handle, `line` a small ring on the divider for editorial layouts, `overlay` larger captions.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "hover",
			type: "boolean",
			description:
				"A mouse moves the divider just by hovering, without pressing; touch and pen still drag.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Handle size.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "position",
			type: "number",
			description:
				"Divider position in percent from the left (or top). Controlled with onPositionChange; bindable in Svelte.",
			default: 50,
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "[string, string] | false",
			description: "Captions over each side; they fade as the divider reaches them.",
			default: '["Before", "After"]',
			control: { kind: "none" },
		},
		{
			name: "aspectRatio",
			type: "string",
			description: "Frame proportions, as a CSS aspect-ratio.",
			default: "3 / 2",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The divider jumps to taps and keys, edges stop dead and orientation changes swap at once.",
		behaviour: [
			"A drag moves the divider 1:1 and leaves it where released; past an edge it rubber-bands and springs back.",
			"A press on the photo springs the divider to the press, then follows the pointer without trailing it.",
			"On touch a press on the photo waits for a sideways move, so a vertical swipe still scrolls the page.",
			"Changing orientation swings the divider a quarter turn about its pivot while the clip follows it.",
			"The handle slows near the frame's edge so it is never cut off; captions fade as the divider reaches them.",
		],
	},
	a11y: {
		role: "slider",
		keyboard: [
			{ keys: ["Arrow keys"], action: "Move the divider 1%" },
			{
				keys: ["Shift+Arrow keys", "Page Up", "Page Down"],
				action: "Move the divider 10%",
			},
			{ keys: ["Home", "End"], action: "Reveal the after or before image fully" },
		],
		notes: [
			'The handle is a slider whose value is the share of the after image, read as "62% after".',
			"Focus that follows a pointer shows no ring until a key is pressed.",
			"Captions are decorative (aria-hidden); the images carry their own alt text.",
		],
	},
	guidance: {
		when: [
			"Showing what an edit, filter or redesign changed on the same frame.",
			"Before and after photos that line up pixel for pixel.",
		],
		whenNot: [
			{
				text: "Images of different subjects or crops: the divider only helps when they align.",
			},
			{ text: "Browsing several images in turn.", use: "carousel" },
		],
		responsive: [
			"The frame keeps `aspectRatio` at any width; the divider position is a percentage, so a resize never moves it.",
			"Use `vertical` on narrow screens when the subject is wider than it is tall.",
		],
		performance: [
			"Both images stay mounted; dragging only writes a clip-path and transforms, without re-rendering the images.",
		],
		ai: [
			"Give both images the same dimensions and their own alt text; size them to cover the frame.",
			"Use `position` with `onPositionChange` only when something else needs the value; otherwise leave it uncontrolled.",
		],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "ImageCompare",
			files: [
				{ path: "image-compare/image-compare.tsx", type: "registry:ui" },
				{ path: "image-compare/compare.ts", type: "registry:ui" },
				{ path: "image-compare/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "ImageCompare",
			files: [
				{ path: "image-compare/image-compare.svelte", type: "registry:ui" },
				{ path: "image-compare/compare.ts", type: "registry:ui" },
				{ path: "image-compare/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["image", "compare", "before", "after", "slider", "media"],
});
