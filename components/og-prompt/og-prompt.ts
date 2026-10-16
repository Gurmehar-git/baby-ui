import { defineComponent } from "@baby-ui/registry-schema";

const MODES = ["light", "dark"];
const TONES = ["chart", "primary"];

export const ogPrompt = defineComponent({
	slug: "og-prompt",
	name: "OG Prompt",
	description:
		"A 1200x630 card: a wordmark and one line over a chat prompt box that rises out of a band of colour.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: { mode: MODES, tone: TONES },
	props: [
		{
			name: "name",
			type: "string",
			description: "Brand name set as the wordmark; one line.",
			required: true,
			default: "Replit",
			control: { kind: "text" },
		},
		{
			name: "placeholder",
			type: "string",
			description: "Text already typed in the prompt box, followed by a caret.",
			required: true,
			default: "Build something people love",
			control: { kind: "text" },
		},
		{
			name: "description",
			type: "string",
			description: "One line under the wordmark.",
			default: "Build apps and websites by chatting with AI",
			control: { kind: "text" },
		},
		{
			name: "logo",
			type: "string",
			description: "Logo image URL beside the name. PNG, SVG or WebP.",
			control: { kind: "none" },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description:
				"Colour band: chart runs blue into pink, primary is one hue fading to white.",
			default: "chart",
			control: { kind: "select", options: TONES },
		},
		{
			name: "mode",
			type: MODES.map((v) => `"${v}"`).join(" | "),
			description: "Light or dark card, independent of the page theme.",
			default: "dark",
			control: { kind: "select", options: MODES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"The prompt box runs off the bottom edge, so it reads as the start of the product.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag the name and description as og:image:alt.",
		],
	},
	impl: {
		react: {
			entry: "OgPrompt",
			files: [
				{ path: "og-prompt/og-prompt.tsx", type: "registry:ui" },
				{ path: "og-prompt/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "OgPrompt",
			files: [
				{ path: "og-prompt/og-prompt.svelte", type: "registry:ui" },
				{ path: "og-prompt/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["og", "open graph", "social card", "ai", "prompt", "chat", "takumi"],
});
