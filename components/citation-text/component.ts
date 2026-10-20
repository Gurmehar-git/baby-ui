import { defineComponent } from "@baby-ui/registry-schema";

export const citationText = defineComponent({
	slug: "citation-text",
	name: "Citation Text",
	description:
		"Composable AI answer with numbered inline citations; each chip opens a source card and lights the sentence it backs.",
	category: "text",
	status: "beta",
	props: [
		{
			name: "segments",
			type: "{ text: string; citations?: string[] }[]",
			description:
				"CitationText: the answer as sentences or clauses, each with the source ids behind it. Segments rather than parsed [1] markers: they stream by appending, and a chip knows which sentence to light.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "sources",
			type: "{ id: string; title: string; url: string; domain: string; snippet?: string; favicon?: string }[]",
			description:
				"CitationText: every source the answer may cite. Numbers follow first citation, so an uncited source never shows.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "chip",
			type: '"number" | "domain"',
			description: "CitationText: chips read as a number, or as the source's site name.",
			default: "number",
			control: { kind: "select", options: ["number", "domain"] },
		},
		{
			name: "showSources",
			type: "boolean",
			description:
				"Demo control: whether CitationTextSources, the numbered list under the text, is composed in.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "sourcesLabel",
			type: "string",
			description: "CitationTextSources `label`: heading of the sources list.",
			default: "Sources",
			control: { kind: "text" },
		},
		{
			name: "onActiveSourceChange",
			type: "(id: string | null) => void",
			description:
				"CitationText: fires with the source under the pointer or focus, null when it leaves.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Chips appear without the fade and the sentence highlight switches without a transition; the source card still opens.",
		behaviour: [
			"A chip fades in on the base duration the first time it renders; chips already on screen never replay, so a streaming answer only animates what it adds.",
			"Hovering or focusing a chip tints the sentence it cites on the fast duration; hovering a source in the list tints every sentence that cites it.",
			"The source card is the shared hover card: it opens after 300ms, closes 150ms after the pointer leaves, and scales from the chip on the anchored surface contract.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Tab"],
				action: "Reaches each chip in reading order and tints the sentence it cites",
			},
			{ keys: ["Enter"], action: "On a chip, opens the source in a new tab" },
		],
		notes: [
			'Each chip is a link named "Source n: title", so the number is never the only cue.',
			"The sources list repeats every citation as a plain link list for readers who skip the chips.",
		],
	},
	impl: {
		react: {
			entry: "CitationText",
		},
		svelte: {
			entry: "CitationText",
		},
	},
	keywords: [
		"citations",
		"sources",
		"footnotes",
		"ai answer",
		"perplexity",
		"references",
		"rag",
		"grounding",
	],
});
