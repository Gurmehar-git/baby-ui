import { defineComponent } from "../index.ts";

export const docsNav = defineComponent({
	slug: "docs-nav",
	name: "Docs Nav",
	description:
		"Documentation sidebar: collapsible sections, a sliding hover pill and a tick or thread curve per link.",
	category: "advanced",
	status: "stable",
	props: [
		{
			name: "sections",
			type: "DocsNavSection[]",
			description:
				"Sections of links: id, label, optional count, items with href, label, badge and badgeVariant.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "current",
			type: "string",
			description:
				"href of the page being viewed; that link is marked current and scrolled into view.",
			control: { kind: "none" },
		},
		{
			name: "connector",
			type: '"tick" | "curve"',
			description:
				"Marker per link: a short tick, or a thread rail with a rounded elbow into each row. Both grow on hover.",
			default: "tick",
			control: { kind: "select", options: ["tick", "curve"] },
		},
		{
			name: "rungs",
			type: "boolean",
			description:
				"Adds a continuous hairline ladder beside the links; the current link's label steps in. Works with either connector.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "open",
			type: "string[]",
			description:
				"Ids of the expanded sections. Controlled with onOpenChange (React) or bindable (Svelte); every section when omitted.",
			control: { kind: "none" },
		},
		{
			name: "defaultOpen",
			type: "string[]",
			description: "React only: uncontrolled starting sections.",
			control: { kind: "none" },
		},
		{
			name: "onNavigate",
			type: "(href: string, event: MouseEvent) => void",
			description:
				"Fires on link click, e.g. to close a mobile drawer or route client-side.",
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name of the navigation landmark.",
			default: "Documentation",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The hover pill and markers jump without sliding, sections open and close instantly, and the current link scrolls into view without smooth scrolling.",
		behaviour: [
			"A single hover pill slides between rows over 200ms ease-out instead of each row flashing its own background.",
			"The hovered row's marker grows and brightens, the current row's marker is longest and solid, and the other rows dim to 60% while one is hovered.",
			"Sections expand over 200ms and collapse over 120ms, with the chevron rotating on the same timing; collapsed links are inert.",
			"When the current link changes it is centred in its scroll container, only if it sits more than 40px off-centre.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Tab"],
				action: "Moves through section triggers and the links of expanded sections",
			},
			{
				keys: ["Enter", "Space"],
				action: "On a section trigger, expands or collapses it",
			},
		],
		notes: [
			'A nav landmark named by `label`; the current link carries aria-current="page".',
			"Collapsed sections are inert, so their links leave the tab order and the accessibility tree.",
			"Markers and the hover pill are decorative (aria-hidden); state is also carried by text weight and aria-current.",
		],
	},
	impl: {
		react: {
			entry: "DocsNav",
			files: [
				{ path: "docs-nav/docs-nav.tsx", type: "registry:ui" },
				{ path: "docs-nav/scroll.ts", type: "registry:ui" },
				{ path: "docs-nav/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["badge", "collapsible"],
		},
		svelte: {
			entry: "DocsNav",
			files: [
				{ path: "docs-nav/docs-nav.svelte", type: "registry:ui" },
				{ path: "docs-nav/docs-nav-list.svelte", type: "registry:ui" },
				{ path: "docs-nav/scroll.ts", type: "registry:ui" },
				{ path: "docs-nav/types.ts", type: "registry:ui" },
				{ path: "docs-nav/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["badge", "collapsible"],
		},
	},
	keywords: ["docs", "sidebar", "navigation", "table of contents", "tree", "nav"],
});
