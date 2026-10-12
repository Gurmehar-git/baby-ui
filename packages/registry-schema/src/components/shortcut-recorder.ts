import { defineComponent } from "../index.ts";

const SIZES = ["sm", "default", "lg"];

const files = (main: string) => [
	{ path: `shortcut-recorder/${main}`, type: "registry:ui" as const },
	{ path: "shortcut-recorder/recorder.ts", type: "registry:ui" as const },
	{ path: "shortcut-recorder/variants.ts", type: "registry:ui" as const },
	{ path: "lib/shortcut-keys.ts", type: "registry:lib" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

export const shortcutRecorder = defineComponent({
	slug: "shortcut-recorder",
	name: "Shortcut Recorder",
	description:
		"A field that records a keyboard shortcut and warns before taking a combination that is already bound or kept by the system.",
	category: "advanced",
	status: "stable",
	variants: { size: SIZES },
	props: [
		{
			name: "label",
			type: "string",
			description: 'Accessible name, e.g. "Open search".',
			required: true,
			control: { kind: "text" },
		},
		{
			name: "value",
			type: "string | null",
			description:
				'The shortcut as tokens, e.g. `"mod+shift+k"` (mod is Command on Apple, Ctrl elsewhere), paired with `onValueChange(value, { replaced })`; bindable in Svelte.',
			control: { kind: "none" },
		},
		{
			name: "bindings",
			type: "ShortcutBinding[]",
			description:
				"Shortcuts already in use, `{ id, label, shortcut }`; recording one asks before taking it and reports it as `replaced`.",
			control: { kind: "none" },
		},
		{
			name: "resetValue",
			type: "string | null",
			description: "What the Reset button restores; defaults to `defaultValue`.",
			control: { kind: "none" },
		},
		{
			name: "warnReserved",
			type: "boolean",
			description:
				"Also warn about combinations the browser or system keeps, such as Command W.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "requireModifier",
			type: "boolean",
			description:
				"Require Command, Ctrl or Option so the shortcut cannot clash with typing.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Field height.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The recording hint stops pulsing.",
		behaviour: [
			"While recording, held modifiers appear as caps live; the field glows until keys land.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space"], action: "Start or stop recording" },
			{ keys: ["Escape"], action: "Cancel recording" },
			{ keys: ["Backspace"], action: "Clear the shortcut while recording" },
		],
		notes: [
			"The field is a button named with the label and the spoken shortcut; results and warnings are announced.",
			"Shortcuts are stored platform-neutral (`mod`) and shown in the viewer's platform's caps.",
		],
	},
	guidance: {
		when: ["Settings pages that let people rebind keyboard shortcuts."],
		whenNot: [
			{ text: "Showing a fixed shortcut hint.", use: "shortcut" },
			{ text: "Choosing from a short list of presets.", use: "select" },
		],
		responsive: ["Fills its row; Clear and Reset sit beside it."],
		performance: ["Listens only while recording."],
		ai: [
			"Pass every existing binding in `bindings` and unbind `details.replaced` when it is set.",
			"Store the token string and render it elsewhere with the Shortcut component.",
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
			entry: "ShortcutRecorder",
			files: files("shortcut-recorder.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "shortcut"],
		},
		svelte: {
			entry: "ShortcutRecorder",
			files: files("shortcut-recorder.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "shortcut"],
		},
	},
	keywords: ["shortcut", "hotkey", "keybinding", "keyboard", "record", "settings"],
});
