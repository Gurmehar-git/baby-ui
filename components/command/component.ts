import { defineComponent } from "@baby-ui/registry-schema";

export const command = defineComponent({
	slug: "command",
	name: "Command",
	description: "Searchable action list driven entirely from the keyboard.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "open",
			type: "boolean",
			description: "Whether the palette is shown. Bindable.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "placeholder",
			type: "string",
			description: "Input placeholder.",
			default: "Type a command or search\u2026",
			control: { kind: "text" },
		},
		{
			name: "description",
			type: "string",
			description:
				"Sr-only description announced alongside the dialog's accessible name.",
			default: "Search for a command to run\u2026",
			control: { kind: "text" },
		},
		{
			name: "emptyLabel",
			type: "string",
			description: "Shown when nothing matches.",
			default: "No results",
			control: { kind: "text" },
		},
		{
			name: "variant",
			type: '"default" | "framed" | "launcher" | "spotlight"',
			description:
				"`default` is plain shadcn: one surface, a soft input, flat rows. `framed` puts a titled rim around an inset card. `launcher` pairs a pill search with an icon filter tray (CommandFilters) and key hints (CommandFooter). `spotlight` is a large input under scope chips.",
			default: "default",
			control: {
				kind: "select",
				options: ["default", "framed", "launcher", "spotlight"],
			},
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Closing snaps instead of fading.",
		behaviour: [
			"The default list eases to its new height as filtering adds or removes rows.",
			"Opening is instant: the palette is a keyboard shortcut used many times a day. Closing fades over the exit token.",
			"One marker sits under the active row and snaps between rows, since arrow keys repeat too fast for motion to help. `default` paints the row itself, as shadcn does.",
			"Filter tooltips open after a short delay; once one is open, the next opens instantly.",
			"The highlight resets to the first result on every keystroke.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Arrow keys"], action: "Moves through results" },
			{ keys: ["Enter"], action: "Runs the highlighted command" },
			{ keys: ["Escape"], action: "Closes the palette" },
		],
		notes: [
			"aria-activedescendant keeps focus in the input while the list is navigated.",
			"CommandDialog carries a real, sr-only Title/Description (aria-labelledby/aria-describedby), matching shadcn's own pattern, rather than a bare aria-label.",
			"The palette is a real modal dialog (Base UI React, bits-ui Svelte), so the page behind it is inert without extra work; it also unmounts on close, so reopening always starts from an empty search with no special-cased reset.",
			"Filtering, roving highlight, keyboard nav (arrows, Home, End, Enter) and hiding empty groups/results are delegated to cmdk (React) and bits-ui's own `command` module (Svelte); this component only owns the sliding-highlight marker, motion and data-slots.",
			"Search is real fuzzy matching (cmdk's own scoring, bits-ui's own port of the same algorithm), not a plain case-insensitive substring check like the pre-migration version: a query can now match on a looser, ranked basis.",
			"The result count next to the input and a debounced live region both read from the same filtered count the primitive already tracks, so a screen reader and a sighted user see the same number.",
			"Part names and data-slot values match shadcn/ui, so this replaces an existing command without touching call sites.",
			'CommandHeader hoists into the dialog\'s rim (the same inset-frame treatment as Dialog and the Card `framed` variant); the card below it holds the search input and results. The "esc" cap is literal text, not the Shortcut glyph, since a spoken-word key name reads more clearly at this size.',
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
			entry: "Command",
			// Dialog's backdrop; ToggleGroup and Tooltip build the filter tray.
		},
		svelte: {
			entry: "Command",
			// Dialog's backdrop; ToggleGroup and Tooltip build the filter tray.
		},
	},
	keywords: ["command"],
});
