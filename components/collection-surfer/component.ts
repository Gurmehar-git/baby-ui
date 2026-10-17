import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { collectionSurfer as collectionSurferVariants } from "./variants";

const VARIANTS = ["magnetic", "uplift", "simple"];
const SIZES = ["sm", "md", "lg"];

export const collectionSurfer = defineComponent({
	slug: "collection-surfer",
	name: "Collection Surfer",
	description:
		"An endless diagonal line of 3D image cards that glides toward you as you scroll.",
	category: "animated",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	variants: variantsOf(collectionSurferVariants, ["variant", "size"]),
	props: [
		{
			name: "image",
			type: "(props: ImageSlotProps) => ReactNode | Snippet<[ImageSlotProps]>",
			description:
				"Renders each image with `{ src, alt, width?, height?, className?, loading? }`, e.g. through your framework's image component. Defaults to `<img>`.",
			control: { kind: "none" },
		},
		{
			name: "items",
			type: "CollectionSurferItem[]",
			description: "`{ src, alt }`, one card each; the line repeats them endlessly.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Cards near the pointer grow, lift, or stay put.",
			default: "magnetic",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Card size and scroll box height.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "scrollPerItem",
			type: "number",
			description: "Scroll distance in px that moves the line one card forward.",
			default: 300,
			control: { kind: "number", min: 100, max: 800, step: 50 },
		},
		{
			name: "title",
			type: "string",
			description: "Overlay heading; the item count follows it.",
			control: { kind: "text" },
		},
		{
			name: "hint",
			type: "string",
			description: "Corner hint.",
			default: "Scroll to surf",
			control: { kind: "text" },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name of the scroll region.",
			default: "Collection",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The line still follows the scroll one to one, but cards ignore the pointer and nothing eases.",
		behaviour: [
			"The component is its own scroll box. Each card sits one step further right, up and back (0.8, 0.28 and 0.96 card widths) and faces in at -50deg on Y.",
			"Scrolling `scrollPerItem` px moves the line one step; the scroll offset wraps by one loop, so it never ends.",
			"Within 400px of the pointer a card grows up to 1.5x (`magnetic`) or rises up to 100px (`uplift`), easing on `--ease-spring` over 300ms.",
			"Nothing runs between scroll and pointer events.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Arrow keys", "Page Up", "Page Down"], action: "Scrolls the focused box" },
		],
		notes: [
			"The scroll box is a focusable labelled region.",
			"The repeated second set of cards is aria-hidden, so each image is announced once.",
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
			entry: "CollectionSurfer",
		},
		svelte: {
			entry: "CollectionSurfer",
		},
	},
	keywords: ["scroll", "3d", "gallery", "infinite", "images", "collection"],
});
