import { defineComponent } from "@baby-ui/registry-schema";

export const statusMonitor = defineComponent({
	slug: "status-monitor",
	name: "Status Monitor",
	description:
		"Uptime strip: one bar per day or hour, coloured by status, with a tooltip per period and the uptime share.",
	category: "blocks",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	props: [
		{
			name: "statuses",
			type: "StatusMonitorItem[]",
			description:
				"One entry per period, oldest first: status (normal, warning, error or empty), optional timestamp (string or Date) and info. The newest 90 are kept; missing periods render empty.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg"',
			description: "Bar height: 24, 32 or 40px.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg"] },
		},
		{
			name: "unit",
			type: '"days" | "hours"',
			description: "What one bar stands for, used in the footer.",
			default: "days",
			control: { kind: "select", options: ["days", "hours"] },
		},
		{
			name: "showUptime",
			type: "boolean",
			description: "Show the share of recorded periods that were normal.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "title",
			type: "string",
			description:
				"Heading and the bar group's accessible name; `labels.title` when omitted.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<StatusMonitorLabels>",
			description:
				"Every visible string: status names, their default info, title, uptime, ago, current, days, hours.",
			control: { kind: "none" },
		},
		{
			name: "locale",
			type: "string",
			description: "Formats Date timestamps; the runtime's locale when omitted.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Bars change opacity on hover without the fade.",
		behaviour: [
			"Shows 90, 60 or 30 bars, the most that fit the container, and re-fits on resize.",
			"Hovering or focusing a bar opens its tooltip below it after 150ms; neighbours open instantly once one is open.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Focuses the strip once, on the newest bar" },
			{ keys: ["Arrow Left", "Arrow Right"], action: "Moves between bars" },
			{ keys: ["Home", "End"], action: "Jumps to the oldest and newest" },
		],
		notes: [
			"The strip is a toolbar named by the title; each bar is a button labelled with its timestamp and status.",
			"Status is carried by the tooltip's icon and text as well as colour.",
		],
	},
	impl: {
		react: {
			entry: "StatusMonitor",
			files: [
				{ path: "status-monitor/status-monitor.tsx", type: "registry:ui" },
				{ path: "status-monitor/timeline.ts", type: "registry:ui" },
				{ path: "status-monitor/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["tooltip"],
		},
		svelte: {
			entry: "StatusMonitor",
			files: [
				{ path: "status-monitor/status-monitor.svelte", type: "registry:ui" },
				{ path: "status-monitor/timeline.ts", type: "registry:ui" },
				{ path: "status-monitor/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["tooltip"],
		},
	},
	keywords: ["status", "uptime", "monitor", "incident", "health", "timeline", "sla"],
});
