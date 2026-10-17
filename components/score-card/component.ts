import { defineComponent } from "@baby-ui/registry-schema";

export const scoreCard = defineComponent({
	slug: "score-card",
	name: "Score Card",
	description: "A single headline metric on a dial: health scores, grades, NPS, uptime.",
	category: "blocks",
	status: "stable",
	props: [
		{
			name: "value",
			type: "number",
			description: "ScoreCardGauge: current value.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "min",
			type: "number",
			description: "ScoreCardGauge: scale minimum.",
			default: 0,
			control: { kind: "number", min: 0, max: 80, step: 1 },
		},
		{
			name: "max",
			type: "number",
			description: "ScoreCardGauge: scale maximum.",
			default: 100,
			control: { kind: "number", min: 90, max: 200, step: 1 },
		},
		{
			name: "trend",
			type: "number",
			description: "ScoreCardTrend: change since the last reading, in points.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "tone",
			type: '"primary" | "highlight" | "negative" | "scale"',
			description: "ScoreCardGauge: fill colour.",
			default: "primary",
			control: { kind: "select", options: ["primary", "highlight", "negative", "scale"] },
		},
		{
			name: "layout",
			type: '"arc" | "linear"',
			description: "ScoreCardGauge: dial shape.",
			default: "arc",
			control: { kind: "select", options: ["arc", "linear"] },
		},
		{
			name: "size",
			type: '"default" | "lg"',
			description: "ScoreCard: gauge width.",
			default: "default",
			control: { kind: "select", options: ["default", "lg"] },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"ScoreCard: ScoreCardHeader (ScoreCardTitle, ScoreCardDescription, ScoreCardTrend) and ScoreCardContent (ScoreCardGauge).",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The gauge reaches its resting value with no sweep.",
		behaviour: ["Inherits the gauge chart's own enter sweep."],
	},
	a11y: {
		keyboard: [],
		notes: ["The gauge prints its numeric value as text; colour is never the only cue."],
	},
	impl: {
		react: {
			entry: "ScoreCard",
		},
		svelte: {
			entry: "ScoreCard",
		},
	},
	keywords: ["score", "gauge", "health score", "nps", "uptime", "card"],
});
