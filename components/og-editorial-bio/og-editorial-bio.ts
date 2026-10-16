import { defineComponent } from "@baby-ui/registry-schema";

const MODES = ["light", "dark"];
const TONES = ["neutral", "chart", "primary"];

export const ogEditorialBio = defineComponent({
	slug: "og-editorial-bio",
	name: "OG Editorial Bio",
	description:
		"A 1200x630 personal card: your name and bio set as staggered lines over one large tone circle.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: { mode: MODES, tone: TONES },
	props: [
		{
			name: "name",
			type: "string",
			description: "First line, flush left.",
			required: true,
			default: "Rauno Freiberg",
			control: { kind: "text" },
		},
		{
			name: "lines",
			type: "string[]",
			description:
				"The bio, one entry per line; every other line indents. Five fit under the name.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "mode",
			type: MODES.map((v) => `"${v}"`).join(" | "),
			description: "Light or dark card, independent of the page theme.",
			default: "light",
			control: { kind: "select", options: MODES },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Colour of the circle.",
			default: "chart",
			control: { kind: "select", options: TONES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"Lines break where you break them, so the stagger never depends on font metrics.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt, the bio as one sentence.",
		],
	},
	impl: {
		react: {
			entry: "OgEditorialBio",
			files: [
				{ path: "og-editorial-bio/og-editorial-bio.tsx", type: "registry:ui" },
				{ path: "og-editorial-bio/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "OgEditorialBio",
			files: [
				{ path: "og-editorial-bio/og-editorial-bio.svelte", type: "registry:ui" },
				{ path: "og-editorial-bio/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: [
		"og",
		"open graph",
		"social card",
		"personal",
		"bio",
		"portfolio",
		"takumi",
		"image",
	],
});
