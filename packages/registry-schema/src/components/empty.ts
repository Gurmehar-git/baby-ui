import { defineComponent } from "../index.ts";

const SVELTE_PARTS = [
	"header",
	"media",
	"title",
	"description",
	"content",
	"illustration",
];

export const empty = defineComponent({
	slug: "empty",
	name: "Empty",
	description:
		"Empty state for lists, tables, search results and first runs: media, title, description and actions.",
	category: "base",
	status: "beta",
	props: [
		{
			name: "variant",
			type: '"default" | "outline" | "card"',
			description: "Empty: no frame, a dashed drop-zone frame, or a card surface.",
			default: "outline",
			control: { kind: "select", options: ["default", "outline", "card"] },
		},
		{
			name: "layout",
			type: '"vertical" | "horizontal"',
			description:
				"Empty: stacked and centred, or media and words left with actions right, for inline slots.",
			default: "vertical",
			control: { kind: "select", options: ["vertical", "horizontal"] },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg"',
			description: "Empty: padding, gaps and title size.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg"] },
		},
		{
			name: "tone",
			type: '"neutral" | "primary" | "success" | "warning" | "destructive" | "info"',
			description:
				'EmptyMedia: the icon tile\'s colour with variant="icon", or the bare glyph\'s colour with variant="default".',
			default: "neutral",
			control: {
				kind: "select",
				options: ["neutral", "primary", "success", "warning", "destructive", "info"],
			},
		},
		{
			name: "scene",
			type: '"search" | "inbox" | "error" | "upload"',
			description: "Demo only: which empty state the preview shows.",
			default: "search",
			control: { kind: "select", options: ["search", "inbox", "error", "upload"] },
		},
		{
			name: "media",
			type: '"icon" | "illustration"',
			description:
				"Demo only: an icon tile, or EmptyIllustration, whose shapes morph between scenes (`scene`, `phase`).",
			default: "icon",
			control: { kind: "select", options: ["icon", "illustration"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "EmptyIllustration snaps between scenes; media skips its entrance.",
		behaviour: [
			"Media, title and description rise in on mount.",
			"EmptyIllustration: every shape springs to its place in a new scene or phase; strokes redraw a beat later.",
			"EmptyIllustration drifts slightly with a mouse pointer.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Plain markup: give the title a heading element through your own markup if the page outline needs one.",
			"Media is decorative; the title and description carry the meaning.",
			"Part names and data-slot values match shadcn/ui, so this replaces an existing Empty without touching call sites.",
		],
	},
	licenseOrigin: {
		source: "shadcn/ui",
		url: "https://github.com/shadcn-ui/ui",
		license: "MIT",
		copyright: "Copyright (c) 2023 shadcn",
	},
	impl: {
		react: {
			entry: "Empty",
			files: [
				{ path: "empty/empty.tsx", type: "registry:ui" },
				{ path: "empty/empty-illustration.tsx", type: "registry:ui" },
				{ path: "empty/art.ts", type: "registry:ui" },
				{ path: "empty/illustration.ts", type: "registry:ui" },
				{ path: "empty/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "Empty",
			files: [
				{ path: "empty/empty.svelte", type: "registry:ui" },
				...SVELTE_PARTS.map((part) => ({
					path: `empty/empty-${part}.svelte`,
					type: "registry:ui" as const,
				})),
				{ path: "empty/art.ts", type: "registry:ui" },
				{ path: "empty/illustration.ts", type: "registry:ui" },
				{ path: "empty/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["empty", "empty state", "blank slate", "no results", "zero state"],
});
