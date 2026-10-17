// Client-safe: the zod-free categories entry plus types only from the schema. Anything that reads
// the spec list lives in #lib/server/registry.ts and reaches pages as load data.
import type { ComponentSpec } from "@baby-ui/registry-schema";
import {
	CATEGORIES,
	CATEGORY,
	type Category,
	categoryHref,
	docsPath,
	TOP_LEVEL_CATEGORIES,
} from "@baby-ui/registry-schema/categories";

/** Marketing count, floored to the ten below with a plus (182 reads "180+"). */
export const componentCountLabel = (count: number) => `${Math.floor(count / 10) * 10}+`;

// Derived from the schema's category table; add or change a category there, not here.
export const CATEGORY_LABEL = Object.fromEntries(
	CATEGORIES.map((c) => [c, CATEGORY[c].label]),
) as Record<Category, string>;

export const CATEGORY_BLURB = Object.fromEntries(
	CATEGORIES.map((c) => [c, CATEGORY[c].blurb]),
) as Record<Category, string>;

/** Categories served at `/<category>`, not /components. */
export const TOP_LEVEL = TOP_LEVEL_CATEGORIES;

export { categoryHref };

export const specHref = (spec: Pick<ComponentSpec, "category" | "slug">): string =>
	docsPath(spec);

/** A category that has at least one component, with its count. */
export type NavCategory = {
	category: Category;
	label: string;
	href: string;
	count: number;
};

/** What a component card or showcase panel needs, without the full spec. */
export type CardItem = {
	slug: string;
	name: string;
	description: string;
	href: string;
	category: Category;
	tier: ComponentSpec["tier"];
	isNew: boolean;
	isUpdated: boolean;
	defaults: Record<string, unknown>;
};

/** One search/catalog row; served from /catalog.json so pages don't carry it. */
export type CatalogItem = {
	slug: string;
	name: string;
	category: Category;
	tier: ComponentSpec["tier"];
	description: string;
	keywords: string[];
	href: string;
};

/** Task-first shelves over existing categories, served at `/<id>`. Items keep their category URL. */
export const COLLECTIONS = {
	data: {
		label: "Data",
		blurb: "Tables, stat cards and trees for products that show numbers and records.",
		slugs: [
			"records-table",
			"filter-table",
			"diff-table",
			"file-tree",
			"stat-card",
			"stat-card-map",
			"usage-card",
			"score-card",
			"status-monitor",
			"github-calendar",
		],
	},
	forms: {
		label: "Forms",
		blurb: "Fields and controls for sign-ups, settings and checkout, keyboard-first.",
		slugs: [
			"input",
			"input-group",
			"textarea",
			"label",
			"select",
			"combobox",
			"tag-input",
			"checkbox",
			"radio-group",
			"switch",
			"slider",
			"color-picker",
			"input-otp",
			"calendar",
			"range-calendar",
			"date-field",
			"date-picker",
			"date-range-picker",
			"time-picker",
			"file-upload",
			"number-input",
			"multi-select",
		],
	},
} as const satisfies Record<
	string,
	{ label: string; blurb: string; slugs: readonly string[] }
>;

export type CollectionId = keyof typeof COLLECTIONS;
export const isCollection = (id: string): id is CollectionId =>
	Object.hasOwn(COLLECTIONS, id);

/** Sub-sections a category's listing page can group into, ordered for display. */
export const CATEGORY_GROUPS = {
	base: [
		{
			id: "inputs",
			label: "Inputs & Forms",
			slugs: [
				"input",
				"input-group",
				"input-otp",
				"textarea",
				"label",
				"select",
				"native-select",
				"combobox",
				"multi-select",
				"tag-input",
				"checkbox",
				"radio-group",
				"switch",
				"slider",
				"color-picker",
				"number-input",
				"file-upload",
				"form",
				"field",
				"calendar",
				"range-calendar",
				"date-field",
				"date-picker",
				"date-range-picker",
				"time-picker",
			],
		},
		{
			id: "buttons",
			label: "Buttons & Actions",
			slugs: ["button", "toggle", "toggle-group", "copy-button", "shortcut"],
		},
		{
			id: "overlays",
			label: "Overlays",
			slugs: [
				"dialog",
				"alert-dialog",
				"sheet",
				"drawer",
				"responsive-dialog",
				"popover",
				"hover-card",
				"tooltip",
				"command",
			],
		},
		{
			id: "navigation",
			label: "Menus & Navigation",
			slugs: [
				"dropdown-menu",
				"context-menu",
				"navigation-menu",
				"breadcrumb",
				"pagination",
				"tabs",
			],
		},
		{
			id: "data-display",
			label: "Data Display",
			slugs: [
				"table",
				"data-table",
				"card",
				"avatar",
				"badge",
				"accordion",
				"collapsible",
				"separator",
				"scroll-area",
				"typography",
				"markdown",
				"code-block",
				"file-diff",
				"empty",
			],
		},
		{
			id: "feedback",
			label: "Feedback & Status",
			slugs: [
				"alert",
				"toast",
				"progress",
				"skeleton",
				"spinner",
				"show-more",
				"error-boundary",
			],
		},
		{
			id: "utility",
			label: "Utility",
			slugs: ["theme-toggle", "swappable"],
		},
	],
} as const satisfies Partial<
	Record<Category, { id: string; label: string; slugs: readonly string[] }[]>
>;

export type NavLink = { href: string; label: string };

/** Icon names the header maps to Tabler icons; this module stays free of Svelte. */
export type NavIcon =
	| "agents"
	| "data"
	| "forms"
	| "charts"
	| "base"
	| "text"
	| "animated"
	| "backgrounds"
	| "blocks"
	| "advanced"
	| "og-images"
	| "emails"
	| "intro"
	| "install"
	| "cli"
	| "theming"
	| "design"
	| "create"
	| "llms";

export type NavMenuItem = NavLink & {
	description: string;
	icon: NavIcon;
	/** The four areas the library leads with; the mobile drawer lists these beside the top row. */
	featured?: boolean;
};

export type NavItem = NavLink & {
	/** Path prefixes that mark this item current. */
	match: string[];
	/** Links shown in the shared mega panel instead of navigating on click. */
	menu?: NavMenuItem[];
	/** The panel's promoted closing link. */
	footer?: NavLink & { hint: string };
};

/** The global top-level nav, shared by the header's mega menu and the mobile drawer's top row. */
export function siteNav(categories: NavCategory[]): NavItem[] {
	const byId = new Map(categories.map((c) => [c.category, c]));
	const category = (id: Category, featured = false): NavMenuItem[] => {
		const c = byId.get(id);
		return c
			? [
					{
						href: c.href,
						label: c.label,
						description: CATEGORY_BLURB[c.category],
						icon: id as NavIcon,
						featured,
					},
				]
			: [];
	};
	const collection = (id: CollectionId): NavMenuItem => ({
		href: `/${id}`,
		label: COLLECTIONS[id].label,
		description: COLLECTIONS[id].blurb,
		icon: id,
		featured: true,
	});
	const components: NavMenuItem[] = [
		...category("agents", true),
		collection("data"),
		collection("forms"),
		...category("charts", true),
		...(
			[
				"base",
				"text",
				"animated",
				"backgrounds",
				"blocks",
				"advanced",
				"og-images",
				"emails",
			] as const
		).flatMap((id) => category(id)),
	];
	return [
		{
			href: "/components",
			label: "Components",
			match: ["/components", ...components.map((item) => item.href)],
			menu: components,
			footer: {
				href: "/components",
				label: "All components",
				hint: "Browse the full catalog",
			},
		},
		{
			href: "/docs",
			label: "Docs",
			match: ["/docs"],
			menu: [
				{
					href: "/docs",
					label: "Introduction",
					description: "What Baby UI is and how it installs.",
					icon: "intro",
				},
				{
					href: "/docs/installation",
					label: "Installation",
					description: "Set up a React or Svelte project and add a component.",
					icon: "install",
				},
				{
					href: "/docs/cli",
					label: "CLI",
					description: "Add, diff, update, repair and undo from one command.",
					icon: "cli",
				},
				{
					href: "/docs/theming",
					label: "Theming",
					description: "Tokens, colours and motion variables.",
					icon: "theming",
				},
				{
					href: "/design-system",
					label: "Design system",
					description: "The scale, tokens and states, measured live.",
					icon: "design",
				},
				{
					href: "/create",
					label: "Create",
					description: "Pick accent, radius and font; copy the CSS.",
					icon: "create",
				},
				{
					href: "/docs/mcp",
					label: "MCP",
					description: "Search, read and install components from your AI tool.",
					icon: "llms",
				},
				{
					href: "/llms.txt",
					label: "llms.txt",
					description: "Every component as plain text for AI tools.",
					icon: "llms",
				},
			],
			footer: {
				href: "/docs/installation",
				label: "Read the docs",
				hint: "Start with installation",
			},
		},
		{ href: "/studio", label: "Studio", match: ["/studio"] },
		...(__SHOW_PRO__
			? [{ href: "/pricing", label: "Pricing", match: ["/pricing"] }]
			: []),
	];
}

export type SearchItem = {
	href: string;
	name: string;
	slug: string;
	group: string;
	description: string;
	/** Space-separated words the command filter also matches. */
	keywords: string;
};

/** Flat index for the site search. */
export function searchItems(catalog: CatalogItem[]): SearchItem[] {
	return catalog
		.map((s) => ({
			href: s.href,
			name: s.name,
			slug: s.slug,
			group: CATEGORY_LABEL[s.category],
			description: s.description,
			// The command filter matches these words too, so a search finds what a component does.
			keywords: [s.slug, CATEGORY_LABEL[s.category], ...s.keywords, s.description].join(
				" ",
			),
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}

let catalogRequest: Promise<CatalogItem[]> | undefined;

/** The prerendered catalog, fetched once per session on first need. */
export function loadCatalog(): Promise<CatalogItem[]> {
	catalogRequest ??= fetch("/catalog.json")
		.then((res) => (res.ok ? (res.json() as Promise<CatalogItem[]>) : []))
		.catch(() => {
			catalogRequest = undefined;
			return [];
		});
	return catalogRequest;
}

export type SidebarGroup = {
	category: Category;
	label: string;
	items: {
		slug: string;
		name: string;
		href: string;
		status: ComponentSpec["status"];
		tier: ComponentSpec["tier"];
		fresh: "new" | "updated" | null;
	}[];
};

export type AdjacentComponent = { name: string; href: string };

// Lives in the schema so endpoints, auto demos and `pnpm emails` share one rule.
export { defaultProps } from "@baby-ui/registry-schema";
