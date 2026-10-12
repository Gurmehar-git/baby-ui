import { defineComponent } from "../index.ts";

export const breadcrumb = defineComponent({
	slug: "breadcrumb",
	name: "Breadcrumb",
	description:
		"Trail to the current page; its middle folds into an ellipsis that opens the hidden levels in a dropdown.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "variant",
			type: '"default" | "framed"',
			description: "Breadcrumb: a bare trail, or the trail in a bordered bar.",
			default: "default",
			control: { kind: "select", options: ["default", "framed"] },
		},
		{
			name: "size",
			type: '"sm" | "default"',
			description: "Breadcrumb: text and ellipsis size.",
			default: "default",
			control: { kind: "select", options: ["sm", "default"] },
		},
		{
			name: "collapsed",
			type: "boolean",
			description:
				"Demo only: whether the middle of the trail folds into BreadcrumbEllipsis inside a DropdownMenu.",
			default: true,
			control: { kind: "boolean" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The menu appears without scaling; the ellipsis does not squish.",
		behaviour: [
			"The ellipsis tints on hover and while its menu is open, and squishes on press.",
			"Its DropdownMenu opens on the shared anchored contract: zoom from 0.9 and a 4px lean, 150ms in, 100ms out.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space"], action: "On the ellipsis, opens the hidden levels" },
			{ keys: ["Arrow keys"], action: "Move through the hidden levels" },
		],
		notes: [
			"A nav labelled Breadcrumb wrapping an ordered list, so the order is conveyed rather than implied by the separators.",
			"The last item is aria-current=page and is not a link, because it goes nowhere.",
			"Separators are aria-hidden; they are punctuation, not content.",
			"The ellipsis itself is aria-hidden; give its DropdownMenuTrigger a label such as Show more levels.",
			"Part names and data-slot values match shadcn/ui, so this replaces an existing breadcrumb without touching call sites.",
		],
	},
	licenseOrigin: {
		source: "sivir-ui",
		url: "https://github.com/aidan-neel/sivir-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Aidan Neel",
	},
	impl: {
		react: {
			entry: "Breadcrumb",
			files: [
				{ path: "breadcrumb/breadcrumb.tsx", type: "registry:ui" },
				{ path: "breadcrumb/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "Breadcrumb",
			files: [
				{ path: "breadcrumb/breadcrumb.svelte", type: "registry:ui" },
				{ path: "breadcrumb/breadcrumb-list.svelte", type: "registry:ui" },
				{ path: "breadcrumb/breadcrumb-item.svelte", type: "registry:ui" },
				{ path: "breadcrumb/breadcrumb-link.svelte", type: "registry:ui" },
				{ path: "breadcrumb/breadcrumb-page.svelte", type: "registry:ui" },
				{ path: "breadcrumb/breadcrumb-separator.svelte", type: "registry:ui" },
				{ path: "breadcrumb/breadcrumb-ellipsis.svelte", type: "registry:ui" },
				{ path: "breadcrumb/context.ts", type: "registry:ui" },
				{ path: "breadcrumb/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["breadcrumb", "navigation", "trail", "ellipsis", "dropdown"],
});
