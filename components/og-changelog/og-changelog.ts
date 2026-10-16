import { defineComponent } from "@baby-ui/registry-schema";

const MODES = ["light", "dark"];
const TONES = ["neutral", "chart", "primary"];

export const ogChangelog = defineComponent({
	slug: "og-changelog",
	name: "OG Changelog",
	description:
		"A 1200x630 release card: a ticket stub with version pill and date, a headline and three marked highlights, rendered to PNG with takumi.",
	category: "og-images",
	status: "stable",
	demo: { mode: "auto", frame: "og" },
	variants: { mode: MODES, tone: TONES },
	props: [
		{
			name: "version",
			type: "string",
			description: "Release version for the pill and the background numeral.",
			required: true,
			default: "v2.4.0",
			control: { kind: "text" },
		},
		{
			name: "headline",
			type: "string",
			description: "What the release is about; clamps to two lines.",
			required: true,
			default: "Charts land, dialogs grow from their trigger",
			control: { kind: "text" },
		},
		{
			name: "site",
			type: "string",
			description: "Product name, top of the stub.",
			required: true,
			default: "baby ui",
			control: { kind: "text" },
		},
		{
			name: "date",
			type: "string",
			description: "Pre-formatted release date, so the card never guesses a locale.",
			default: "Sep 26, 2026",
			control: { kind: "text" },
		},
		{
			name: "highlights",
			type: '{ kind: "added" | "changed" | "fixed" | "removed"; text: string; label?: string }[]',
			description:
				"Up to three entries, each with a coloured marker; `label` overrides the capitalised kind.",
			control: { kind: "none" },
		},
		{
			name: "logo",
			type: "string",
			description: "Product logo URL beside the name.",
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
			description: "Colour of the version pill and the timeline head.",
			default: "neutral",
			control: { kind: "select", options: TONES },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "A static image; nothing moves.",
		behaviour: [
			"Fixed 1200x630 canvas built only from flex layout and theme tokens, so takumi renders it the same as the browser.",
			"Marker chips stay neutral; only their icons take the success, info, warning and destructive tokens.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rendered to an image: give the meta tag a matching og:image:alt, usually the version and headline.",
		],
	},
	impl: {
		react: {
			entry: "OgChangelog",
			files: [
				{ path: "og-changelog/og-changelog.tsx", type: "registry:ui" },
				{ path: "og-changelog/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "OgChangelog",
			files: [
				{ path: "og-changelog/og-changelog.svelte", type: "registry:ui" },
				{ path: "og-changelog/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: [
		"og",
		"open graph",
		"social card",
		"changelog",
		"release",
		"takumi",
		"image",
	],
});
