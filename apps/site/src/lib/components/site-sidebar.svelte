<script lang="ts">
import {
	DocsNav,
	type DocsNavConnector,
	type DocsNavItem,
	type DocsNavSection,
} from "@baby-ui/svelte";
import type { SidebarGroup } from "#lib/registry.js";
import { page } from "$app/state";

let {
	groups,
	connector = "tick",
	rungs = false,
	onNavigate,
}: {
	groups: SidebarGroup[];
	connector?: DocsNavConnector;
	rungs?: boolean;
	onNavigate?: () => void;
} = $props();

// Pro outranks New/Updated, which outrank a status; Pro alone gets the gold shine.
function navBadge(
	item: SidebarGroup["items"][number],
): Pick<DocsNavItem, "badge" | "badgeVariant"> {
	if (item.tier === "pro") return { badge: "Pro", badgeVariant: "gold" };
	if (item.fresh === "new") return { badge: "New", badgeVariant: "info" };
	if (item.fresh === "updated") return { badge: "Updated", badgeVariant: "success" };
	return { badge: item.status !== "stable" ? item.status : undefined };
}

const GUIDES: DocsNavSection = {
	id: "guides",
	label: "Getting Started",
	items: [
		{ href: "/docs", label: "Introduction" },
		{ href: "/docs/installation", label: "Installation" },
		{ href: "/docs/theming", label: "Theming" },
		{ href: "/docs/mcp", label: "MCP" },
	],
};

const sections = $derived<DocsNavSection[]>([
	GUIDES,
	...groups.map((group) => ({
		id: group.category,
		label: group.label,
		count: group.items.length,
		items: group.items.map((item) => ({
			href: item.href,
			label: item.name,
			...navBadge(item),
		})),
	})),
]);
</script>

<DocsNav
	{sections}
	current={page.url.pathname}
	{connector}
	{rungs}
	label="Site navigation"
	onNavigate={() => onNavigate?.()}
/>
