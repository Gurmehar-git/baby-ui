import { defineComponent } from "@baby-ui/registry-schema";

export const showMore = defineComponent({
	slug: "show-more",
	name: "Show More",
	description:
		"Clamps long content to a line count and offers an expander only when it overflows.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "lines",
			type: "number",
			description: "Lines of content visible when collapsed.",
			default: 3,
			control: { kind: "number", min: 1, max: 12, step: 1 },
		},
		{
			name: "maxHeight",
			type: "number",
			description: "Cap on the expanded height, in pixels. Past it the region scrolls.",
			default: 320,
			control: { kind: "number", min: 120, max: 800, step: 20 },
		},
		{
			name: "expanded",
			type: "boolean",
			description: "Whether the content is expanded. Bindable.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "moreLabel",
			type: "string",
			description: "Expander label when collapsed.",
			default: "Show more",
			control: { kind: "text" },
		},
		{
			name: "lessLabel",
			type: "string",
			description: "Expander label when expanded.",
			default: "Show less",
			control: { kind: "text" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Height and veil snap; the chevron still turns.",
		behaviour: [
			"A gradient veil at the bottom signals that the text continues. Without it a hard cut reads as the end of the content.",
			"Height animates between the measured collapsed and full heights, so expansion is one movement rather than a jump.",
			"Past maxHeight the expanded region scrolls instead of growing, and the veil stays to show there is more.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Enter", "Space"], action: "Toggles the content" }],
		notes: [
			"The control is only rendered when the content actually overflows, so there is never a Show more that does nothing.",
			"aria-expanded points at the clamped region, and that region only becomes a focusable scroll landmark when it actually scrolls.",
		],
	},
	licenseOrigin: {
		source: "sivir-ui",
		url: "https://github.com/aidan-neel/sivir-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Aidan Neel",
	},
	impl: {
		react: {
			entry: "ShowMore",
			files: [
				{ path: "show-more/show-more.tsx", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge"],
		},
		svelte: {
			entry: "ShowMore",
			files: [
				{ path: "show-more/show-more.svelte", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge"],
		},
	},
	keywords: ["show", "more"],
});
