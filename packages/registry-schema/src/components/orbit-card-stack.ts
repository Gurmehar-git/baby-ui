import { defineComponent } from "../index.ts";

const SIZES = ["sm", "md", "lg"];
const LAYOUTS = ["arc", "row", "grid"];

export const orbitCardStack = defineComponent({
	slug: "orbit-card-stack",
	name: "Orbit Card Stack",
	description:
		"Cards piled in a stack that fan into an arc, a row or a grid on hover or focus and raise the active card.",
	category: "animated",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	variants: { size: SIZES, layout: LAYOUTS },
	props: [
		{
			name: "items",
			type: "{ name: string; role?: string; description?: string; image?: string; initials?: string; stat?: string; href?: string }[]",
			description: "The profiles. `href` adds a real link button to that card.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "layout",
			type: LAYOUTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Open cards curve like a hand of cards, sit in a near-flat row, or tile into a grid scaled to fit the stage.",
			default: "arc",
			control: { kind: "select", options: LAYOUTS },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Card width, type scale and stage height.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "spread",
			type: "number",
			description: "Largest gap between open cards in px; shrinks to fit the stage.",
			default: 168,
			control: { kind: "number", min: 40, max: 240, step: 8 },
			showWhen: { layout: ["arc", "row"] },
		},
		{
			name: "lift",
			type: "number",
			description: "How far the active open card rises, in px.",
			default: 34,
			control: { kind: "number", min: 0, max: 80, step: 2 },
			showWhen: { layout: ["arc", "row"] },
		},
		{
			name: "value",
			type: "number",
			description:
				"Controlled active card index; pair with `onValueChange` (Svelte: `bind:value`).",
			control: { kind: "none" },
		},
		{
			name: "defaultValue",
			type: "number",
			description: "Active card before any interaction; defaults to the middle one.",
			control: { kind: "none" },
		},
		{
			name: "onValueChange",
			type: "(index: number) => void",
			description: "Fired when hover, focus, click or arrow keys pick a card.",
			control: { kind: "none" },
		},
		{
			name: "open",
			type: "boolean",
			description:
				"Controlled fan state; pair with `onOpenChange` (Svelte: `bind:open`).",
			control: { kind: "none" },
		},
		{
			name: "defaultOpen",
			type: "boolean",
			description: "Fan state before any interaction.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "onOpenChange",
			type: "(open: boolean) => void",
			description: "Fired when the stack asks to fan out or close.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "{ group?: string; link?: string }",
			description: "List name and the link prefix read before each name.",
			default: '{ group: "Profile cards", link: "Open" }',
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Cards jump between pile and fan with no transition.",
		behaviour: [
			"One CSS transform transition per card, 420 ms on cubic-bezier(0.2, 0.8, 0.2, 1).",
			"Closed cards pile around the active card with small offsets and tilts; open cards spread around the centre with a step that shrinks to fit the stage width (container units).",
			"The active open card rises by `lift` and sits above the rest.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Focuses the active card and fans the stack" },
			{ keys: ["Arrow keys", "Home", "End"], action: "Moves the active card" },
			{ keys: ["Escape"], action: "Closes the fan and releases focus" },
		],
		notes: [
			"A labelled list of cards with roving tabindex; the active card carries `aria-current`.",
			"The link button only renders for items with `href`, named by `labels.link` plus the name.",
		],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "OrbitCardStack",
			files: [
				{ path: "orbit-card-stack/orbit-card-stack.tsx", type: "registry:ui" },
				{ path: "orbit-card-stack/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["badge", "button"],
		},
		svelte: {
			entry: "OrbitCardStack",
			files: [
				{ path: "orbit-card-stack/orbit-card-stack.svelte", type: "registry:ui" },
				{ path: "orbit-card-stack/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["badge", "button"],
		},
	},
	keywords: ["stack", "cards", "profiles", "team", "fan", "hover"],
});
