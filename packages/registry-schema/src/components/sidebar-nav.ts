import { defineComponent } from "../index.ts";

const SIZES = ["sm", "md", "lg"];

export const sidebarNav = defineComponent({
	slug: "sidebar-nav",
	name: "Sidebar Nav",
	description:
		"A collapsible workspace sidebar: switcher, primary nav, searchable recents, and a footer action.",
	category: "advanced",
	status: "stable",
	variants: { size: SIZES },
	props: [
		{
			name: "workspace",
			type: "SidebarWorkspace",
			description: "The current workspace's name, monogram and optional image URL.",
			control: { kind: "none" },
		},
		{
			name: "navItems",
			type: "SidebarNavItem[]",
			description: 'Primary nav rows shown under "New chat".',
			control: { kind: "none" },
		},
		{
			name: "recents",
			type: "SidebarRecent[]",
			description: "The searchable recent-chats list.",
			control: { kind: "none" },
		},
		{
			name: "workspaceActions",
			type: "SidebarWorkspaceAction[]",
			description:
				"Extra actions in the workspace switcher's menu; an action without `onSelect` renders disabled.",
			control: { kind: "none" },
		},
		{
			name: "chatNavKey",
			type: "string",
			description:
				"Nav key activated by picking a recent or starting a new chat. Defaults to the first nav item.",
			control: { kind: "none" },
		},
		{
			name: "onFooterClick",
			type: "() => void",
			description:
				"Footer action handler; the footer button renders only when this is passed.",
			control: { kind: "none" },
		},
		{
			name: "footerLabel",
			type: "string",
			description: "Footer button text. No default copy.",
			control: { kind: "none" },
		},
		{
			name: "size",
			type: SIZES.map((v) => `"${v}"`).join(" | "),
			description: "Expanded width.",
			default: "default",
			control: { kind: "select", options: SIZES },
		},
		{
			name: "collapsed",
			type: "boolean",
			description:
				"Whether the sidebar is collapsed to its icon rail. Controlled with `onCollapsedChange` (React also `defaultCollapsed`); bindable in Svelte.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "labels",
			type: "Partial<SidebarNavLabels>",
			description:
				"Every built-in string (aria labels, search, sign out, empty state), for localisation.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The collapse width, every label's fade/slide, the recents chevron and recents filtering all drop to an instant change.",
		behaviour: [
			"Collapsing keeps every icon's x-position fixed; only the labels fade and slide out, so nothing reflows.",
			"Filtering recents collapses non-matching rows through grid-template-rows 1fr to 0fr, kept mounted and inert.",
			"Hovering a nav or recents row glides a highlight to it, measured from the row's own layout rather than a fixed track.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Tab"],
				action:
					"Reaches the workspace switcher, every nav row, search and the footer action when present",
			},
		],
		notes: [
			"Collapsed controls are `aria-hidden` or `inert`, and closed recents are `inert`, so nothing invisible stays focusable.",
			'The active nav row carries `aria-current="page"`.',
			"The workspace switcher composes the real DropdownMenu, so its own keyboard and focus handling isn't reimplemented here.",
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
			entry: "SidebarNav",
			files: [
				{ path: "sidebar-nav/sidebar-nav.tsx", type: "registry:ui" },
				{ path: "sidebar-nav/variants.ts", type: "registry:ui" },
				{ path: "sidebar-nav/labels.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["avatar", "dropdown-menu"],
		},
		svelte: {
			entry: "SidebarNav",
			files: [
				{ path: "sidebar-nav/sidebar-nav.svelte", type: "registry:ui" },
				{ path: "sidebar-nav/types.ts", type: "registry:ui" },
				{ path: "sidebar-nav/variants.ts", type: "registry:ui" },
				{ path: "sidebar-nav/labels.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["avatar", "dropdown-menu"],
		},
	},
	keywords: ["sidebar", "navigation", "workspace", "chat"],
});
