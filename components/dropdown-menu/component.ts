import { defineComponent } from "@baby-ui/registry-schema";

export const dropdownMenu = defineComponent({
	slug: "dropdown-menu",
	name: "Dropdown Menu",
	description:
		"Anchored action menu with roving focus, destructive styling and outside dismissal.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description: "DropdownMenuContent: surface radius, padding and row density.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
		},
		{
			name: "side",
			type: '"top" | "right" | "bottom" | "left"',
			description: "Preferred side. Flips automatically when there is not room.",
			default: "bottom",
			control: {
				kind: "select",
				options: ["top", "right", "bottom", "left"],
			},
		},
		{
			name: "sideOffset",
			type: "number",
			description: "Distance from the trigger, in pixels.",
			default: 4,
			control: { kind: "number", min: 0, max: 24, step: 1 },
		},
		{
			name: "align",
			type: '"start" | "center" | "end"',
			description: "Alignment along the side.",
			default: "start",
			control: { kind: "select", options: ["start", "center", "end"] },
		},
		{
			name: "open",
			type: "boolean",
			description: "Controlled open state. Bindable.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The menu appears without the scale, and rows no longer stagger in.",
		behaviour: [
			"Opens anchored to the trigger and flips above it when there is no room below (Base UI/bits-ui popper collision detection).",
			"Unfolds from the trigger edge: a clip-path reveal from the near edge, corners going\nfrom flat to round, with a 30ms stagger per row, the same as Select and Combobox.",
			"Focus moves to the first item on open and back to the trigger on close, so the keyboard never lands nowhere.",
			"A submenu opens to the right of its trigger on hover or click/arrow-right/enter, and scales in rather than unfolding, since the unfold direction is tuned for top/bottom placement.",
		],
	},
	a11y: {
		role: "menu",
		keyboard: [
			{ keys: ["Arrow keys"], action: "Moves between items, wrapping at both ends" },
			{ keys: ["Home", "End"], action: "Jumps to the first and last item" },
			{
				keys: ["Escape"],
				action:
					"Closes the entire menu, including any open submenu, and returns focus to the trigger",
			},
			{
				keys: ["Arrow Right", "Enter"],
				action: "On a submenu trigger, opens it and focuses its first item",
			},
			{
				keys: ["Arrow Up", "Arrow Down"],
				action: "Inside a submenu, move within it only",
			},
			{
				keys: ["Arrow Left"],
				action: "Inside a submenu, closes it and returns focus to its trigger",
			},
		],
		notes: [
			"The trigger declares aria-haspopup=menu, so a screen reader announces that it opens something.",
			"Disabled items are skipped by the roving focus rather than focused and announced as unavailable.",
			"Positioning, focus trapping, roving tabindex, typeahead, outside-dismiss and portaling are all delegated to Base UI (React) and bits-ui (Svelte); this component only owns the classes and data-slots.",
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
			entry: "DropdownMenu",
		},
		svelte: {
			entry: "DropdownMenu",
		},
	},
	keywords: ["dropdown", "menu", "overlay"],
});
