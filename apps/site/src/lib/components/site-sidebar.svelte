<script lang="ts">
import {
	IconAdjustmentsHorizontal,
	IconBackground,
	IconBook,
	IconChartBar,
	IconComponents,
	IconLayoutGrid,
	IconMail,
	IconPhoto,
	IconPlayerPlay,
	IconRobot,
	IconStack2,
	IconTag,
	IconTypography,
} from "@baby-ui/icons";
import type { Category } from "@baby-ui/registry-schema/categories";
import { DocsNav, type DocsNavSection } from "@baby-ui/svelte";
import { type Component, untrack } from "svelte";
import type { SidebarGroup } from "#lib/registry.js";
import { DOCS_MENU, siteNav } from "#lib/registry.js";
import { page } from "$app/state";
import SiteSearch from "./site-search.svelte";

let {
	groups,
	showSearch = true,
	onNavigate,
}: {
	groups: SidebarGroup[];
	showSearch?: boolean;
	onNavigate?: () => void;
} = $props();

type Icon = Component<{ size?: number; class?: string; "aria-hidden"?: boolean }>;

const CATEGORY_ICON: Record<Category, Icon> = {
	base: IconComponents,
	blocks: IconLayoutGrid,
	advanced: IconStack2,
	animated: IconPlayerPlay,
	agents: IconRobot,
	text: IconTypography,
	backgrounds: IconBackground,
	charts: IconChartBar,
	"og-images": IconPhoto,
	emails: IconMail,
};

const PRIMARY_ICON: Record<string, Icon> = {
	"/components": IconComponents,
	"/docs": IconBook,
	"/studio": IconAdjustmentsHorizontal,
	"/pricing": IconTag,
};

function navBadge(item: SidebarGroup["items"][number]): {
	badge?: string;
	badgeVariant?: "gold" | "info" | "success" | "default";
} {
	if (item.tier === "pro") return { badge: "Pro", badgeVariant: "gold" };
	if (item.fresh === "new") return { badge: "New", badgeVariant: "info" };
	if (item.fresh === "updated") return { badge: "Updated", badgeVariant: "success" };
	return { badge: item.status !== "stable" ? item.status : undefined };
}

const sections = $derived.by<DocsNavSection[]>(() => {
	const navigation = siteNav(page.data.categories ?? []);
	const primary = ["/components", "/pricing", "/studio"]
		.map((href) => navigation.find((item) => item.href === href))
		.filter((item) => item !== undefined);
	const library = primary.find((item) => item.href === "/components");
	const pricing = primary.find((item) => item.href === "/pricing");
	const studio = primary.find((item) => item.href === "/studio");
	const direct = (
		item: (typeof primary)[number],
		label = item.label,
	): DocsNavSection => ({
		id: item.href,
		label,
		href: item.href,
		match: item.href === "/components" ? undefined : item.match,
		icon: PRIMARY_ICON[item.href],
	});

	return [
		...(library ? [direct(library, "Library")] : []),
		{
			id: "guides",
			label: "Docs",
			icon: IconBook,
			items: DOCS_MENU.map((item) => ({ href: item.href, label: item.label })),
		},
		...(pricing ? [direct(pricing)] : []),
		...(studio ? [direct(studio)] : []),
		...groups.map((group) => ({
			id: group.category,
			label: group.label,
			count: group.items.length,
			icon: CATEGORY_ICON[group.category],
			items: group.items.map((item) => ({
				href: item.href,
				label: item.name,
				...navBadge(item),
			})),
		})),
	];
});

const currentSection = $derived.by(() => {
	const path = page.url.pathname;
	if (path === "/docs" || path.startsWith("/docs/")) return "guides";
	return groups.find((group) =>
		group.items.some((item) => path === item.href || path.startsWith(`${item.href}/`)),
	)?.category;
});

let open = $state<string[]>([]);
let routedPath = "";

$effect(() => {
	const path = page.url.pathname;
	const active = currentSection;
	if (path === routedPath) return;
	routedPath = path;
	const currentOpen = untrack(() => open);
	if (active && !currentOpen.includes(active)) open = [...currentOpen, active];
});
</script>

<div class="flex flex-col gap-3">
	{#if showSearch}<SiteSearch expanded />{/if}
	<DocsNav
		{sections}
		current={page.url.pathname}
		variant="sidebar"
		connector="curve"
		bind:open
		onNavigate={() => onNavigate?.()}
		label="Site navigation"
	/>
</div>
