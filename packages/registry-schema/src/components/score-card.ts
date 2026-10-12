import { defineComponent } from "../index.ts";

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
			description: "Current value.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "min",
			type: "number",
			description: "Scale minimum.",
			default: 0,
			control: { kind: "number", min: 0, max: 80, step: 1 },
		},
		{
			name: "max",
			type: "number",
			description: "Scale maximum.",
			default: 100,
			control: { kind: "number", min: 90, max: 200, step: 1 },
		},
		{
			name: "trend",
			type: "number",
			description: "Change since the last reading, in points. Omit to hide the badge.",
			control: { kind: "none" },
		},
		{
			name: "tone",
			type: '"primary" | "highlight" | "negative" | "scale"',
			description: "Gauge fill colour.",
			default: "primary",
			control: { kind: "select", options: ["primary", "highlight", "negative", "scale"] },
		},
		{
			name: "layout",
			type: '"arc" | "linear"',
			description: "Gauge shape.",
			default: "arc",
			control: { kind: "select", options: ["arc", "linear"] },
		},
		{
			name: "size",
			type: '"default" | "lg"',
			description: "Gauge width.",
			default: "default",
			control: { kind: "select", options: ["default", "lg"] },
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
			files: [
				{ path: "score-card/score-card.tsx", type: "registry:ui" },
				{ path: "score-card/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["gauge-chart", "card", "badge"],
		},
		svelte: {
			entry: "ScoreCard",
			files: [
				{ path: "score-card/score-card.svelte", type: "registry:ui" },
				{ path: "score-card/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["gauge-chart", "card", "badge"],
		},
	},
	keywords: ["score", "gauge", "health score", "nps", "uptime", "card"],
});
