import { defineComponent } from "../index.ts";

const SIZES = ["sm", "md", "lg"];

export const toolChips = defineComponent({
	slug: "tool-chips",
	name: "Tool Chips",
	description:
		"An agent run as compact rows: tool calls with inline chips, then file-diff chips.",
	category: "agents",
	status: "stable",
	variants: { size: SIZES },
	props: [
		{
			name: "steps",
			type: "ToolStep[]",
			description:
				"Every tool-call row, already known: the reveal is a mount-time stagger, not live progress.",
			control: { kind: "none" },
		},
		{
			name: "diffs",
			type: "ToolDiff[]",
			description:
				"File-diff chips shown below the steps; omit or pass `[]` to hide the row entirely.",
			control: { kind: "none" },
		},
		{
			name: "hiddenDiffCount",
			type: "number",
			description:
				'Count folded behind a "+N more" chip after the visible diffs; omit to hide it.',
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "ToolChipsLabels",
			description:
				"Header override; defaults to a real count computed from `steps.length`.",
			control: { kind: "none" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Card's max width.",
			default: "md",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "open",
			type: "boolean",
			description: "Whether the run's step list is expanded. Two-way bindable in Svelte.",
			default: true,
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Rows lose their staggered fade-up entrance; only the expand/collapse grid transitions drop.",
		behaviour: [
			"Steps and diff chips fade up on mount with a staggered delay, not a scripted step-by-step reveal.",
			"A diff chip's preview is a real hover card: it opens on hover or focus and flips side automatically to stay on screen.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Reaches the run header, each row and each diff chip" },
			{ keys: ["Enter", "Space"], action: "Toggles a row" },
		],
		notes: [
			"Each diff chip's preview composes the real HoverCard, so its open/close timing and positioning aren't reimplemented here.",
			"Added and removed line counts are shown as signed numbers next to each diff chip, not colour alone.",
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
			entry: "ToolChips",
			files: [
				{ path: "tool-chips/tool-chips.tsx", type: "registry:ui" },
				{ path: "tool-chips/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["hover-card"],
		},
		svelte: {
			entry: "ToolChips",
			files: [
				{ path: "tool-chips/tool-chips.svelte", type: "registry:ui" },
				{ path: "tool-chips/types.ts", type: "registry:ui" },
				{ path: "tool-chips/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["hover-card"],
		},
	},
	keywords: ["tool", "diff", "agent", "run"],
});
