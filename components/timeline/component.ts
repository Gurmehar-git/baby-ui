import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { timelineScale as timelineVariants } from "./variants";

const VARIANTS = ["default", "card"];
const ORIENTATIONS = ["horizontal", "vertical"];

export const timeline = defineComponent({
	slug: "timeline",
	name: "Timeline",
	description:
		"Composable horizontal or vertical milestone timeline with a snapping track, rail, ticks and dates.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(timelineVariants, ["variant", "orientation"]),
	props: [
		{
			name: "orientation",
			type: ORIENTATIONS.map((value) => `"${value}"`).join(" | "),
			description:
				"Direction used by the scale, keyboard navigation, rail, and viewport.",
			default: "horizontal",
			control: { kind: "select", options: ORIENTATIONS },
		},
		{
			name: "value",
			type: "string",
			description: "Active item id, paired with `onValueChange`; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "defaultValue",
			type: "string",
			description:
				"Initially active item id; otherwise the first registered item is active.",
			control: { kind: "none" },
		},
		{
			name: "itemSize",
			type: "number | string",
			description: "Preferred horizontal item width.",
			default: "18rem",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "`card` frames the scale and its milestones on bordered surfaces.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Selection updates without smooth scrolling or scaling.",
		behaviour: [
			"The focused milestone scales up while neighbours recede without leaving layout.",
			"Native scrolling and snap preserve touch and trackpad momentum.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["ArrowRight", "ArrowLeft"], action: "Move on a horizontal scale" },
			{ keys: ["ArrowDown", "ArrowUp"], action: "Move on a vertical scale" },
			{ keys: ["Home", "End"], action: "First or last item" },
			{ keys: ["Enter", "Space"], action: "Select an item" },
		],
		notes: [
			"Exactly one item is in the tab order; active items expose `aria-current=step`.",
		],
	},
	guidance: {
		when: [
			"Project history, milestones, changelogs and long event streams where order matters.",
		],
		whenNot: [
			{ text: "Records people sort or compare.", use: "data-table" },
			{ text: "An agent's plan with step status.", use: "task-steps" },
		],
		responsive: [
			"Horizontal scales stay inside their viewport; vertical scales fill the container width.",
		],
		performance: [
			"Native scrolling handles momentum; one animation frame measures the nearest item per scroll event.",
		],
		ai: [
			"Keep chronological meaning in visible text; the rail and tick position are supplementary.",
			"Use concise item labels and put extended context in the description or visible content.",
		],
	},
	licenseOrigin: {
		source: "arc, sv-chanhdai and beUI",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli, Sikandar Bhide and Saurabh Chauhan",
	},
	impl: {
		react: {
			entry: "TimelineScale",
		},
		svelte: {
			entry: "TimelineScale",
		},
	},
	keywords: ["timeline", "activity", "feed", "history", "audit", "log", "changelog"],
});
