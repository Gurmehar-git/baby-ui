import { defineComponent } from "@baby-ui/registry-schema";

const LAYOUTS = ["card", "inline"];

export const question = defineComponent({
	slug: "question",
	name: "Question",
	description:
		"One or more clarifying questions, stepped through with radio/checkbox/custom-text answers and a sliding transition.",
	category: "agents",
	status: "stable",
	variants: { layout: LAYOUTS },
	props: [
		{
			name: "layout",
			type: LAYOUTS.map((v) => `"${v}"`).join(" | "),
			description:
				"`card` wraps the question in a bordered surface; `inline` has none, for embedding inside a Message bubble.",
			default: "card",
			control: { kind: "select", options: LAYOUTS },
		},
		{
			name: "questions",
			type: "QuestionItem[]",
			description:
				"One or more questions, stepped through in order. Each can carry radio (single) or checkbox (multiple) options, a free-text field (`allowCustom`), and its own `autoAdvance`.",
			control: { kind: "none" },
		},
		{
			name: "answers",
			type: "QuestionAnswers",
			description:
				"Controlled answers, keyed by question id. Uncontrolled via `defaultAnswers` otherwise.",
			control: { kind: "none" },
		},
		{
			name: "step",
			type: "number",
			description: "Controlled current step. Uncontrolled via `defaultStep` otherwise.",
			control: { kind: "none" },
		},
		{
			name: "submitLabel",
			type: "string",
			description: "Label on the final question's submit control.",
			default: "Submit",
			control: { kind: "text" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The slide-in on each question drops; the progress dots keep their instant scale/opacity change.",
		behaviour: [
			"Each question slides in from the right and fades, replacing the previous one outright rather than cross-fading.",
			"A single-select (non-multiple) question with `autoAdvance` (the default) moves to the next question 240ms after a pick, giving the reader a moment to see their choice register.",
			"Progress dots scale and fade for the current question rather than just changing colour.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Reaches each option" },
			{ keys: ["Enter", "Space"], action: "Selects" },
			{ keys: ["Arrow keys"], action: "Moves within a radio group" },
		],
		notes: [
			"Options are real `RadioGroup`/`Checkbox` primitives, not styled toggle buttons: full keyboard and screen-reader semantics come from the primitive, not reimplemented here.",
			"The submit control is disabled, not hidden, until the current question has an answer, so its position never shifts.",
		],
	},
	licenseOrigin: {
		source: "sivir-ui",
		url: "https://github.com/aidan-neel/sivir-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Aidan Neel",
	},
	impl: {
		react: {
			entry: "Question",
			files: [
				{ path: "question/question.tsx", type: "registry:ui" },
				{ path: "question/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "checkbox", "input", "radio-group"],
		},
		svelte: {
			entry: "Question",
			files: [
				{ path: "question/question.svelte", type: "registry:ui" },
				{ path: "question/question-options.svelte", type: "registry:ui" },
				{ path: "question/types.ts", type: "registry:ui" },
				{ path: "question/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "checkbox", "input", "radio-group"],
		},
	},
	keywords: ["question", "prompt", "form", "agent"],
});
