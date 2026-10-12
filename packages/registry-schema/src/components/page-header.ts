import { defineComponent } from "../index.ts";

const VARIANTS = ["static", "sticky"];

const files = (main: string) => [
	{ path: `page-header/${main}`, type: "registry:ui" as const },
	{ path: "page-header/header.ts", type: "registry:ui" as const },
	{ path: "page-header/variants.ts", type: "registry:ui" as const },
	{ path: "lib/cn.ts", type: "registry:lib" as const },
];

const deps = ["avatar", "badge", "breadcrumb", "rolling-digits", "tabs"];

export const pageHeader = defineComponent({
	slug: "page-header",
	name: "Page Header",
	description:
		"An app page header with breadcrumbs, a title with status and people, actions and counted tabs; the sticky variant condenses as the page scrolls.",
	category: "blocks",
	status: "stable",
	variants: { variant: VARIANTS },
	props: [
		{
			name: "title",
			type: "string",
			description: "The page's h1.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "Scrolls away, or pins and condenses once the page scrolls.",
			default: "static",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "breadcrumbs",
			type: "{ label: string; href?: string }[]",
			description: "Trail to this page; the last crumb is the current page.",
			control: { kind: "none" },
		},
		{
			name: "status",
			type: "{ label: string; variant?: BadgeVariant }",
			description: "A badge beside the title.",
			control: { kind: "none" },
		},
		{
			name: "avatars",
			type: "{ src: string; alt?: string }[]",
			description: "People on the page; four show, the rest count.",
			control: { kind: "none" },
		},
		{
			name: "actions",
			type: "ReactNode | Snippet",
			description: "Buttons on the right.",
			control: { kind: "none" },
		},
		{
			name: "tabs",
			type: "{ value: string; label: string; count?: number }[]",
			description: "Underline tabs; counts roll to new values. Pass panels as children.",
			control: { kind: "none" },
		},
		{
			name: "tab",
			type: "string",
			description: "Active tab. Controlled with onTabChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The header condenses without easing.",
		behaviour: [
			"Sticky: once the page scrolls, breadcrumbs and description fold away and the title shrinks.",
			"Tab counts roll to their new value; the tab indicator slides.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["ArrowLeft", "ArrowRight"], action: "Move between tabs" }],
		notes: [
			"The title is the page's h1 and labels the header.",
			"Breadcrumbs are a labelled nav; the current page is marked.",
		],
	},
	guidance: {
		when: ["The top of an app page: a project, a record, a settings section."],
		whenNot: [{ text: "A marketing site's top navigation.", use: "mega-navbar" }],
		responsive: ["Actions wrap under the title when space runs out."],
		performance: ["One IntersectionObserver drives condensing; no scroll listeners."],
		ai: ["One primary action in `actions`; put the rest in a dropdown menu."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "PageHeader",
			files: files("page-header.tsx"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
		svelte: {
			entry: "PageHeader",
			files: files("page-header.svelte"),
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: deps,
		},
	},
	keywords: ["page header", "header", "breadcrumbs", "tabs", "title", "app", "sticky"],
});
