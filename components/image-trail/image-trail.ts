import { defineComponent } from "@baby-ui/registry-schema";

const VARIANTS = ["fade", "fall", "shrink"];
const SIZES = ["sm", "md", "lg"];

export const imageTrail = defineComponent({
	slug: "image-trail",
	name: "Image Trail",
	description:
		"Images that spawn along the pointer's path and glide, then leave in the chosen exit style.",
	category: "animated",
	status: "stable",
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "images",
			type: "string[]",
			description: "Image URLs; each one is a pooled element reused round-robin.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Exit style once an image has glided to the pointer.",
			default: "fall",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Size of each trail image.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "threshold",
			type: "number",
			description: "Pointer travel in px between two spawned images.",
			default: 80,
			control: { kind: "number", min: 20, max: 200, step: 10 },
		},
		{
			name: "duration",
			type: "number",
			description: "Lifetime of one image, in ms.",
			default: 1600,
			control: { kind: "number", min: 400, max: 3000, step: 100 },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "No images spawn; the area stays still.",
		behaviour: [
			"An image spawns each time the pointer travels `threshold` px, at the previous spawn point, and glides to the pointer.",
			"After 40% of `duration` it fades, falls out of the area or shrinks away, per `variant`.",
			"Images are a fixed pool reused round-robin; motion is CSS keyframes, so nothing runs while the pointer is still.",
			"Touch and pen drive it through pointer events; vertical page scroll still works.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Trail images are decorative: the layer is aria-hidden and each image has empty alt.",
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
			entry: "ImageTrail",
			files: [
				{ path: "image-trail/image-trail.tsx", type: "registry:ui" },
				{ path: "image-trail/trail.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "ImageTrail",
			files: [
				{ path: "image-trail/image-trail.svelte", type: "registry:ui" },
				{ path: "image-trail/trail.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["images", "trail", "cursor", "pointer", "gallery", "interactive"],
});
