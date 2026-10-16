import { defineComponent } from "@baby-ui/registry-schema";

const MODES = ["light", "dark"];

export const ogSoftFocus = defineComponent({
	slug: "og-soft-focus",
	name: "OG Soft Focus",
	description:
		"A 1200x630 brand card: the wordmark on a soft, out-of-focus dark form with ripple rings on grey.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: { mode: MODES },
	props: [
		{
			name: "name",
			type: "string",
			description: "Brand name, set as the wordmark; one line.",
			required: true,
			default: "Polar",
			control: { kind: "text" },
		},
		{
			name: "logo",
			type: "string",
			description: "Logo image URL beside the name. PNG, SVG or WebP.",
			control: { kind: "none" },
		},
		{
			name: "tagline",
			type: "string",
			description: "One quiet line under the wordmark.",
			control: { kind: "text", placeholder: "Tagline" },
		},
		{
			name: "mode",
			type: MODES.map((v) => `"${v}"`).join(" | "),
			description: "Light inverts to a pale form on dark grey.",
			default: "light",
			control: { kind: "select", options: MODES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"Blur, repeating radial gradients and masks only, so takumi renders it the same as the browser.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt, usually the brand name.",
		],
	},
	impl: {
		react: {
			entry: "OgSoftFocus",
			files: [
				{ path: "og-soft-focus/og-soft-focus.tsx", type: "registry:ui" },
				{ path: "og-soft-focus/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "OgSoftFocus",
			files: [
				{ path: "og-soft-focus/og-soft-focus.svelte", type: "registry:ui" },
				{ path: "og-soft-focus/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: [
		"og",
		"open graph",
		"social card",
		"brand",
		"blur",
		"wordmark",
		"takumi",
		"image",
	],
});
