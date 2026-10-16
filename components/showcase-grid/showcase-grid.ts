import { defineComponent } from "@baby-ui/registry-schema";

export const showcaseGrid = defineComponent({
	slug: "showcase-grid",
	name: "Showcase Grid",
	description:
		"A hairline 12-column grid of panels with dots on every intersection, corner rulers and hover-revealed panel actions.",
	category: "blocks",
	status: "stable",
	props: [
		{
			name: "frame",
			type: '"rulers" | "plain"',
			description:
				"`rulers` draws ruler ticks and hatch squares past the grid's corners from `md` up.",
			default: "rulers",
			control: { kind: "select", options: ["rulers", "plain"] },
		},
		{
			name: "span",
			type: "3 | 4 | 5 | 6 | 7 | 8 | 9 | 12",
			description:
				"On ShowcasePanel: columns out of 12 from `md` up. Rows wrap when spans reach 12; below `md` every panel is full width.",
			default: 12,
			control: { kind: "none" },
		},
		{
			name: "actions",
			type: "ReactNode | Snippet",
			description:
				"On ShowcasePanel: top-right controls, revealed on hover or focus and always shown on touch screens.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Panel actions appear without the fade.",
		behaviour: [
			"Panel actions fade in over 150ms when the panel is hovered or anything inside it takes focus.",
			"From `md` up each panel keeps its min height and clips its content; below it content sets the height.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Tab"],
				action: "Reaches each panel's actions and content in reading order",
			},
		],
		notes: [
			"Dots, rulers and hatches are decorative (aria-hidden).",
			"Actions stay in the tab order while hidden and show on focus, so keyboard users can always reach them.",
		],
	},
	impl: {
		react: {
			entry: "ShowcaseGrid",
			files: [
				{ path: "showcase-grid/showcase-grid.tsx", type: "registry:ui" },
				{ path: "showcase-grid/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "ShowcaseGrid",
			files: [
				{ path: "showcase-grid/showcase-grid.svelte", type: "registry:ui" },
				{ path: "showcase-grid/showcase-panel.svelte", type: "registry:ui" },
				{ path: "showcase-grid/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: [
		"showcase",
		"grid",
		"gallery",
		"panels",
		"landing",
		"marketing",
		"blueprint",
	],
});
