import { defineComponent } from "@baby-ui/registry-schema";

const files = (ext: "tsx" | "svelte") => [
	{ path: `github-stats/github-stats.${ext}`, type: "registry:ui" as const },
	{ path: "github-stats/core.ts", type: "registry:ui" as const },
	{ path: "github-stats/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

const dependencies = [
	"clsx",
	"tailwind-merge",
	"tailwind-variants",
	"d3-array",
	"d3-scale",
	"d3-shape",
];

const registryDependencies = [
	"avatar",
	"badge",
	"bar-chart",
	"card",
	"chart",
	"rolling-digits",
	"empty",
	"github-calendar",
	"select",
	"tabs",
];

export const githubStatsBlock = defineComponent({
	slug: "github-stats",
	name: "GitHub Stats",
	description:
		"A year on GitHub: the contribution total against the same days of the year before, streaks and best day, the full calendar, profile counts, and where the work went.",
	category: "blocks",
	status: "beta",

	props: [
		{
			name: "data",
			type: "GithubStatsData",
			description:
				"`{ counts, contributions, mix?, organizations?, repositories?, profileUrl? }`. `contributions` holds daily counts keyed by year. No fetching of its own.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"default" | "compact" | "minimal"',
			description:
				"`default` is the full section. `compact` keeps the total, two facts, a small calendar and the counts for a sidebar. `minimal` drops the card, the mix and the repositories.",
			default: "default",
			control: { kind: "select", options: ["default", "compact", "minimal"] },
		},
		{
			name: "view",
			type: '"days" | "weeks"',
			description:
				"The calendar, or the same days summed per week as bars. Controlled in React with `onViewChange` (or `defaultView`); bindable in Svelte.",
			default: "days",
			control: { kind: "select", options: ["days", "weeks"] },
		},
		{
			name: "year",
			type: "string",
			description:
				"Which year of `contributions` to show; the newest when unset. Controlled in React with `onYearChange` (or `defaultYear`); bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "locale",
			type: "string",
			description: "BCP 47 locale for counts, dates and percentages.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<GithubStatsLabels>",
			description: "Every visible and accessible string. Defaults to English.",
			control: { kind: "none" },
		},
	],

	motion: {
		springs: [],
		reducedMotion:
			"Numbers show their final value; panels and bars appear without motion.",
		behaviour: [
			"The year total and the counts run up once scrolled into view; a new year counts from the old total.",
			"Switching days and weeks fades the panel up 8px.",
			"Weekly bars grow from the baseline.",
		],
	},

	a11y: {
		keyboard: [
			{ keys: ["Arrow Left", "Arrow Right"], action: "Switch between Days and Weeks" },
			{ keys: ["Enter", "Space", "Arrow keys"], action: "On the year select, opens it" },
			{
				keys: ["Arrow keys"],
				action: "In the calendar (one tab stop), move by day and week",
			},
		],
		notes: [
			"The trend carries its sign and comparison window as text, never colour alone.",
			"Facts and counts are `dl` pairs; the mix legend writes every share out beside the bar.",
			"Repositories and organizations are links.",
		],
	},

	impl: {
		react: {
			entry: "GithubStats",
			files: files("tsx"),
			dependencies,
			registryDependencies,
		},
		svelte: {
			entry: "GithubStats",
			files: files("svelte"),
			dependencies,
			registryDependencies,
		},
	},

	keywords: [
		"github",
		"profile",
		"contributions",
		"heatmap",
		"streak",
		"open source",
		"block",
	],
});
