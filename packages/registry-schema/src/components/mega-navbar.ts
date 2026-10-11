import { defineComponent } from "../index.ts";

export const megaNavbar = defineComponent({
	slug: "mega-navbar",
	name: "Mega Navbar",
	description:
		"Marketing site header with a morphing mega menu on desktop and an accordion sheet on mobile.",
	category: "blocks",
	status: "stable",
	props: [
		{
			name: "groups",
			type: "MegaMenuGroup[]",
			description: "Desktop dropdown groups, each opening a shared morphing panel.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "links",
			type: "MegaNavLink[]",
			description: "Flat links beside the groups that need no panel.",
			control: { kind: "none" },
		},
		{
			name: "brand",
			type: "ReactNode",
			description:
				"Logo and wordmark slot, shown in both the header and the mobile sheet.",
			control: { kind: "none" },
		},
		{
			name: "actions",
			type: "ReactNode",
			description: "Right-side desktop actions (sign in, a primary CTA, a GitHub link…).",
			control: { kind: "none" },
		},
		{
			name: "mobileActions",
			type: "ReactNode",
			description:
				"Actions pinned to the mobile sheet's footer. Falls back to `actions`.",
			control: { kind: "none" },
		},
		{
			name: "active",
			type: "string",
			description: "href of the current page, for aria-current highlighting.",
			control: { kind: "none" },
		},
		{
			name: "sticky",
			type: "boolean",
			description: "Pin to the top and swap to a blurred surface once scrolled.",
			default: true,
			control: { kind: "none" },
		},
		{
			name: "blur",
			type: "boolean",
			description:
				"Use a translucent blurred surface rather than a solid one when scrolled.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "variant",
			type: '"solid" | "floating" | "notched"',
			description:
				"Solid spans the page edge to edge; floating is an inset rounded bar; notched hangs a shelf from the top edge on desktop, over a plain ruled bar and a top sheet on mobile.",
			default: "solid",
			control: { kind: "select", options: ["solid", "floating", "notched"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The mega menu panel and mobile chevrons stop transitioning; content still appears and disappears instantly.",
		behaviour: [
			"One shared panel resizes and slides between desktop triggers, measured from the active trigger and panel, rather than a fresh popover per item.",
			"A disclosure pattern, not role=menu: contents are links to pages, so the browser's own link semantics are what a screen reader hears.",
			"Hovering off a trigger toward the panel schedules a short close delay so the diagonal path to the panel doesn't close it first.",
			"Navigating (an `active` change) closes the mobile sheet automatically.",
			"Notched: the mobile bar's hairline rule fades in once the page scrolls, and the sheet drops from the top edge.",
		],
	},
	a11y: {
		keyboard: [
			{
				keys: ["Escape"],
				action: "Closes the open panel and returns focus to its trigger",
			},
			{
				keys: ["Arrow Down"],
				action: "On a desktop trigger, opens its panel and focuses the first link",
			},
			{
				keys: ["Tab"],
				action:
					"Reaches every trigger, panel link, mobile accordion header and mobile link",
			},
		],
		notes: [
			"Desktop group triggers carry aria-expanded and aria-controls pointing at the shared panel.",
			"The mobile sheet is a real dialog: it traps focus and hides the rest of the page from assistive tech while open.",
		],
	},
	impl: {
		react: {
			entry: "MegaNavbar",
			files: [
				{ path: "mega-navbar/mega-navbar.tsx", type: "registry:ui" },
				{ path: "mega-navbar/variants.ts", type: "registry:ui" },
				{ path: "mega-navbar/current.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "@base-ui/react", "tailwind-variants"],
			registryDependencies: ["collapsible", "sheet", "notched-shelf"],
		},
		svelte: {
			entry: "MegaNavbar",
			files: [
				{ path: "mega-navbar/mega-navbar.svelte", type: "registry:ui" },
				{ path: "mega-navbar/mega-menu.svelte", type: "registry:ui" },
				{ path: "mega-navbar/variants.ts", type: "registry:ui" },
				{ path: "mega-navbar/types.ts", type: "registry:ui" },
				{ path: "mega-navbar/current.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "bits-ui", "tailwind-variants"],
			registryDependencies: ["collapsible", "sheet", "notched-shelf"],
		},
	},
	keywords: ["navbar", "header", "mega menu", "navigation", "mobile menu", "marketing"],
});
