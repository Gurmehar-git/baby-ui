import { defineComponent } from "../index.ts";

const SIZES = ["sm", "md", "lg"];

export const agentScreen = defineComponent({
	slug: "agent-screen",
	name: "Agent Screen",
	description:
		"A live viewer for an agent's screen: a resting capture that expands to a full-width viewer.",
	category: "agents",
	status: "stable",
	demo: { mode: "auto", frame: "none" },
	variants: { size: SIZES },
	props: [
		{
			name: "agentName",
			type: "string",
			description: "Shown below the resting card and in the expanded viewer's title bar.",
			default: "Agent",
			control: { kind: "text" },
		},
		{
			name: "streamSrc",
			type: "string",
			description:
				'Image or video URL for the agent\'s screen. Video files (`.mp4`/`.webm`/`.mov`/`.m4v`) play muted and looped; anything else renders as an image. Falls back to a plain "Screen unavailable" placeholder when omitted.',
			control: { kind: "text" },
		},
		{
			name: "loading",
			type: "boolean",
			description: 'Shows a "Connecting to agent\'s screen" state instead of the stream.',
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Resting card's max width.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "open",
			type: "boolean",
			description: "Whether the expanded viewer is open. Two-way bindable in Svelte.",
			default: false,
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The viewer's open/close transition and the recording dot's pulse both drop.",
		behaviour: [
			'The resting card lifts its shadow and reveals an "Open" pill on hover.',
			'"Teach a task" starts a recording timer that keeps ticking after the viewer is collapsed, since the state lives on the component, not inside the dialog\'s content.',
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space"], action: "Opens the resting card" },
			{ keys: ["Escape"], action: "Collapses the expanded viewer" },
		],
		notes: [
			"The expanded viewer is a real Dialog: focus trap, scroll lock and outside-dismiss all come from that primitive, not reimplemented here.",
			'The decorative cursor overlays and the hover-only "Open" pill are `aria-hidden`; the resting card\'s own accessible name comes from its visible "Open" text.',
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
			entry: "AgentScreen",
			files: [
				{ path: "agent-screen/agent-screen.tsx", type: "registry:ui" },
				{ path: "agent-screen/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "dialog", "spinner"],
		},
		svelte: {
			entry: "AgentScreen",
			files: [
				{ path: "agent-screen/agent-screen.svelte", type: "registry:ui" },
				{ path: "agent-screen/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "dialog", "spinner"],
		},
	},
	keywords: ["agent", "screen", "viewer", "recording"],
});
