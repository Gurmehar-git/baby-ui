import { defineComponent } from "@baby-ui/registry-schema";

const SIZES = ["sm", "default"];
const VARIANTS = ["default", "ghost"];

const files = (main: string[]) => [
	...main.map((path) => ({
		path: `swipe-actions/${path}`,
		type: "registry:ui" as const,
	})),
	{ path: "swipe-actions/swipe.ts", type: "registry:ui" as const },
	{ path: "swipe-actions/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

export const swipeActions = defineComponent({
	slug: "swipe-actions",
	name: "Swipe Actions",
	description:
		"A list whose rows reveal actions on a horizontal swipe, like a mail inbox, with a menu on every row for keyboard and screen reader users.",
	category: "advanced",
	status: "stable",
	variants: { variant: VARIANTS, size: SIZES },
	props: [
		{
			name: "label",
			type: "string",
			description:
				"Accessible name of the list (SwipeActions), or of a row in its menu button (SwipeActionsRow).",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "leading, trailing",
			type: "SwipeAction[]",
			description:
				"Row actions under the left and right edges: `{ label, icon, tone?, onSelect, keepRow? }`. The outermost on each side commits on a full swipe.",
			control: { kind: "none" },
		},
		{
			name: "fullSwipe",
			type: "boolean",
			description: "Row: lets a long swipe commit the outermost action without a tap.",
			default: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "A bordered surface, or bare rows inside your own container.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Row height and padding.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Rows jump to their stops and close without the slide.",
		behaviour: [
			"The row follows the finger with an axis lock and a rubber band past its last stop, then springs with the release velocity.",
			"Revealed actions share the space evenly and widen together; past the threshold the outermost stretches across the row.",
			"A committed row slides out in its direction, then its height closes before the action runs.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space"], action: "Open a row's More actions menu" },
			{ keys: ["ArrowDown", "ArrowUp"], action: "Move through the menu" },
			{ keys: ["Escape"], action: "Close the open row or the menu" },
		],
		notes: [
			"Every action is also in the row's More actions menu, so the gesture is never required.",
			"The revealed action buttons are aria-hidden and out of the tab order; the menu is the accessible path.",
			"Only one row stays open; a press anywhere else closes it.",
		],
	},
	guidance: {
		when: ["Short lists people triage quickly on touch: inboxes, notifications, tasks."],
		whenNot: [
			{ text: "Desktop-first tables with many columns.", use: "data-table" },
			{ text: "One or two actions that should always be visible.", use: "button" },
		],
		responsive: [
			"Rows fill the container; actions are 76px wide at rest and stretch with the swipe.",
		],
		performance: [
			"Only transforms move during a drag; one animation frame loop per moving row.",
		],
		ai: [
			"Remove the item from your list in the action's `onSelect`; set `keepRow` for toggles such as Read and Unread.",
			'Use `tone: "destructive"` for delete, and name the result in the label.',
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
			entry: "SwipeActions",
			files: files(["swipe-actions.tsx"]),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["dropdown-menu"],
		},
		svelte: {
			entry: "SwipeActions",
			files: files(["swipe-actions.svelte", "swipe-actions-row.svelte", "context.ts"]),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["dropdown-menu"],
		},
	},
	keywords: ["swipe", "list", "gesture", "inbox", "actions", "triage"],
});
