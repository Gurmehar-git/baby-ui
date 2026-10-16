import { defineComponent } from "@baby-ui/registry-schema";

const MODES = ["light", "dark"];
const TONES = ["neutral", "chart", "primary"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const ogPricing = defineComponent({
	slug: "og-pricing",
	name: "OG Pricing",
	description:
		"A 1200x630 pricing card: plan, big price with period and compare-at, up to four feature ticks and a most popular treatment.",
	category: "og-images",
	demo: { mode: "auto", frame: "og" },
	status: "beta",
	variants: { mode: MODES, tone: TONES },
	props: [
		{
			name: "plan",
			type: "string",
			description: "Plan name above the price; one line.",
			required: true,
			default: "Pro",
			control: { kind: "text" },
		},
		{
			name: "price",
			type: "string",
			description: 'Pre-formatted, e.g. "$29", so the card never guesses a currency.',
			required: true,
			default: "$29",
			control: { kind: "text" },
		},
		{
			name: "features",
			type: "string[]",
			description: "Up to four ticks, each clamped to two lines; extras are dropped.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "period",
			type: "string",
			description: 'Beside the price, e.g. "/month".',
			default: "/month",
			control: { kind: "text" },
		},
		{
			name: "compareAt",
			type: "string",
			description: "Old price, struck through above the period.",
			default: "$39",
			control: { kind: "text" },
		},
		{
			name: "popular",
			type: "string",
			description: "Badge label; passing it adds the tone ring, glow and badge.",
			default: "Most popular",
			control: { kind: "text" },
		},
		{
			name: "note",
			type: "string",
			description: "Small print under the price; clamps to two lines.",
			control: { kind: "none" },
		},
		{
			name: "brand",
			type: "string",
			description: "Company name, top left.",
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
			description: "Colour of the plan name, ticks, ring and glow.",
			default: "neutral",
			control: { kind: "select", options: TONES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"Fixed 1200x630 canvas built only from flex layout and theme tokens, so takumi renders it the same as the browser.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt, e.g. the plan and price.",
		],
	},
	impl: {
		react: {
			entry: "OgPricing",
			files: [
				{ path: "og-pricing/og-pricing.tsx", type: "registry:ui" },
				{ path: "og-pricing/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "OgPricing",
			files: [
				{ path: "og-pricing/og-pricing.svelte", type: "registry:ui" },
				{ path: "og-pricing/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["og", "open graph", "social card", "pricing", "plan", "takumi", "image"],
});
