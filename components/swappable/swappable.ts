import { defineComponent } from "@baby-ui/registry-schema";

const AXIS_OPTIONS = ["both", "x", "y"];

export const swappable = defineComponent({
	slug: "swappable",
	name: "Swappable",
	description:
		"Drag-to-swap primitive on Swapy: make any layout's slots and items swappable, from a dashboard to a kanban board.",
	category: "base",
	status: "beta",
	props: [
		{
			name: "layout",
			type: '"dashboard" | "kanban" | "list"',
			description:
				"Demo only: a bento dashboard (static), a kanban board (`manualSwap`, rendered from the slot map) or a handle-only list.",
			default: "dashboard",
			control: { kind: "select", options: ["dashboard", "kanban", "list"] },
		},
		{
			name: "variant",
			type: '"card" | "plain"',
			description:
				"Swappable: items as cards that lift while dragged, or no chrome at all.",
			default: "card",
			control: { kind: "select", options: ["card", "plain"] },
		},
		{
			name: "animation",
			type: '"dynamic" | "spring" | "none"',
			description: "Swapy option: how items glide into place.",
			default: "dynamic",
			control: { kind: "select", options: ["dynamic", "spring", "none"] },
		},
		{
			name: "swapMode",
			type: '"hover" | "drop"',
			description: "Swapy option: swap while dragging over a slot, or only on release.",
			default: "hover",
			control: { kind: "select", options: ["hover", "drop"] },
		},
		{
			name: "dragAxis",
			type: '"both" | "x" | "y"',
			description: "Swapy option: lock the drag to one axis.",
			default: "both",
			control: { kind: "select", options: AXIS_OPTIONS },
		},
		{
			name: "dragOnHold",
			type: "boolean",
			description:
				"Swapy option: start a drag only after a short press, so touch screens still scroll.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "autoScrollOnDrag",
			type: "boolean",
			description:
				"Swapy option: scroll the nearest scroller when a drag nears its edge.",
			default: true,
			control: { kind: "none" },
		},
		{
			name: "manualSwap",
			type: "boolean",
			description:
				"Swapy option. Off, Swapy moves the DOM (static layouts). On, render from the slot map `onSwap` hands back (layouts rendered from data).",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "enabled",
			type: "boolean",
			description: "Swapy option: turn dragging and the keyboard path on or off.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "onSwap / onSwapStart / onSwapEnd / onBeforeSwap",
			type: "(event) => void | boolean",
			description:
				"Swapy's events. `onBeforeSwap` returns false to refuse a swap. Keyboard moves fire `onSwap` with the same event shape.",
			control: { kind: "none" },
		},
		{
			name: "onReady",
			type: "(swapy: Swapy) => void",
			description: "The Swapy instance once mounted, for `slotItemMap()` or `update()`.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			'Pass `animation="none"` to swap without gliding; slot highlights are colour only.',
		behaviour: [
			"Swapy glides swapped items into place; the lifted card gains a deeper shadow and a stronger border.",
			"The slot under the pointer tints and shows a dashed outline, so the drop target is never a guess.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Reaches each item" },
			{
				keys: ["Alt+Arrow keys"],
				action: "Swaps the focused item with the previous or next slot; focus follows it",
			},
		],
		notes: [
			"Swapy is pointer-only, so the keyboard path is added on top and announced through a polite live region.",
			"Every item is described by a hint (`hint`) that names both ways to move it.",
			"Mark inner controls `data-swapy-no-drag` so they stay clickable inside a draggable item.",
		],
	},
	licenseOrigin: {
		source: "swapy",
		url: "https://github.com/TahaSh/swapy",
		license: "MIT",
		copyright: "Copyright (c) 2024 Taha Shashtari",
	},
	impl: {
		react: {
			entry: "Swappable",
		},
		svelte: {
			entry: "Swappable",
		},
	},
	keywords: ["swap", "drag", "reorder", "sortable", "kanban", "dashboard", "swapy"],
});
