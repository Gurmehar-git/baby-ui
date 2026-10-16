import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { ogBlogPost as ogBlogPostVariants } from "./react/variants";

const MODES = ["light", "dark"];
const TONES = ["neutral", "chart", "primary"];
const VARIANTS = ["default", "cover"];

export const ogBlogPost = defineComponent({
	slug: "og-blog-post",
	name: "OG Blog Post",
	description:
		"A 1200x630 blog post card: an editorial hairline layout with a byline, or a centred stack over a faded cover image.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: variantsOf(ogBlogPostVariants, ["variant", "mode", "tone"]),
	props: [
		{
			name: "title",
			type: "string",
			description: "Post title; clamps to three lines (two in `cover`).",
			required: true,
			control: { kind: "text", placeholder: "Post title" },
		},
		{
			name: "site",
			type: "string",
			description: "Publication name; top left, or centred in `cover`.",
			required: true,
			control: { kind: "text", placeholder: "Publication" },
		},
		{
			name: "excerpt",
			type: "string",
			description: "Under the title; clamps to two lines (one in `cover`).",
			control: { kind: "text", placeholder: "Excerpt" },
		},
		{
			name: "category",
			type: "string",
			description:
				"Top right with a tone dot; the muted lead line over the title in `cover`.",
			control: { kind: "text", placeholder: "Category" },
		},
		{
			name: "cover",
			type: "string",
			description: "Image URL faded in under the text in `cover`.",
			control: { kind: "none" },
		},
		{
			name: "author",
			type: "{ name: string; avatar?: string }",
			description: "Byline; the avatar is an image URL.",
			control: { kind: "none" },
		},
		{
			name: "date",
			type: "string",
			description: "Pre-formatted date, so the card never guesses a locale.",
			control: { kind: "none" },
		},
		{
			name: "readingTime",
			type: "string",
			description: 'Pre-formatted, e.g. "6 min read".',
			control: { kind: "none" },
		},
		{
			name: "logo",
			type: "string",
			description: "Publication logo URL beside the name.",
			control: { kind: "none" },
		},
		{
			name: "mode",
			type: MODES.map((v) => `"${v}"`).join(" | "),
			description:
				"Light or dark card, independent of the page theme. Defaults to light.",
			control: { kind: "select", options: MODES },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Colour of the category dot. Defaults to neutral.",
			control: { kind: "select", options: TONES },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Editorial hairline card, or a centred stack over a cover image.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"Fixed 1200x630 canvas built only from flex layout and theme tokens, so takumi renders it the same as the browser.",
			"`cover` uses the JetBrains Mono wordmark; load it in the renderer alongside Inter.",
			"`mode` scopes the dark tokens to the card itself, so a dark card renders from a light page and vice versa.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt, usually the title.",
		],
	},
	impl: {
		react: {
			entry: "OgBlogPost",
		},
		svelte: {
			entry: "OgBlogPost",
		},
	},
	keywords: ["og", "open graph", "social card", "blog", "cover", "takumi", "image"],
});
