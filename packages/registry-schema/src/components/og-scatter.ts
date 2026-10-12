import { defineComponent } from "../index.ts";

const MODES = ["light", "dark"];

export const ogScatter = defineComponent({
	slug: "og-scatter",
	name: "OG Scatter",
	description:
		"A 1200x630 brand card: the wordmark in a clearing, ringed by rounded image tiles, some softly blurred.",
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
			default: "lightspark",
			control: { kind: "text" },
		},
		{
			name: "images",
			type: "string[]",
			description: "Image URLs for the seven tiles; they repeat to fill.",
			required: true,
			control: { kind: "none" },
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
			description: "Light or dark card, independent of the page theme.",
			default: "light",
			control: { kind: "select", options: MODES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: ["Tiles sit at fixed slots that keep the centre clear for the wordmark."],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt, usually the brand name.",
		],
	},
	impl: {
		react: {
			entry: "OgScatter",
			files: [
				{ path: "og-scatter/og-scatter.tsx", type: "registry:ui" },
				{ path: "og-scatter/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "OgScatter",
			files: [
				{ path: "og-scatter/og-scatter.svelte", type: "registry:ui" },
				{ path: "og-scatter/variants.ts", type: "registry:ui" },
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
		"collage",
		"images",
		"takumi",
		"image",
	],
});
