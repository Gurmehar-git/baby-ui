import { defineComponent } from "../index.ts";

export const pagination = defineComponent({
	slug: "pagination",
	name: "Pagination",
	description:
		"Page links in a sliding window, with the first and last always reachable.",
	category: "base",
	status: "stable",
	props: [
		{
			name: "page",
			type: "number",
			description: "Current page, 1-based. Bindable.",
			default: 4,
			control: { kind: "number", min: 1, max: 20, step: 1 },
		},
		{
			name: "total",
			type: "number",
			description: "Total page count.",
			default: 12,
			control: { kind: "number", min: 1, max: 50, step: 1 },
		},
		{
			name: "siblings",
			type: "number",
			description: "Pages shown either side of the current one.",
			default: 1,
			control: { kind: "number", min: 0, max: 3, step: 1 },
		},
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			description:
				"PaginationLink, PaginationPrevious and PaginationNext: button size, as in shadcn/ui.",
			default: "default",
			control: { kind: "select", options: ["xs", "sm", "default", "lg", "xl"] },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Colour changes only; nothing squishes.",
		behaviour: [
			"Page buttons tint on hover, fill when current and squish to 0.93 on press, easing back over 250ms.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Tab"], action: "Reaches each page link and both arrows" }],
		notes: [
			"A nav labelled Pagination; the current page carries aria-current=page.",
			"The arrows have accessible names, because a bare chevron is announced as button.",
			"Part names and data-slot values match shadcn/ui, so this replaces an existing pagination without touching call sites.",
			"`paginationRange` is a plain function, not a component, so the window logic is reusable without adopting the markup.",
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
			entry: "Pagination",
			files: [
				{ path: "pagination/pagination.tsx", type: "registry:ui" },
				{ path: "pagination/range.ts", type: "registry:ui" },
				{ path: "pagination/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
		svelte: {
			entry: "Pagination",
			files: [
				{ path: "pagination/pagination.svelte", type: "registry:ui" },
				{ path: "pagination/pagination-content.svelte", type: "registry:ui" },
				{ path: "pagination/pagination-item.svelte", type: "registry:ui" },
				{ path: "pagination/pagination-link.svelte", type: "registry:ui" },
				{ path: "pagination/pagination-previous.svelte", type: "registry:ui" },
				{ path: "pagination/pagination-next.svelte", type: "registry:ui" },
				{ path: "pagination/pagination-ellipsis.svelte", type: "registry:ui" },
				{ path: "pagination/range.ts", type: "registry:ui" },
				{ path: "pagination/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
		},
	},
	keywords: ["pagination"],
});
