import { defineComponent } from "@baby-ui/registry-schema";

export const contextCards = defineComponent({
	slug: "context-cards",
	name: "Context Cards",
	description:
		"Retrieved chunks in a stack, each with a source chip that confirms after the fact.",
	category: "agents",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	props: [
		{
			name: "chunks",
			type: "ContextChunk[]",
			description:
				"The retrieved chunks to show. Each has a title, body, character count, source filename, a short badge label and a semantic tone.",
			control: { kind: "none" },
		},
		{
			name: "header",
			type: "string",
			description: "Label above the stack.",
			default: "All chunks",
			control: { kind: "text" },
		},
		{
			name: "count",
			type: "string | number",
			description:
				"Value shown in the pill next to the header; defaults to `chunks.length`.",
			control: { kind: "text" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Entrance and the source-chip fade are both opacity-only already; no travel to drop.",
		behaviour: [
			"Each card fades up on mount, staggered by `--stagger-step` per card.",
			"The source chip on each card fades and scales in ~700ms after mount, reading as a follow-up confirmation rather than part of the initial reveal.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Purely presentational: no focus stops, no interactive controls of its own.",
			'The tone-coloured badge square carries its label as text (e.g. "PDF", "CSV"), not colour alone.',
		],
	},
	licenseOrigin: {
		source: "beUI",
		url: "https://beui.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 beUI",
	},
	impl: {
		react: {
			entry: "ContextCards",
		},
		svelte: {
			entry: "ContextCards",
		},
	},
	keywords: ["context", "chunks", "retrieval", "rag", "sources"],
});
