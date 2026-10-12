import { defineComponent } from "../index.ts";

const MODES = ["light", "dark"];
const TONES = ["chart", "primary", "neutral"];

export const ogAppTile = defineComponent({
	slug: "og-app-tile",
	name: "OG App Tile",
	description:
		"A 1200x630 card: the logo on a raised app tile with a soft glow, the name and a line of description below.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: { mode: MODES, tone: TONES },
	props: [
		{
			name: "name",
			type: "string",
			description: "App or product name; one line.",
			required: true,
			default: "Raycast",
			control: { kind: "text" },
		},
		{
			name: "logo",
			type: "string",
			description: "Logo image URL, set inside the tile. PNG, SVG or WebP.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "description",
			type: "string",
			description: "Up to two lines under the name.",
			default: "Your shortcut to everything.",
			control: { kind: "text" },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Colour of the glow behind the tile.",
			default: "chart",
			control: { kind: "select", options: TONES },
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
		behaviour: [
			"The glow is a blurred ellipse offset to the tile's right, so it reads as light, not a shadow.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag the name and description as og:image:alt.",
		],
	},
	impl: {
		react: {
			entry: "OgAppTile",
			files: [
				{ path: "og-app-tile/og-app-tile.tsx", type: "registry:ui" },
				{ path: "og-app-tile/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "OgAppTile",
			files: [
				{ path: "og-app-tile/og-app-tile.svelte", type: "registry:ui" },
				{ path: "og-app-tile/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["og", "open graph", "social card", "app", "icon", "tile", "takumi"],
});
