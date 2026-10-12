import { defineComponent } from "../index.ts";

const MODES = ["light", "dark"];

export const ogPromptPhoto = defineComponent({
	slug: "og-prompt-photo",
	name: "OG Prompt Photo",
	description:
		"A 1200x630 card: a headline and an AI prompt box with option chips over a full-bleed photo.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: { mode: MODES },
	props: [
		{
			name: "title",
			type: "string",
			description: "Headline over the photo, up to two lines, always white.",
			required: true,
			default: "Create, edit and modify UI blocks and templates with AI.",
			control: { kind: "text" },
		},
		{
			name: "image",
			type: "string",
			description: "Background photo URL; keep the middle calm so the title reads.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "placeholder",
			type: "string",
			description: "Example prompt shown in the box.",
			required: true,
			default: "Create a landing page for my SaaS idea of voice agents",
			control: { kind: "text" },
		},
		{
			name: "chips",
			type: "string[]",
			description: "Option chips along the bottom of the box, after an image chip.",
			control: { kind: "none" },
		},
		{
			name: "mode",
			type: MODES.map((v) => `"${v}"`).join(" | "),
			description: "Light or dark prompt box; the photo and title stay as they are.",
			default: "light",
			control: { kind: "select", options: MODES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"The title stays white in both modes: the photo, not the theme, sets its backdrop.",
		],
	},
	a11y: {
		keyboard: [],
		notes: ["Rendered to an image: give the meta tag the title as og:image:alt."],
	},
	impl: {
		react: {
			entry: "OgPromptPhoto",
			files: [
				{ path: "og-prompt-photo/og-prompt-photo.tsx", type: "registry:ui" },
				{ path: "og-prompt-photo/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "OgPromptPhoto",
			files: [
				{ path: "og-prompt-photo/og-prompt-photo.svelte", type: "registry:ui" },
				{ path: "og-prompt-photo/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["og", "open graph", "social card", "ai", "prompt", "photo", "takumi"],
});
