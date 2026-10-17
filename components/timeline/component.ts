import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { timeline as timelineVariants } from "./variants";

const VARIANTS = ["default", "card"];

export const timeline = defineComponent({
	slug: "timeline",
	name: "Timeline",
	description:
		"A vertical activity feed grouped by day: pinned day labels, a line that draws as rows scroll in, rows that expand in place.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(timelineVariants, ["variant"]),
	props: [
		{
			name: "events",
			type: "TimelineEvent[]",
			description:
				"`{ id, at, title, actor?, meta?, detail?, avatar?, icon?, tone? }` in any order; the newest shows first. `tone` is neutral, success or destructive.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "now",
			type: "number",
			description:
				"Reference time in epoch ms for relative labels and day groups; pass a ticking clock to keep them fresh.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name for the feed.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "expanded",
			type: "string[]",
			description:
				"Ids of expanded rows, paired with `onExpandedChange`; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "maxHeight",
			type: "number | string",
			description:
				"Height of the scrolling area; without it the feed grows with the page.",
			control: { kind: "none" },
		},
		{
			name: "timeZone",
			type: "string",
			description:
				"Time zone for day groups and clock times; fixed to UTC so server and client agree.",
			default: "UTC",
			control: { kind: "none" },
		},
		{
			name: "scrollToNew",
			type: "boolean",
			description:
				"Scroll back to the top when a new update arrives while scrolled down.",
			default: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "`card` frames the feed on a bordered surface.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Rows appear without the marker pop, line draw or slide-in.",
		behaviour: [
			"Markers pop and the line draws down as rows scroll into view, a beat apart.",
			"New updates open from the top while older rows glide down; day counts roll.",
			"Rows expand in place with the Collapsible height animation.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["ArrowDown", "ArrowUp"], action: "Move between expandable rows" },
			{ keys: ["Home", "End"], action: "First or last expandable row" },
			{ keys: ["Enter", "Space"], action: "Expand or collapse a row" },
		],
		notes: [
			"Day labels are headings with the update count; new updates are announced politely.",
			"Each time carries the full date for screen readers and as a tooltip.",
		],
	},
	guidance: {
		when: [
			"Project history, audit logs and deploy streams where order and recency matter.",
		],
		whenNot: [
			{ text: "Records people sort or compare.", use: "data-table" },
			{ text: "An agent's plan with step status.", use: "task-steps" },
		],
		responsive: ["Fills its container; set `maxHeight` to scroll inside a panel."],
		performance: [
			"Rows reveal through one IntersectionObserver; nothing animates off screen.",
		],
		ai: [
			"Say the outcome in `title` too; `tone` only tints the marker.",
			"Pass `timeZone` from the viewer once hydrated, or keep UTC for server output.",
		],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "Timeline",
		},
		svelte: {
			entry: "Timeline",
		},
	},
	keywords: ["timeline", "activity", "feed", "history", "audit", "log", "changelog"],
});
