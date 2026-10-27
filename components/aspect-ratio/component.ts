import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { aspectRatio as aspectRatioVariants } from "./variants";

export const aspectRatio = defineComponent({
	slug: "aspect-ratio",
	name: "Aspect Ratio",
	description:
		"Responsive media frame that preserves proportions and can morph between ratios.",
	category: "base",
	status: "beta",
	variants: variantsOf(aspectRatioVariants, ["motion", "fit"]),
	props: [
		{
			name: "ratio",
			type: "number",
			description: "Width divided by height. Must be finite and positive.",
			default: 1,
			control: { kind: "number", min: 0.5, max: 2.4, step: 0.1 },
		},
		{
			name: "motion",
			type: '"smooth" | "spring" | "none"',
			description: "How the frame responds when ratio changes.",
			default: "smooth",
			control: { kind: "select", options: ["smooth", "spring", "none"] },
		},
		{
			name: "fit",
			type: '"cover" | "contain"',
			description: "How AspectRatioImage fits inside the frame.",
			default: "cover",
			control: { kind: "select", options: ["cover", "contain"] },
		},
	],
	motion: {
		springs: ["bouncy"],
		reducedMotion: "Ratio changes apply instantly; the image keeps its final crop.",
		behaviour: [
			"Smooth transitions the native aspect-ratio property over 250ms; spring uses the shared 600ms sampled CSS spring.",
			"The image remains a full-size cover or contain layer while the frame reshapes, so pixels crop instead of stretching.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The frame adds no role or interaction; semantics come from its children.",
			"AspectRatioImage requires alt text and intrinsic width and height.",
		],
	},
	guidance: {
		when: [
			"Media cards and embeds that must reserve stable proportions before content loads.",
			"Editors where the viewer changes a crop or output ratio in place.",
		],
		whenNot: [
			{ text: "Content whose height should follow its text; use ordinary flow." },
		],
		responsive: [
			"The frame is always 100% of its container width; ratio determines height.",
		],
		performance: [
			"No ResizeObserver or animation JavaScript; the browser owns layout and interpolation.",
		],
		ai: [
			"Pass ratio as width divided by height, such as 16 / 9.",
			"Use AspectRatioImage for media; keep interactive overlays as ordinary children.",
		],
	},
	licenseOrigin: {
		source: "beUI",
		url: "https://github.com/starc007/ui-components",
		license: "MIT",
		copyright: "Copyright (c) 2026 Saurabh Chauhan",
	},
	impl: {
		react: { entry: "AspectRatio" },
		svelte: { entry: "AspectRatio" },
	},
	keywords: ["aspect ratio", "responsive media", "image", "crop", "video"],
});
