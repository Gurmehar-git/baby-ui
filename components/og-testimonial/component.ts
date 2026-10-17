import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogTestimonial as ogTestimonialVariants } from "./variants";

const MODES = ["light", "dark"];
const TONES = ["neutral", "chart", "primary"];
const ALIGNS = ["left", "center"];
const union = (values: string[]) => values.map((v) => `"${v}"`).join(" | ");

export const ogTestimonial = defineComponent({
	slug: "og-testimonial",
	name: "OG Testimonial",
	description:
		"A 1200x630 customer quote card: a large quote mark, the quote as the hero, small stars and the author row with an optional logo, rendered to PNG with takumi.",
	category: "og-images",
	demo: { mode: "auto", frame: "og" },
	status: "stable",
	variants: variantsOf(ogTestimonialVariants, ["mode", "tone", "align"]),
	props: [
		{
			name: "quote",
			type: "string",
			description: "The quote; clamps to four lines.",
			required: true,
			default:
				"We replaced three internal libraries in a week, and our designers stopped filing spacing bugs.",
			control: { kind: "text" },
		},
		{
			name: "author",
			type: "{ name: string; role?: string; avatar?: string }",
			description: "Who said it; the avatar is an image URL.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "company",
			type: "string",
			description: "Joined to the role with a middle dot.",
			default: "Acme",
			control: { kind: "text" },
		},
		{
			name: "rating",
			type: "number",
			description: "0 to 5, small stars to the nearest half; omit to hide them.",
			default: 5,
			control: { kind: "number", min: 0, max: 5, step: 0.5 },
		},
		{
			name: "companyLogo",
			type: "string",
			description: "Company logo URL, end of the author row.",
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
				"Accent for the quote mark only; the canvas stays plain in every tone.",
			default: "neutral",
			control: { kind: "select", options: TONES },
		},
		{
			name: "align",
			type: union(ALIGNS),
			description: "`left` aligns the quote and author row left; `center` centres both.",
			default: "left",
			control: { kind: "select", options: ALIGNS },
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
			"Rendered to an image: give the meta tag a matching og:image:alt, usually the quote and author.",
		],
	},
	impl: {
		react: {
			entry: "OgTestimonial",
		},
		svelte: {
			entry: "OgTestimonial",
		},
	},
	keywords: [
		"og",
		"open graph",
		"social card",
		"testimonial",
		"quote",
		"review",
		"takumi",
	],
});
