import { defineComponent } from "@baby-ui/registry-schema";

export const collabCard = defineComponent({
	slug: "collab-card",
	name: "Collab Card",
	description:
		"A Figma-style multiplayer canvas: wandering cursors, click bursts, live presence.",
	category: "blocks",
	status: "stable",
	demo: { mode: "auto", frame: "md" },
	props: [
		{
			name: "collaborators",
			type: "[CollabCardCollaborator, CollabCardCollaborator]",
			description:
				"The two named editors whose cursors click on the pills below the frame.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "presenceColors",
			type: "string[]",
			description: "Avatar swatch colors for the visible presence stack, left to right.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "presenceAvatars",
			type: "string[]",
			description:
				"Avatar image URLs matched to `presenceColors` by index; each colour shows until its image loads.",
			control: { kind: "none" },
		},
		{
			name: "extraCount",
			type: "number",
			description: "Editors beyond the visible swatches, shown as a `+N` avatar.",
			default: 0,
			control: { kind: "number", min: 0, max: 9, step: 1 },
		},
		{
			name: "greeting",
			type: "string",
			description: "The giant word inside the dashed frame.",
			required: true,
			default: "hello!",
			control: { kind: "text" },
		},
		{
			name: "eyebrow",
			type: "string",
			description: "Small line above the frame.",
			required: true,
			default: "Now in multiplayer",
			control: { kind: "text" },
		},
		{
			name: "intro",
			type: "string",
			description: "Word before the first collaborator's pill.",
			required: true,
			default: "editing",
			control: { kind: "text" },
		},
		{
			name: "conjunction",
			type: "string",
			description: "Joiner between the two collaborator pills.",
			default: "&",
			control: { kind: "text" },
		},
		{
			name: "trailing",
			type: "string",
			description: "Optional word after the second collaborator's pill.",
			control: { kind: "text" },
		},
		{
			name: "liveLabel",
			type: "string",
			description:
				"Status line beside the live dot. Defaults to a count derived from `presenceColors`/`extraCount`, never a fixed number.",
			control: { kind: "none" },
		},
		{
			name: "backgroundUrl",
			type: "string",
			description: "Background image URL. Falls back to the tone's canvas gradient.",
			control: { kind: "text" },
		},
		{
			name: "tone",
			type: '"inverted" | "surface"',
			description:
				"Inverted is a design-tool canvas that contrasts the page; surface follows the card colours.",
			default: "inverted",
			control: { kind: "select", options: ["inverted", "surface"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Every cursor, the click burst and the live-dot ping freeze in place at full opacity.",
		behaviour: [
			"The host cursor wanders a fixed multi-point path; each collaborator's cursor jitters near a pill and fires a click-burst ring on a loop, all timed independently so they never sync up.",
			"Every dimension is in `cqi` (container query inline units), so the whole card (frame, cursors, pills, presence stack) scales continuously with its own width, not with viewport breakpoints.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Purely decorative: cursors, the live-ping dot and the presence stack are all `aria-hidden`.",
			"Every colour is a theme token (selection chrome is `primary`, the glow uses chart slots), so both tones keep readable contrast in light and dark mode.",
		],
	},
	licenseOrigin: {
		source: "animata",
		url: "https://animata.design",
		license: "MIT",
		copyright: "Copyright (c) animata",
	},
	impl: {
		react: {
			entry: "CollabCard",
			files: [
				{ path: "collab-card/collab-card.tsx", type: "registry:ui" },
				{ path: "collab-card/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["avatar"],
		},
		svelte: {
			entry: "CollabCard",
			files: [
				{ path: "collab-card/collab-card.svelte", type: "registry:ui" },
				{ path: "collab-card/types.ts", type: "registry:ui" },
				{ path: "collab-card/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["avatar"],
		},
	},
	keywords: ["collaboration", "multiplayer", "cursors", "presence", "figma", "bento"],
});
