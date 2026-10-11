import { defineComponent } from "../index.ts";

export const fileTree = defineComponent({
	slug: "file-tree",
	isNew: true,
	name: "File Tree",
	description:
		"Keyboard-navigable file explorer with animated expand and collapse, indent guides, and single selection.",
	category: "advanced",
	status: "beta",

	props: [
		{
			name: "indent",
			type: "number",
			description: "Horizontal indent added per nesting level, in pixels.",
			default: 14,
			control: { kind: "number", min: 8, max: 32, step: 2 },
		},
		{
			name: "showGuides",
			type: "boolean",
			description: "Draw a vertical rule connecting the children of an open folder.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "size",
			type: '"sm" | "md"',
			description: "Row height, text size and chevron scale.",
			default: "md",
			control: { kind: "select", options: ["sm", "md"] },
		},
		{
			name: "defaultExpanded",
			type: "boolean",
			description:
				"Starting expand state for any folder id not present in the expanded-ids map.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "tree",
			type: "FileTreeNode[]",
			description: "Nested nodes. A node with `children` renders as a folder.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "expandedIds",
			type: "Record<string, boolean>",
			description:
				"Controlled: which folder ids are expanded. Omit to let the component own it.",
			control: { kind: "none" },
		},
		{
			name: "defaultExpandedIds",
			type: "Record<string, boolean>",
			description: "Uncontrolled starting expanded-ids map.",
			default: "{}",
			control: { kind: "none" },
		},
		{
			name: "onExpandedIdsChange",
			type: "(expandedIds: Record<string, boolean>) => void",
			description:
				"Fired with the full updated map every time a folder toggles, controlled or not.",
			control: { kind: "none" },
		},
		{
			name: "selected",
			type: "string | null",
			description: "Controlled: the selected row id. Omit to let the component own it.",
			control: { kind: "none" },
		},
		{
			name: "defaultSelected",
			type: "string | null",
			description: "Uncontrolled starting selection.",
			default: "null",
			control: { kind: "none" },
		},
		{
			name: "onSelectedChange",
			type: "(id: string) => void",
			description:
				"Fired with the row id every time selection changes, controlled or not.",
			control: { kind: "none" },
		},
	],

	motion: {
		springs: [],
		reducedMotion:
			"The tree still expands and collapses instantly; the chevron still rotates.",
		behaviour: [
			"A folder's children stay mounted and expand/collapse via `grid-template-rows` (the same technique Collapsible uses), so the height animates in both directions instead of rows just appearing or vanishing.",
			"The chevron rotates 90 degrees over the same duration as the height change, so the two read as one gesture.",
			"A collapsed folder's children are `inert`: not focusable, not exposed to assistive tech, even though they're still in the DOM for the animation to have something to collapse.",
			"Selection is single: selecting a node clears the previous one.",
		],
	},

	a11y: {
		role: "tree",
		keyboard: [
			{ keys: ["Arrow Down", "Arrow Up"], action: "Moves between visible rows" },
			{ keys: ["Arrow Right"], action: "Opens a closed folder, then moves into it" },
			{ keys: ["Arrow Left"], action: "Closes an open folder, then moves to its parent" },
			{ keys: ["Home", "End"], action: "Jumps to the first and last visible row" },
			{ keys: ["Enter", "Space"], action: "Selects the focused row" },
		],
		notes: [
			"Rows use roving tabindex, so the tree is one tab stop rather than one per file.",
			"`aria-expanded` is set on folders only; files omit it rather than reporting false.",
			"Each folder's children sit in a `role=group`, matching the WAI-ARIA tree pattern.",
		],
	},

	impl: {
		react: {
			entry: "FileTree",
			files: [
				{ path: "file-tree/file-tree.tsx", type: "registry:ui" },
				{ path: "file-tree/types.ts", type: "registry:ui" },
				{ path: "file-tree/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "FileTree",
			files: [
				{ path: "file-tree/file-tree.svelte", type: "registry:ui" },
				{ path: "file-tree/types.ts", type: "registry:ui" },
				{ path: "file-tree/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},

	keywords: ["file tree", "explorer", "sidebar", "directory", "navigation"],
});
