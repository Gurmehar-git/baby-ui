<script lang="ts">
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	ScrollArea,
} from "@baby-ui/svelte";
import type { Snippet } from "svelte";
import { docsSidebar, outlineSidebar } from "#lib/docs-sidebar.svelte.js";
import { mobileNav } from "#lib/mobile-nav.svelte.js";
import { prefs } from "#lib/preferences.svelte.js";
import { type SidebarGroup, siteNav } from "#lib/registry.js";
import { page } from "$app/state";
import Logo from "./logo.svelte";
import SidebarToggleIcon from "./sidebar-toggle-icon.svelte";
import SiteSearch from "./site-search.svelte";
import SiteSidebar from "./site-sidebar.svelte";

let { groups, children }: { groups: SidebarGroup[]; children: Snippet } = $props();

const nav = $derived(siteNav(page.data.categories ?? []));
// The top row, then the four areas the library leads with, so both are one tap away on phones.
const drawerLinks = $derived([
	...nav.map(({ href, label, match }) => ({ href, label, match })),
	...nav
		.flatMap((item) => item.menu ?? [])
		.filter((link) => link.featured)
		.map(({ href, label }) => ({ href, label, match: [href] })),
]);
const hasOutline = $derived(
	page.route.id === "/(library)/components/[category]/[slug]" ||
		page.route.id === "/(library)/docs/[...slug]",
);
const library = $derived(prefs.layout === "library");
const playground = $derived(prefs.layout === "playground");
let desktop = $state(false);
$effect(() => {
	const query = matchMedia("(min-width: 768px)");
	const sync = () => (desktop = query.matches);
	sync();
	query.addEventListener("change", sync);
	return () => query.removeEventListener("change", sync);
});

// Rail state lives on <html>, so the fixed and in-layout forms share one toggle contract.
$effect(() => {
	const left = docsSidebar.current ? "open" : "closed";
	const root = document.documentElement.dataset;
	if (root.leftRail === left) return;
	root.leftRail = left;
});
$effect(() => {
	const right = library && hasOutline && outlineSidebar.current ? "open" : "closed";
	const root = document.documentElement.dataset;
	if (root.rightCol === right) return;
	root.rightCol = right;
});

function active(match: string[]) {
	const path = page.url.pathname;
	return match.some((m) => path === m || path.startsWith(`${m}/`));
}
</script>

{#snippet sidebarContent(closeOnNavigate = false)}
	<div class="shrink-0 bg-card pt-2 pb-3">
		<SiteSearch expanded />
	</div>
	<ScrollArea
		maxHeight="none"
		class="min-h-0 flex-1 [&_[data-slot=scroll-area-scrollbar]]:hidden [&>span]:from-card"
	>
		<div class="pb-4">
			<SiteSidebar
				{groups}
				showSearch={false}
				onNavigate={closeOnNavigate ? () => (docsSidebar.current = false) : undefined}
			/>
		</div>
	</ScrollArea>
{/snippet}

<!-- Library resizes grid tracks; Playground overlays the same rails as fixed drawers. -->
<div
	class={[
		"grid min-h-[calc(100dvh-var(--header-h))] min-w-0 grid-cols-[minmax(0,1fr)] bg-card px-4 [--right-sidebar-width:20rem] md:gap-0 md:px-0 md:pr-2 md:pb-2",
		library
			? [
					"md:grid-cols-[16rem_minmax(0,1fr)] md:[[data-left-rail=closed]_&]:grid-cols-[0rem_minmax(0,1fr)]",
					"transition-[grid-template-columns] ease-[var(--ease-drawer)] motion-reduce:transition-none",
					docsSidebar.current
						? "duration-[var(--duration-drawer)]"
						: "duration-[var(--duration-overlay)]",
				]
			: "md:grid-cols-[minmax(0,1fr)]",
	]}
>
	{#if library}
	<div class="hidden min-w-0 overflow-clip md:block">
		<div
			id="docs-sidebar"
			inert={!docsSidebar.current}
			class="sticky top-(--header-h) flex h-[calc(100dvh-var(--header-h))] w-64 flex-col overflow-hidden bg-card px-4"
		>
			{@render sidebarContent()}
		</div>
	</div>
	{/if}
	<div class="min-w-0 bg-background md:rounded-b-3xl md:border md:border-border md:border-t-0 md:px-10 xl:px-14">
		<div
			class={[
				"min-w-0",
				library && hasOutline && [
					"grid transition-[grid-template-columns] ease-[var(--ease-drawer)] motion-reduce:transition-none xl:grid-cols-[minmax(0,1fr)_0rem] xl:[[data-right-col=open]_&]:grid-cols-[minmax(0,1fr)_20rem]",
					outlineSidebar.current
						? "duration-[var(--duration-drawer)]"
						: "duration-[var(--duration-overlay)]",
				],
			]}
		>
			{@render children()}
		</div>
	</div>
</div>

{#if playground && desktop}
	<Drawer bind:open={docsSidebar.current} direction="left">
		<DrawerContent
			handle={false}
			class="w-64! max-w-[85vw]! rounded-none! border-border border-r bg-card! px-4 shadow-xl [&_[data-slot=drawer-surface]]:p-0"
		>
			<DrawerHeader class="h-14 shrink-0 flex-row items-center justify-between gap-3 p-0 pr-0">
				<DrawerTitle class="sr-only">Navigation</DrawerTitle>
				<a
					href="/"
					class="group flex items-center gap-2.5 font-semibold text-foreground text-sm tracking-tight"
				>
					<Logo class="size-6 text-foreground" />
					<span class="font-semibold font-display whitespace-nowrap">Baby UI</span>
				</a>
				<DrawerClose
					aria-label="Close navigation"
					class="static inline-flex size-8 items-center justify-center rounded-md text-foreground/75 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
				>
					<SidebarToggleIcon open class="size-[18px]" />
				</DrawerClose>
			</DrawerHeader>
			{@render sidebarContent(true)}
		</DrawerContent>
	</Drawer>
{/if}

<Drawer bind:open={mobileNav.open}>
	<DrawerContent>
		<DrawerHeader>
			<DrawerTitle class="text-base">Menu</DrawerTitle>
		</DrawerHeader>
		<div class="scrollbar-hide mt-2 flex max-h-[70dvh] flex-col gap-5 overflow-y-auto px-1 pb-2">
			<nav class="flex flex-wrap gap-1">
				{#each drawerLinks as item (item.href)}
					<a
						href={item.href}
						onclick={() => (mobileNav.open = false)}
						class={[
							"rounded-md px-3 py-1.5 text-sm transition-colors",
							active(item.match)
								? "font-medium text-foreground"
								: "text-foreground/70 hover:text-foreground",
						]}
					>
						{item.label}
					</a>
				{/each}
			</nav>
			<SiteSidebar
				{groups}
				onNavigate={() => (mobileNav.open = false)}
			/>
		</div>
	</DrawerContent>
</Drawer>
