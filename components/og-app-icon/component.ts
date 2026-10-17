import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogAppIcon as ogAppIconVariants } from "./variants";

const MODES = ["light", "dark"];

export const ogAppIcon = defineComponent({
	slug: "og-app-icon",
	name: "OG App Icon",
	description:
		"A 1200x630 card: one large app icon centred, on a faint doodle field in light or a plain field in dark.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogAppIconVariants, ["mode"]),
	props: [
		{
			name: "logo",
			type: "string",
			description: "Glyph image URL drawn on the tile; a white glyph reads best.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "color",
			type: "string",
			description: "Tile fill, any CSS colour; the brand colour reads best.",
			required: true,
			default: "#5E6AD2",
			control: { kind: "color" },
		},
		{
			name: "mode",
			type: MODES.map((v) => `"${v}"`).join(" | "),
			description: "Light adds the doodle scatter; dark keeps the field plain.",
			default: "light",
			control: { kind: "select", options: MODES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"The tile gets a 160deg white sheen and a soft drop, so a flat brand colour reads as an icon.",
			"Doodles are hand-placed, never under the tile.",
		],
	},
	a11y: {
		keyboard: [],
		notes: ["Rendered to an image: give the meta tag the app name as og:image:alt."],
	},
	impl: {
		react: {
			entry: "OgAppIcon",
		},
		svelte: {
			entry: "OgAppIcon",
		},
	},
	keywords: ["og", "open graph", "social card", "app icon", "brand", "takumi"],
});
