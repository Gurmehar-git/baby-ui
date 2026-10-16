import { defineComponent } from "@baby-ui/registry-schema";

const variantProp = {
	name: "variant",
	type: '"default" | "compact" | "minimal"',
	description:
		"`default` is the full block. `compact` keeps the total, two facts and the chart for a sidebar. `minimal` drops the card for a mono ledger.",
	default: "default",
	control: {
		kind: "select" as const,
		options: ["default", "compact", "minimal"],
	},
};

const modeProp = {
	name: "mode",
	type: '"cumulative" | "daily"',
	description:
		"Chart view: `cumulative` draws the running total; `daily` draws stars gained per day, or per week past 120 days. Controlled in React with `onModeChange` (or `defaultMode`); bindable in Svelte.",
	default: "cumulative",
	control: { kind: "select" as const, options: ["cumulative", "daily"] },
};

const localeProp = {
	name: "locale",
	type: "string",
	description:
		"BCP 47 locale for compact number, day and month tick formatting in every chart.",
	control: { kind: "none" as const },
};

const labelsProp = {
	name: "labels",
	type: "Partial<StarHistoryLabels>",
	description:
		"Every visible and accessible string: facts, counts, chart tabs and the empty state. Defaults to English.",
	control: { kind: "none" as const },
};

export const starHistoryBlock = defineComponent({
	slug: "star-history",
	name: "Star History",
	description:
		"GitHub star history: the total against the 30 days before, best day, the latest milestone and the next one at the current pace, and a total or gained chart.",
	category: "blocks",
	status: "beta",

	props: [
		{
			name: "history",
			type: "StarHistoryData",
			description:
				"`{ repo, createdAt, data }`. `data` is a per-day cumulative series, oldest first; the chart starts at the first row and stops at the last, so the consumer decides the window.",
			required: true,
			control: { kind: "none" },
		},
		variantProp,
		modeProp,
		{
			name: "onModeChange",
			type: "(mode: StarHistoryMode) => void",
			description: "Fires when the chart tabs change.",
			control: { kind: "none" },
		},
		localeProp,
		labelsProp,
	],

	motion: {
		springs: [],
		reducedMotion: "The total shows its final value; charts appear without their reveal.",
		behaviour: [
			"The total runs up once scrolled into view.",
			"Switching tabs mounts the other chart fresh: the line sweeps in, bars grow from the baseline.",
		],
	},

	a11y: {
		keyboard: [
			{ keys: ["Arrow Left", "Arrow Right"], action: "Switch between Total and Gained" },
		],
		notes: [
			"Every chart announces an accessible name from `ChartContainer.title` and a generated summary.",
			"The tab list is named by `labels.modeLabel`; facts and counts are `dl` pairs.",
			"Icons are aria-hidden; the trend's signed percent is read as text, never colour alone.",
			"The charts keep the Chart plot's keyboard model and data-table summary.",
		],
	},

	impl: {
		react: {
			entry: "StarHistory",
		},
		svelte: {
			entry: "StarHistory",
		},
	},

	keywords: ["github", "stars", "history", "chart", "line", "bar", "block"],
});
