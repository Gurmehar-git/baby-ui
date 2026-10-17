import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { pageHeader as pageHeaderVariants } from "./variants";

const VARIANTS = ["static", "sticky"];

export const pageHeader = defineComponent({
	slug: "page-header",
	name: "Page Header",
	description:
		"An app page header from parts: breadcrumbs, a title with status and people, actions and counted tabs; the sticky variant condenses as the page scrolls.",
	category: "blocks",
	status: "stable",
	variants: variantsOf(pageHeaderVariants, ["variant"]),
	props: [
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"PageHeader: scrolls away, or pins PageHeaderBar and condenses it once the page scrolls.",
			default: "static",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "children",
			type: "ReactNode | Snippet",
			description:
				"PageHeader: PageHeaderBar and PageHeaderContent, inside a Tabs root when the page has tabs.",
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "number",
			description:
				"PageHeaderTabCount: the count beside a tab label; rolls to each new value.",
			required: true,
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
		},
		svelte: {
			entry: "PageHeader",
		},
	},
	keywords: ["page header", "header", "breadcrumbs", "tabs", "title", "app", "sticky"],
});
