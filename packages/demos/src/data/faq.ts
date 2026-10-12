import type { FaqItem } from "@baby-ui/svelte";

/** Sample questions for the FAQ section demos, grouped into three topics. */
export const FAQ_ITEMS: FaqItem[] = [
	{
		question: "How do I install a component?",
		answer:
			"Run the shadcn CLI with the component's registry URL. The source lands in your project, so every line is yours to change.",
		category: "Getting started",
	},
	{
		question: "Does it work with my design tokens?",
		answer:
			"Components read semantic tokens such as background, border and primary, so mapping them to your palette takes one stylesheet.",
		category: "Getting started",
	},
	{
		question: "Is reduced motion supported?",
		answer:
			"Every animation keeps its final state, focus and feedback with reduced motion on, and drops the travel.",
		category: "Getting started",
	},
	{
		question: "Which frameworks are supported?",
		answer:
			"React 19 and Svelte 5 ship the same components with the same props, so a design system can span both.",
		category: "Technical",
	},
	{
		question: "How do updates work?",
		answer:
			"Run the CLI again to pull the latest version of anything you installed; it reports conflicts before it writes.",
		category: "Technical",
	},
	{
		question: "Are the components accessible?",
		answer:
			"They build on tested headless primitives, so focus, keyboard and screen reader behaviour come from solid foundations.",
		category: "Technical",
	},
	{
		question: "Can I use it in client projects?",
		answer:
			"Yes. Free components are MIT licensed, and a Pro seat covers commercial work for you or your team.",
		category: "Licensing",
	},
	{
		question: "What happens when my plan ends?",
		answer:
			"You keep every component you installed. Renewing only matters for new releases and updates.",
		category: "Licensing",
	},
];

export const FAQ_CONTACT = {
	label: "Still have a question?",
	description: "The team replies within a day.",
	href: "#contact",
};
