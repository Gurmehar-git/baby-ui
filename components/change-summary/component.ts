import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { changeSummary as changeSummaryVariants } from "./variants";

const VARIANTS = ["tray", "plain"];
const TONES = '"positive" | "negative" | "neutral"';

export const changeSummary = defineComponent({
	slug: "change-summary",
	name: "Change Summary",
	description:
		"What moved since last time, one metric per row, each with a tinted trend mark and the change in words.",
	category: "blocks",
	status: "beta",
	added: "2026-10-21",
	variants: variantsOf(changeSummaryVariants, ["variant"]),
	props: [
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"ChangeSummary: the heading in a grey rim above a raised list, or one bordered card with the heading as its first row.",
			default: "tray",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "tone",
			type: TONES,
			description:
				"ChangeSummaryItem: green arrow, red arrow or a grey dash. Pick by whether the move is good, not by its direction.",
			default: "neutral",
			control: { kind: "none" },
		},
		{
			name: "direction",
			type: '"up" | "down"',
			description:
				"ChangeSummaryItem: which way the arrow points. Defaults to up for positive and down for negative, so a falling churn rate can be positive and point down.",
			control: { kind: "none" },
		},
		{
			name: "icon",
			type: "ReactNode | Snippet | null",
			description:
				"ChangeSummaryTitle: replaces the default lines mark; null removes it.",
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"ChangeSummary: ChangeSummaryHeader (ChangeSummaryTitle, ChangeSummaryPeriod) and ChangeSummaryList of ChangeSummaryItem, each with ChangeSummaryLabel and ChangeSummaryChange.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Rows appear in place.",
		behaviour: ["Rows rise 8px and fade in once on mount, 60ms apart."],
	},
	a11y: {
		keyboard: [],
		notes: [
			"A section named by its title; metrics are a description list of label and change.",
			"The trend mark is decorative: the change text says the direction in words.",
		],
	},
	guidance: {
		when: [
			"A digest of what moved since the last visit: a dashboard header, a weekly email preview.",
		],
		whenNot: [
			{ text: "One headline number with a chart.", use: "stat-card" },
			{ text: "A row of key figures with no change.", use: "stats-band" },
		],
		responsive: ["Under 25rem each metric stacks above its change and the text wraps."],
		ai: [
			'Write the change as a sentence fragment with the new value: "Up 6.1% to 18.2K".',
		],
	},
	licenseOrigin: {
		source: "affectui",
		url: "https://github.com/flohoeller/affectui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Florian Höller (adfects)",
	},
	impl: {
		react: { entry: "ChangeSummary" },
		svelte: { entry: "ChangeSummary" },
	},
	keywords: ["changes", "metrics", "summary", "digest", "kpi", "trend", "dashboard"],
});
