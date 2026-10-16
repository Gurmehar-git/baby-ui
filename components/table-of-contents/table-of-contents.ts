import { defineComponent } from "@baby-ui/registry-schema";

export const tableOfContents = defineComponent({
	slug: "table-of-contents",
	name: "Table of Contents",
	description:
		"An on-this-page outline whose rail bends between heading depths and lights the headings in view.",
	category: "advanced",
	status: "beta",
	variants: { variant: ["curve", "straight"] },
	props: [
		{
			name: "items",
			type: "{ id: string; label: string; depth: 2 | 3 }[]",
			description: "Headings in page order: the target element id, link text and depth.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"curve" | "straight"',
			description: "How the rail moves between depths: a smooth bend, or square steps.",
			default: "curve",
			control: { kind: "select", options: ["curve", "straight"] },
		},
		{
			name: "indicator",
			type: "boolean",
			description:
				"A dot that rides the rail to the leading edge of the headings in view.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "scrollOffset",
			type: "number",
			description:
				"Height of any sticky header, in px: a heading above this line counts as scrolled past.",
			default: 56,
			control: { kind: "none" },
		},
		{
			name: "root",
			type: "HTMLElement | null",
			description: "Scroll container that holds the headings; the window when omitted.",
			control: { kind: "none" },
		},
		{
			name: "activeIds",
			type: "string[]",
			description:
				"Ids shown as in view. Setting it overrides the scroll spy; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "onActiveChange",
			type: "(ids: string[]) => void",
			description: "Called when the scroll spy's set of headings in view changes.",
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name of the navigation landmark.",
			default: "On this page",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The accent clip and the dot jump to their new place with no transition.",
		behaviour: [
			"Every heading in view is current; with none in view, the last heading scrolled past stays current.",
			"An accent copy of the rail is clipped to the current rows, its edges easing over 200ms.",
			"The dot follows the leading edge: the top of the current rows when scrolling up, the bottom when scrolling down, moving along the rail with CSS offset-path over 200ms.",
			"Scroll handling runs at most once per animation frame; the rail re-measures when the list resizes.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Moves through the links in heading order" },
			{ keys: ["Enter"], action: "Jumps to that heading" },
		],
		notes: [
			'A <nav> landmark named by `label`; links for headings in view carry aria-current="location".',
			"The rails and dot are decorative SVG, hidden from assistive technology.",
		],
	},
	impl: {
		react: {
			entry: "TableOfContents",
			files: [
				{ path: "table-of-contents/table-of-contents.tsx", type: "registry:ui" },
				{ path: "table-of-contents/toc-core.ts", type: "registry:ui" },
				{ path: "table-of-contents/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "TableOfContents",
			files: [
				{ path: "table-of-contents/table-of-contents.svelte", type: "registry:ui" },
				{ path: "table-of-contents/toc-core.ts", type: "registry:ui" },
				{ path: "table-of-contents/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: [
		"toc",
		"table of contents",
		"outline",
		"scrollspy",
		"on this page",
		"anchor",
		"docs",
	],
});
