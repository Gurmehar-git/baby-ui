<script lang="ts">
import {
	IconBackground,
	IconBook,
	IconChartBar,
	IconComponents,
	IconLayoutColumns,
	IconLayoutGrid,
	IconMail,
	IconPhoto,
	IconPlayerPlay,
	IconRobot,
	IconSearch,
	IconStack2,
	IconTypography,
} from "@baby-ui/icons";
import type { Category } from "@baby-ui/registry-schema";
import {
	Button,
	Command,
	CommandBar,
	CommandDialog,
	CommandEmpty,
	CommandFilter,
	CommandFilters,
	CommandFooter,
	CommandGroup,
	CommandHint,
	CommandInput,
	CommandItem,
	CommandList,
	Shortcut,
} from "@baby-ui/svelte";
import type { Component } from "svelte";
import { track } from "#lib/analytics.js";
import { CATEGORY_LABEL, type CatalogItem, loadCatalog } from "#lib/registry.js";
import { scoreEntry } from "#lib/search-score.js";
import { goto } from "$app/navigation";

let open = $state(false);
let filter = $state("all");
let query = $state("");
let mac = $state(false);
let catalog = $state<CatalogItem[]>([]);

const PAGES = [
	{ href: "/docs", name: "Introduction", keywords: "docs about overview" },
	{
		href: "/docs/installation",
		name: "Installation",
		keywords: "setup cli shadcn install",
	},
	{ href: "/docs/theming", name: "Theming", keywords: "tokens colours dark mode motion" },
	{
		href: "/docs/mcp",
		name: "MCP",
		keywords: "ai agent cursor claude webmcp server tools",
	},
	{ href: "/components", name: "All components", keywords: "browse registry catalog" },
];

const CATEGORY_ICON: Record<Category, Component<{ size?: number }>> = {
	base: IconComponents,
	blocks: IconLayoutColumns,
	advanced: IconStack2,
	animated: IconPlayerPlay,
	agents: IconRobot,
	text: IconTypography,
	backgrounds: IconBackground,
	charts: IconChartBar,
	"og-images": IconPhoto,
	emails: IconMail,
};

// The catalog is fetched on first open, so pages don't carry every component's metadata.
$effect(() => {
	if (open && !catalog.length) void loadCatalog().then((items) => (catalog = items));
});

$effect(() => {
	mac = navigator.platform.toLowerCase().includes("mac");
});

// Each new open starts on everything, like a fresh search.
$effect(() => {
	if (!open) return;
	filter = "all";
	query = "";
});

type Entry = { name: string; href: string; keywords: string };
type Section = {
	id: string;
	label: string;
	icon: Component<{ size?: number }>;
	items: Entry[];
};

// Docs first, then categories in order; titles and tags only, never prose.
const sections = $derived<Section[]>([
	{ id: "docs", label: "Docs", icon: IconBook, items: PAGES },
	...(Object.keys(CATEGORY_ICON) as Category[])
		.map((category) => ({
			id: category,
			label: CATEGORY_LABEL[category],
			icon: CATEGORY_ICON[category],
			items: catalog
				.filter((item) => item.category === category)
				.sort((x, y) => x.name.localeCompare(y.name))
				.map((item) => ({
					name: item.name,
					href: item.href,
					keywords: [item.slug, ...item.keywords].join(" "),
				})),
		}))
		.filter((section) => section.items.length > 0),
]);

const best = (section: Section) =>
	Math.max(
		0,
		...section.items.map((item) => scoreEntry(item.name, item.keywords, query)),
	);

// While typing, the section holding the best match leads, so an exact title is never buried.
const shown = $derived(
	sections
		.filter((section) => filter === "all" || section.id === filter)
		.map((section) => ({ section, score: query.trim() ? best(section) : 1 }))
		.filter(({ score }) => score > 0)
		.sort((x, y) => y.score - x.score)
		.map(({ section }) => section),
);

const rank = (value: string, search: string, keywords?: string[]) =>
	scoreEntry(value, keywords?.join(" ") ?? "", search);

function go(href: string) {
	open = false;
	track("search_selected", { href });
	void goto(href);
}
</script>

<Button
	variant="ghost"
	size="icon"
	onclick={() => (open = true)}
	aria-label="Search"
	aria-keyshortcuts={mac ? "Meta+K" : "Control+K"}
	title="Search ({mac ? "⌘K" : "Ctrl K"})"
	class="shrink-0 rounded-xl text-foreground/75 hover:text-foreground"
>
	<IconSearch size={17} />
	<!-- Owns Ctrl/⌘+K; hidden, since the title already names the shortcut. -->
	<Shortcut shortcut="mod+k" ontrigger={() => (open = !open)} class="hidden" />
</Button>

<CommandDialog
	bind:open
	variant="launcher"
	label="Search"
	description="Search the docs and every component."
	class="w-[min(48rem,calc(100vw-2rem))]"
>
	<Command filter={rank}>
		<CommandBar>
			<CommandInput
				placeholder="Search the library…"
				hint={mac ? "⌘K" : "Ctrl K"}
				oninput={(e) => (query = e.currentTarget.value)}
			/>
			<CommandFilters bind:value={filter} label="Show">
				<CommandFilter value="all" label="Everything"><IconLayoutGrid size={16} /></CommandFilter>
				<CommandFilter value="docs" label="Docs"><IconBook size={16} /></CommandFilter>
				{#each sections.slice(1) as section (section.id)}
					{@const Icon = section.icon}
					<CommandFilter value={section.id} label={section.label}><Icon size={16} /></CommandFilter>
				{/each}
			</CommandFilters>
		</CommandBar>
		<CommandList class="max-h-[min(24rem,52dvh)]">
			<CommandEmpty>Nothing matches that.</CommandEmpty>
			{#each shown as section (section.id)}
				{@const Icon = section.icon}
				<CommandGroup heading={section.label}>
					{#each section.items as item (item.href)}
						<CommandItem value={item.name} keywords={item.keywords} onclick={() => go(item.href)}>
							<Icon size={16} />
							{item.name}
						</CommandItem>
					{/each}
				</CommandGroup>
			{/each}
		</CommandList>
		<CommandFooter>
			<span class="flex items-center gap-4">
				<CommandHint keys={["↑", "↓"]}>Move</CommandHint>
				<CommandHint keys={["↵"]}>Open</CommandHint>
			</span>
			<CommandHint keys={["Esc"]}>Close</CommandHint>
		</CommandFooter>
	</Command>
</CommandDialog>
