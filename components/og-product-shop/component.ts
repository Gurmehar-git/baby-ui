import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogProductShop as ogProductShopVariants } from "./variants";

const MODES = ["light", "dark"];
const TONES = ["neutral", "chart", "primary"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const ogProductShop = defineComponent({
	slug: "og-product-shop",
	name: "OG Product Shop",
	description:
		"A 1200x630 product card: product shot on a tinted panel, name, price with sale price, stars, reviews and stock, rendered to PNG with takumi.",
	category: "og-images",
	demo: { mode: "auto", frame: "og" },
	status: "stable",
	variants: variantsOf(ogProductShopVariants, ["mode", "tone"]),
	props: [
		{
			name: "name",
			type: "string",
			description: "Product name; clamps to three lines.",
			required: true,
			default: "Aero Knit Runner",
			control: { kind: "text" },
		},
		{
			name: "image",
			type: "string",
			description: "Product image URL; transparent PNGs sit best on the panel.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "price",
			type: "string",
			description: 'Pre-formatted, e.g. "$129".',
			required: true,
			default: "$129",
			control: { kind: "text" },
		},
		{
			name: "comparePrice",
			type: "string",
			description: "Pre-formatted original price, struck through.",
			default: "$160",
			control: { kind: "text" },
		},
		{
			name: "discount",
			type: "string",
			description: 'Round sticker on the panel, e.g. "-20%".',
			default: "-20%",
			control: { kind: "text" },
		},
		{
			name: "rating",
			type: "number",
			description: "0 to 5, drawn to the nearest half star.",
			default: 4.5,
			control: { kind: "number", min: 0, max: 5, step: 0.5 },
		},
		{
			name: "reviews",
			type: "string",
			description: 'Pre-formatted, e.g. "1,204 reviews".',
			default: "1,204 reviews",
			control: { kind: "text" },
		},
		{
			name: "stock",
			type: "string",
			description: "Availability line with a green dot.",
			default: "In stock",
			control: { kind: "text" },
		},
		{
			name: "badge",
			type: "string",
			description: "Pill on the panel's top left.",
			default: "New arrival",
			control: { kind: "text" },
		},
		{
			name: "store",
			type: "string",
			description: "Store name, top left.",
			control: { kind: "none" },
		},
		{
			name: "logo",
			type: "string",
			description: "Store logo URL beside the name.",
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
			description: "Tint of the product panel and the sale sticker.",
			default: "neutral",
			control: { kind: "select", options: TONES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"Fixed 1200x630 canvas built only from flex layout and theme tokens, so takumi renders it the same as the browser.",
			"`mode` scopes the dark tokens to the card itself, so a dark card renders from a light page and vice versa.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt, usually the name and price.",
		],
	},
	impl: {
		react: {
			entry: "OgProductShop",
		},
		svelte: {
			entry: "OgProductShop",
		},
	},
	keywords: [
		"og",
		"open graph",
		"social card",
		"product",
		"shop",
		"ecommerce",
		"price",
		"takumi",
	],
});
