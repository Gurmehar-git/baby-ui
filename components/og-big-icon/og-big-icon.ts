import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogBigIcon as ogBigIconVariants } from "./react/variants";

const MODES = ["light", "dark"];

export const ogBigIcon = defineComponent({
	slug: "og-big-icon",
	name: "OG Big Icon",
	description:
		"A 1200x630 card: brand, title and body on the left, one huge icon cropped by the right edge over a faint icon pattern.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogBigIconVariants, ["mode"]),
	props: [
		{
			name: "name",
			type: "string",
			description: "Brand name top left; one line.",
			required: true,
			default: "Lucide",
			control: { kind: "text" },
		},
		{
			name: "title",
			type: "string",
			description: "Up to two lines.",
			required: true,
			default: "Over 1,600 beautiful, consistent icons",
			control: { kind: "text" },
		},
		{
			name: "icon",
			type: "string",
			description:
				"One large icon image URL, cropped by the right edge. Use a dark monochrome glyph: dark mode inverts it.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: "Small caps label under the name.",
			default: "Icons",
			control: { kind: "text" },
		},
		{
			name: "description",
			type: "string",
			description: "Up to three lines under the title.",
			default:
				"Free and open source icons, drawn on one grid so every screen stays visually consistent.",
			control: { kind: "text" },
		},
		{
			name: "logo",
			type: "string",
			description: "Logo image URL beside the name. PNG, SVG or WebP.",
			control: { kind: "none" },
		},
		{
			name: "pattern",
			type: "string[]",
			description:
				"Icon image URLs tiled at 6% behind everything; cycles to fill the card.",
			control: { kind: "none" },
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
			"The big icon is 560px and hangs 120px past the right edge, so it reads as a crop.",
		],
	},
	a11y: {
		keyboard: [],
		notes: ["Rendered to an image: give the meta tag the title as og:image:alt."],
	},
	impl: {
		react: {
			entry: "OgBigIcon",
		},
		svelte: {
			entry: "OgBigIcon",
		},
	},
	keywords: ["og", "open graph", "social card", "icons", "icon library", "takumi"],
});
