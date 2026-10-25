import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { showcaseCard as showcaseCardVariants } from "./variants";

const VARIANTS = ["solid", "translucent", "morphing"];
const SIZES = ["sm", "default", "lg"];

export const showcaseCard = defineComponent({
	slug: "showcase-card",
	name: "Showcase Card",
	description:
		"A preview-first link card with solid, translucent and focus-safe morphing footer treatments.",
	category: "advanced",
	status: "experimental",
	variants: variantsOf(showcaseCardVariants, ["variant", "size"]),
	props: [
		{
			name: "variant",
			type: VARIANTS.map((variant) => `"${variant}"`).join(" | "),
			description:
				"An in-flow solid footer, a persistent translucent overlay, or a preview-first footer revealed on hover and focus.",
			default: "solid",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((size) => `"${size}"`).join(" | "),
			description: "Footer density and type scale.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The framed card stops interpolating its internal rows; the morphing footer changes visibility immediately.",
		behaviour: [
			"The morphing footer rises 8px while its row opens on pointer hover or keyboard focus.",
			"The preview yields space inside the fixed framed card without changing the card's outer size.",
			"On devices without hover the morphing footer stays visible, so its title is never hidden behind an unavailable interaction.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Tab", "Enter"], action: "Focus and follow ShowcaseCardLink" }],
		notes: [
			"ShowcaseCardLink is a real overlay link and needs an accessible name; footer actions are sibling controls above it, never nested inside it.",
			"Keyboard focus reveals the morphing footer exactly as hover does.",
			"The title remains visible on touch and reduced-motion configurations.",
		],
	},
	guidance: {
		when: [
			"Visual catalogs, templates and portfolios where the preview is the primary content.",
			"A whole card navigates somewhere while one optional footer action remains independently interactive.",
		],
		whenNot: [
			{ text: "A text-first content group with several actions.", use: "card" },
			{ text: "A disclosure that expands to reveal details.", use: "expandable-card" },
		],
		responsive: [
			"The card fills its parent; the parent owns columns and height.",
			"Morphing becomes a persistent footer on devices that cannot hover.",
		],
		performance: [
			"Only the framed card's internal row and footer opacity/translation animate; its fixed outer size never shifts the surrounding layout.",
		],
		ai: [
			"Compose Preview, Footer, Copy, Title and Description inside ShowcaseCard, then add one ShowcaseCardLink as a sibling overlay.",
			"Put independent buttons inside ShowcaseCardAction so they sit above the overlay link without nesting interactive elements.",
		],
	},
	impl: {
		react: { entry: "ShowcaseCard" },
		svelte: { entry: "ShowcaseCard" },
	},
	keywords: ["card", "showcase", "preview", "catalog", "gallery", "hover", "morph"],
});
