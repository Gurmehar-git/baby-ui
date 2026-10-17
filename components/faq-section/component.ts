import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { faqSection as faqSectionVariants } from "./variants";

const VARIANTS = ["accordion", "columns", "search"];

export const faqSection = defineComponent({
	slug: "faq-section",
	name: "FAQ Section",
	description:
		"Frequently asked questions as one centred accordion, a topic rail beside its questions, or a list that filters and highlights as you type.",
	category: "blocks",
	status: "stable",
	variants: variantsOf(faqSectionVariants, ["variant"]),
	props: [
		{
			name: "items",
			type: "FaqItem[]",
			description:
				"FaqSection: questions with a plain-text answer and an optional `category`.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "One accordion, a topic rail beside the list, or a searchable list.",
			default: "accordion",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "type",
			type: '"single" | "multiple"',
			description: "Whether several answers can be open at once.",
			default: "single",
			control: { kind: "select", options: ["single", "multiple"] },
		},
		{
			name: "value",
			type: "string[]",
			description:
				"Open item ids (an item's `id`, else its question). Controlled with onValueChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "category",
			type: "string",
			description: "Active topic in the columns variant, with onCategoryChange.",
			control: { kind: "none" },
		},
		{
			name: "query",
			type: "string",
			description: "Search text in the search variant, with onQueryChange.",
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"FaqSection: FaqSectionHeader (FaqSectionTitle, FaqSectionDescription), FaqSectionSearch, FaqSectionList, FaqSectionEmpty and FaqSectionContact; columns wraps the header, FaqSectionTopics and contact in FaqSectionRail.",
			control: { kind: "none" },
		},
		{
			name: "href",
			type: "string",
			description:
				"FaqSectionContact: a link when set, otherwise a button (onClick). `description` adds a second line.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Answers, topics and filtered rows switch without easing.",
		behaviour: [
			"Answers open on grid rows, as in the accordion.",
			"Filtered-out rows fold away; switching topics eases the list height between them.",
			"The topic rail's pill slides to the chosen topic.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["ArrowUp", "ArrowDown"], action: "Move between questions or topics" },
			{ keys: ["Enter", "Space"], action: "Open or close an answer" },
		],
		notes: [
			"A labelled section; each question is a heading with a button, from the accordion.",
			"The result count is a polite live region; matches are marked with <mark>.",
			"Hidden rows and off-topic lists are inert, so focus never lands in them.",
		],
	},
	guidance: {
		when: ["A support or pricing page answering the same questions over and over."],
		whenNot: [{ text: "Long-form help articles.", use: "accordion" }],
		responsive: [
			"The columns variant stacks its rail above the list below a 48rem container.",
		],
		performance: ["Every row stays mounted, so filtering only toggles attributes."],
		ai: [
			"Keep answers to plain text so search can match them.",
			"Use `columns` from three topics up, `search` from about a dozen questions.",
		],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "FaqSection",
		},
		svelte: {
			entry: "FaqSection",
		},
	},
	keywords: ["faq", "questions", "help", "support", "accordion", "search", "section"],
});
