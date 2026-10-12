import { defineComponent } from "../index.ts";

const VARIANTS = ["expand", "stack"];
const SIZES = ["sm", "md", "lg"];

const files = (ext: string) => [
	{
		path: `scroll-choreography/scroll-choreography.${ext}`,
		type: "registry:ui" as const,
	},
	{ path: "scroll-choreography/types.ts", type: "registry:ui" as const },
	{ path: "scroll-choreography/variants.ts", type: "registry:ui" as const },
	{ path: "lib/scroll-frame.ts", type: "registry:lib" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

export const scrollChoreography = defineComponent({
	slug: "scroll-choreography",
	name: "Scroll Choreography",
	description:
		"Four images swap corners, stack in the centre, then one grows to fill the frame as you scroll.",
	category: "animated",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "images",
			type: "{ topLeft, topRight, bottomLeft, bottomRight: { src, alt } }",
			description:
				"The four images by starting corner; `topRight` is the one that expands.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`expand` ends with the top-right image filling the frame; `stack` ends on the stack.",
			default: "expand",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Height of the scroll box.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name of the scroll region.",
			default: "Scroll to arrange the images",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The four images hold their starting corners and the box does not scroll.",
		behaviour: [
			"The component is its own scroll box; a CSS view() timeline on the track drives one `--scroll-p` property, with a rAF-throttled scroll listener writing it where timelines are missing.",
			"0 to 30%: top-left and bottom-right swap rows. 35 to 65%: all four slide to the centre. 70 to 90%: the top-right image grows to fill the frame while the others fade out (75 to 85%).",
			"Offsets are in container units, so the choreography scales with the box.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Arrow keys", "Page Up", "Page Down", "Home", "End"],
				action: "Scrolls the focused box",
			},
		],
		notes: [
			"The scroll box is a focusable labelled region; every image keeps its alt text.",
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
			entry: "ScrollChoreography",
			files: files("tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "ScrollChoreography",
			files: files("svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["scroll", "images", "gallery", "choreography", "expand"],
});
