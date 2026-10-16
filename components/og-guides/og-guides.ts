import { defineComponent } from "@baby-ui/registry-schema";

const MODES = ["light", "dark"];

export const ogGuides = defineComponent({
	slug: "og-guides",
	name: "OG Guides",
	description:
		"A 1200x630 card: a title and body inside crossing edge guides, the mark tucked into the bottom right corner.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: { mode: MODES },
	props: [
		{
			name: "title",
			type: "string",
			description: "Up to two lines, top left.",
			required: true,
			default: "The Foundation for your Design System",
			control: { kind: "text" },
		},
		{
			name: "description",
			type: "string",
			description: "Up to four lines under the title.",
			default:
				"Composable, accessible components with thoughtful defaults. Build your own component library with code you can customize, extend, and make your own.",
			control: { kind: "text" },
		},
		{
			name: "logo",
			type: "string",
			description: "Mark image URL, bottom right inside the guides. PNG, SVG or WebP.",
			control: { kind: "none" },
		},
		{
			name: "mode",
			type: MODES.map((v) => `"${v}"`).join(" | "),
			description: "Light or dark card, independent of the page theme.",
			default: "dark",
			control: { kind: "select", options: MODES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"Four 1px guides sit 64px in from each edge; the copy starts one guide step inside.",
		],
	},
	a11y: {
		keyboard: [],
		notes: ["Rendered to an image: give the meta tag the title as og:image:alt."],
	},
	impl: {
		react: {
			entry: "OgGuides",
			files: [
				{ path: "og-guides/og-guides.tsx", type: "registry:ui" },
				{ path: "og-guides/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "OgGuides",
			files: [
				{ path: "og-guides/og-guides.svelte", type: "registry:ui" },
				{ path: "og-guides/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["og", "open graph", "social card", "design system", "grid", "takumi"],
});
