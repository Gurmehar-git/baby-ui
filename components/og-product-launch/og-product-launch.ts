import { defineComponent } from "@baby-ui/registry-schema";

const MODES = ["light", "dark"];
const TONES = ["neutral", "chart", "primary"];
const LAYOUTS = ["split", "stacked"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const ogProductLaunch = defineComponent({
	slug: "og-product-launch",
	name: "OG Product Launch",
	description:
		"A 1200x630 launch card: filled launch badge, product name, tagline and your screenshot floating as a large rounded shot on a tone gradient.",
	category: "og-images",
	demo: { mode: "auto", frame: "og" },
	status: "beta",
	variants: { mode: MODES, tone: TONES, layout: LAYOUTS },
	props: [
		{
			name: "name",
			type: "string",
			description: "Product name; clamps to two lines (one when stacked).",
			required: true,
			default: "Canvas",
			control: { kind: "text" },
		},
		{
			name: "tagline",
			type: "string",
			description: "Line under the name; clamps to two lines (one when stacked).",
			default: "A shared whiteboard that turns sketches into tickets.",
			control: { kind: "text" },
		},
		{
			name: "badge",
			type: "string",
			description: "Filled launch badge above the name.",
			default: "Now available",
			control: { kind: "text" },
		},
		{
			name: "url",
			type: "string",
			description: "Plain muted line under the tagline; hidden when stacked.",
			default: "acme.dev/canvas",
			control: { kind: "text" },
		},
		{
			name: "screenshot",
			type: "string",
			description:
				"Absolute image URL, cropped from the top into a rounded shot with a soft shadow that bleeds off the canvas.",
			control: { kind: "none" },
		},
		{
			name: "brand",
			type: "string",
			description: "Company name, top left; hidden when stacked.",
			control: { kind: "none" },
		},
		{
			name: "logo",
			type: "string",
			description: "Logo URL beside the brand.",
			control: { kind: "none" },
		},
		{
			name: "mode",
			type: union(MODES),
			description: "Light or dark card, independent of the page theme.",
			default: "light",
			control: { kind: "select", options: MODES },
		},
		{
			name: "tone",
			type: union(TONES),
			description:
				"Colour of the background gradient, the badge and the empty-shot fill.",
			default: "neutral",
			control: { kind: "select", options: TONES },
		},
		{
			name: "layout",
			type: union(LAYOUTS),
			description:
				"`split` floats the shot off the right edge; `stacked` centres the text over it.",
			default: "split",
			control: { kind: "select", options: LAYOUTS },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"Fixed 1200x630 canvas built only from flex layout and theme tokens, so takumi renders it the same as the browser.",
			"The shot bleeds off the canvas edge so it reads large at thumbnail size.",
		],
	},
	a11y: {
		keyboard: [],
		notes: ["Rendered to an image: give the meta tag a matching og:image:alt."],
	},
	impl: {
		react: {
			entry: "OgProductLaunch",
			files: [
				{ path: "og-product-launch/og-product-launch.tsx", type: "registry:ui" },
				{ path: "og-product-launch/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "OgProductLaunch",
			files: [
				{ path: "og-product-launch/og-product-launch.svelte", type: "registry:ui" },
				{ path: "og-product-launch/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["og", "open graph", "social card", "launch", "product", "takumi", "image"],
});
