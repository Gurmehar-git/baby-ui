import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { testimonial as testimonialVariants } from "./variants";

const VARIANTS = ["card", "editorial", "spotlight"];

export const testimonial = defineComponent({
	slug: "testimonial",
	name: "Testimonial",
	description:
		"Composable customer quotes with card, editorial, and pointer-lit variants.",
	category: "blocks",
	status: "stable",
	variants: variantsOf(testimonialVariants, ["variant"]),
	props: [
		{
			name: "variant",
			type: VARIANTS.map((value) => `"${value}"`).join(" | "),
			description: "Layout and material shared by every testimonial part.",
			default: "card",
			control: { kind: "select", options: VARIANTS },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The spotlight appears without an opacity transition.",
		behaviour: [
			"The card and editorial variants remain still so the quote stays primary.",
			"The spotlight variant follows fine-pointer position with a restrained semantic glow.",
		],
	},
	a11y: {
		notes: [
			"Figure, blockquote, and figcaption preserve the quote-author relationship.",
			"Avatar images require useful alt text; fallbacks remain visible on load failure.",
			"The verified mark carries a text alternative and never relies on colour alone.",
		],
	},
	guidance: {
		when: ["A short, attributable customer quote supports a nearby product claim."],
		whenNot: [
			{
				text: "A long case study needs evidence, metrics, and narrative.",
			},
			{ text: "The quote cannot be attributed or verified." },
		],
		responsive: ["Editorial attribution expands to half width on larger containers."],
		performance: [
			"The pointer-lit variant writes two CSS variables without component state.",
		],
		ai: [
			"Compose quote and author parts; never invent a customer statement inside the component.",
			"Use `card` in grids, `editorial` as a focal quote, and `spotlight` for one interactive card.",
		],
	},
	licenseOrigin: {
		source: "sv-chanhdai",
		url: "https://github.com/sv-chanhdai/sv-chanhdai",
		license: "MIT",
		copyright: "Copyright (c) 2026 Sikandar Bhide",
	},
	impl: {
		react: { entry: "Testimonial" },
		svelte: { entry: "Testimonial" },
	},
	keywords: ["testimonial", "quote", "review", "customer", "author"],
});
