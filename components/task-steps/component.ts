import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { taskSteps as taskStepsVariants } from "./variants";

export const taskSteps = defineComponent({
	slug: "task-steps",
	name: "Task Steps",
	description:
		"Ordered agent plan where each step shows pending, active, done or failed, as a timeline or expandable rows.",
	category: "agents",
	status: "stable",
	variants: variantsOf(taskStepsVariants, ["variant"]),
	props: [
		{
			name: "steps",
			type: "TaskStep[]",
			description:
				"Steps in execution order: `id`, `label`, `status`, and for rows an optional `meta`, `step` number and `details` pairs.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"timeline" | "capsules" | "list"',
			description:
				"`timeline` ticks down a connector; `capsules` and `list` are expandable rows with a figure, a status pill and details.",
			default: "timeline",
			control: { kind: "select", options: ["timeline", "capsules", "list"] },
		},
		{
			name: "onToggle",
			type: "(id: string, open: boolean) => void",
			description: "Rows: fired when a row expands or collapses.",
			control: { kind: "none" },
		},
		{
			name: "onRetry",
			type: "(id: string) => void",
			description: "Rows: shows a retry button on failed rows.",
			control: { kind: "none" },
		},
		{
			name: "showConnector",
			type: "boolean",
			description: "Draw a rule connecting consecutive steps.",
			default: true,
			control: { kind: "boolean" },
			showWhen: { variant: ["timeline"] },
		},
		{
			name: "compact",
			type: "boolean",
			description: "Tighter rows for a sidebar.",
			default: false,
			control: { kind: "boolean" },
			showWhen: { variant: ["timeline"] },
		},
		{
			name: "size",
			type: '"sm" | "default"',
			description: "Marker, icon and label scale.",
			default: "default",
			control: { kind: "select", options: ["sm", "default"] },
			showWhen: { variant: ["timeline"] },
		},
		{
			name: "labels",
			type: "Partial<Record<TaskStatus, string>>",
			description:
				"Overrides for the screen-reader status words (Pending, In progress, Done, Failed).",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Status icons swap without the spin or the draw.",
		behaviour: [
			"The active step's spinner rotates at 850ms linear; every other icon is static.",
			"A step turning done draws its tick over 200ms, the same draw the checkbox uses.",
			"The connector above a completed step fills from top to bottom over 300ms.",
			"Rows fade up 80ms apart; a row expands its details with grid-template-rows and the chevron turns.",
		],
	},
	a11y: {
		role: "list",
		keyboard: [],
		notes: [
			"Each step carries its status as text for assistive tech, not only as an icon colour.",
			"The list is aria-live=polite so a status change is announced once, without re-reading the whole plan.",
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
			entry: "TaskSteps",
		},
		svelte: {
			entry: "TaskSteps",
		},
	},
	keywords: ["tasks", "steps", "agent", "plan", "progress"],
});
