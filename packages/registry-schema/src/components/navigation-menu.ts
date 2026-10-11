import { defineComponent } from "../index.ts";

export const navigationMenu = defineComponent({
	slug: "navigation-menu",
	isNew: true,
	name: "Navigation Menu",
	description:
		"Site navigation with hover and focus triggers and one shared panel that resizes and slides between them.",
	category: "base",
	status: "beta",
	variants: {
		size: ["sm", "md"],
	},
	props: [
		{
			name: "value",
			type: "string",
			description: "The open item's value, empty when closed. Bindable.",
			control: { kind: "none" },
		},
		{
			name: "size",
			type: '"sm" | "md"',
			description: "Trigger height and text size, set on NavigationMenuTrigger.",
			default: "md",
			control: { kind: "select", options: ["sm", "md"] },
		},
		{
			name: "viewport",
			type: "boolean",
			description:
				"Svelte only: render the shared panel. Off, each Content opens under its own trigger.",
			default: true,
			control: { kind: "none" },
		},
		{
			name: "align",
			type: '"start" | "center" | "end"',
			description: "React only: panel alignment against the open trigger.",
			default: "start",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The panel appears and resizes without scale, slide or cross-fade.",
		behaviour: [
			"One panel serves every trigger: it resizes to the open content and slides under the new trigger over 200ms, so moving along the bar reads as one object.",
			"Content enters from the side the pointer came from and the previous content leaves the other way.",
			"The panel scales in from 0.95 at the trigger edge and exits in 120ms, per the motion contract.",
		],
	},
	a11y: {
		role: "navigation",
		keyboard: [
			{ keys: ["Arrow keys"], action: "Moves between top-level triggers and links" },
			{ keys: ["Enter", "Space"], action: "Opens a trigger's panel" },
			{ keys: ["Arrow Down"], action: "Moves focus into it" },
			{ keys: ["Escape"], action: "Closes the panel and returns focus to its trigger" },
		],
		notes: [
			"Roving focus, hover intent, dismissal and ARIA state come from Base UI (React) and bits-ui (Svelte).",
			"NavigationMenuLink takes `active` for the current page, which sets aria-current.",
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
			entry: "NavigationMenu",
			files: [
				{ path: "navigation-menu/navigation-menu.tsx", type: "registry:ui" },
				{ path: "navigation-menu/variants.ts", type: "registry:ui" },
				{ path: "lib/anchor.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "@base-ui/react"],
			registryDependencies: ["popover"],
		},
		svelte: {
			entry: "NavigationMenu",
			files: [
				{ path: "navigation-menu/navigation-menu.svelte", type: "registry:ui" },
				{ path: "navigation-menu/navigation-menu-list.svelte", type: "registry:ui" },
				{ path: "navigation-menu/navigation-menu-item.svelte", type: "registry:ui" },
				{ path: "navigation-menu/navigation-menu-trigger.svelte", type: "registry:ui" },
				{ path: "navigation-menu/navigation-menu-content.svelte", type: "registry:ui" },
				{ path: "navigation-menu/navigation-menu-link.svelte", type: "registry:ui" },
				{ path: "navigation-menu/navigation-menu-viewport.svelte", type: "registry:ui" },
				{ path: "navigation-menu/navigation-menu-indicator.svelte", type: "registry:ui" },
				{ path: "navigation-menu/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "bits-ui"],
			registryDependencies: ["popover"],
		},
	},
	keywords: ["navigation", "menu", "navbar", "mega menu", "header", "site nav"],
});
