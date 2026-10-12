import { defineComponent } from "../index.ts";

const VARIANTS = [
	"rectangle",
	"circle",
	"circle-blur",
	"blinds",
	"eclipse",
	"split",
	"rise",
];
const STARTS = [
	"top-left",
	"top-right",
	"bottom-left",
	"bottom-right",
	"center",
	"bottom-up",
];

export const themeToggle = defineComponent({
	slug: "theme-toggle",
	name: "Theme Toggle",
	description:
		"Light/dark toggle that reveals the new theme across the whole page via the View Transition API.",
	category: "base",
	status: "stable",
	variants: { variant: VARIANTS, start: STARTS },
	props: [
		{
			name: "theme",
			type: '"light" | "dark"',
			description: "Controlled: which theme is active. Omit to let the component own it.",
			control: { kind: "none" },
		},
		{
			name: "defaultTheme",
			type: '"light" | "dark"',
			description: "Uncontrolled starting theme.",
			default: "light",
			control: { kind: "select", options: ["light", "dark"] },
		},
		{
			name: "onThemeChange",
			type: '(theme: "light" | "dark") => void',
			description: "Fired every time the theme flips, controlled or not.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Which page-wide reveal plays when the theme flips.",
			default: "rectangle",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "start",
			type: STARTS.map((v) => `"${v}"`).join(" | "),
			description: "Origin corner/edge the reveal grows from.",
			default: "bottom-up",
			control: { kind: "select", options: STARTS },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The page-wide reveal is skipped entirely (no `startViewTransition` call); the theme still flips instantly. The icon swap is also dropped.",
		behaviour: [
			"`rectangle` and `blinds` clip the incoming theme's snapshot in from `start`; `circle`/`circle-blur` clip it in as a growing circle centred on `start` instead.",
			"`eclipse` sweeps a disc across from the left (or right, when `start` ends in right); `split` parts the halves from the centre; `rise` sinks the old page and lifts the new one in.",
			"Browsers without View Transition support (or a user with reduced motion) get an instant swap, no reveal.",
			"The icon (sun showing while dark, moon while light) blurs and scales in on every flip, keyed by the current theme so it always replays.",
		],
	},
	a11y: {
		notes: [
			"A real `<button>` with a dynamic `aria-label` describing the action ('Switch to light mode' / 'Switch to dark mode'), not `role=\"switch\"`: the label announces what pressing it does, the same pattern most theme toggles use.",
		],
	},
	licenseOrigin: {
		source: "beUI",
		url: "https://beui.dev",
		license: "MIT",
		copyright: "Copyright (c) beUI",
	},
	impl: {
		react: {
			entry: "ThemeToggle",
			files: [
				{ path: "theme-toggle/theme-toggle.tsx", type: "registry:ui" },
				{ path: "theme-toggle/variants.ts", type: "registry:ui" },
				{ path: "theme-toggle/reveal.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "ThemeToggle",
			files: [
				{ path: "theme-toggle/theme-toggle.svelte", type: "registry:ui" },
				{ path: "theme-toggle/variants.ts", type: "registry:ui" },
				{ path: "theme-toggle/reveal.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["theme", "dark mode", "light mode", "toggle", "view transition"],
});
