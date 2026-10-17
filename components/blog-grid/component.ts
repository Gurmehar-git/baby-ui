import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { blogGrid as blogGridVariants } from "./variants";

const VARIANTS = ["featured", "grid"];

export const blogGrid = defineComponent({
	slug: "blog-grid",
	name: "Blog Grid",
	description:
		"A blog index with category filters, a featured post and paged cards, plus an in-place reader whose image morphs out of its card.",
	category: "blocks",
	status: "stable",
	variants: variantsOf(blogGridVariants, ["variant"]),
	props: [
		{
			name: "image",
			type: "(props: ImageSlotProps) => ReactNode | Snippet<[ImageSlotProps]>",
			description:
				"Renders each image with `{ src, alt, width?, height?, className?, loading? }`, e.g. through your framework's image component. Defaults to `<img>`.",
			control: { kind: "none" },
		},
		{
			name: "posts",
			type: "BlogPost[]",
			description:
				"Posts with id, title, excerpt, category, ISO date, readTime, author, optional image and body.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Lead page one with a wide featured card, or keep every card equal.",
			default: "featured",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "categories",
			type: "string[]",
			description:
				'Filter labels in order, after "All". Defaults to the posts\' categories.',
			control: { kind: "none" },
		},
		{
			name: "category",
			type: "string",
			description: "Active filter. Controlled with onCategoryChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "page",
			type: "number",
			description: "One-based page. Controlled with onPageChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "pageSize",
			type: "number",
			description: "Cards per page below the featured post.",
			default: 6,
			control: { kind: "none" },
		},
		{
			name: "getHref",
			type: "(post: BlogPost) => string",
			description: "Turns cards into links and switches the in-place reader off.",
			control: { kind: "none" },
		},
		{
			name: "openPost",
			type: "string | null",
			description:
				"Id of the post in the in-place reader. Controlled with onOpenPostChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Pages and the reader swap without sliding, morphing or height easing.",
		behaviour: [
			"A new page slides in from the side it came from; the list's height eases between pages.",
			"Opening a post morphs its image into the reader through a view transition, and back on close.",
			"The filter pill slides to the chosen category.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Cards are real links, so they work without script and open in new tabs.",
			"The reader focuses its back button; closing returns focus to the card.",
			"Pagination marks the current page with aria-current.",
		],
	},
	guidance: {
		when: ["A blog, changelog archive or resource library index."],
		whenNot: [{ text: "A handful of posts on a landing page.", use: "card" }],
		responsive: ["One column, two from 36rem of container, three from 56rem."],
		performance: [
			"Images load lazily except the featured one; only the current page renders.",
		],
		ai: ["Pass `getHref` when posts have their own pages; keep `body` for short posts."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "BlogGrid",
		},
		svelte: {
			entry: "BlogGrid",
		},
	},
	keywords: ["blog", "posts", "articles", "grid", "journal", "pagination", "filter"],
});
