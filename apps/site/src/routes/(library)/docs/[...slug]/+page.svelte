<script lang="ts">
import { registry } from "virtual:docvia/registry";
import { IconArrowLeft, IconArrowRight, IconList } from "@baby-ui/icons";
import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@baby-ui/svelte";
import { Renderer } from "@docvia/core/svelte";
import ContentPageHeader from "#lib/components/content-page-header.svelte";
import DocsIntroCover from "#lib/components/docs-intro-cover.svelte";
import MobileNavDrawer from "#lib/components/mobile-nav-drawer.svelte";
import OutlineToggle from "#lib/components/outline-toggle.svelte";
import PageMenu from "#lib/components/page-menu.svelte";
import PropsRail from "#lib/components/props-rail.svelte";
import Seo from "#lib/components/seo.svelte";
import { outlineSidebar, playgroundOutlineDrawer } from "#lib/docs-sidebar.svelte.js";
import { prefs } from "#lib/preferences.svelte.js";
import { articleLd, breadcrumbLd } from "#lib/seo.js";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();

const title = $derived(data.page.data?.title ?? "Docs");
const description = $derived(data.page.data?.description ?? "Baby UI documentation.");
const path = $derived(data.slug === "index" ? "/docs" : `/docs/${data.slug}`);
const library = $derived(prefs.layout === "library");
let wide = $state(false);

$effect(() => {
	const query = matchMedia("(min-width: 1280px)");
	const sync = () => (wide = query.matches);
	sync();
	query.addEventListener("change", sync);
	return () => query.removeEventListener("change", sync);
});
</script>

<Seo
	{title}
	{description}
	type="article"
	tag="Docs"
	keywords={data.page.data?.tags}
	noindex={data.page.data?.draft === true}
	markdown="/docs/{data.slug}.md"
	jsonLd={[
		articleLd({ title, description, path }),
		breadcrumbLd(
			path === "/docs"
				? [{ name: "Docs", path }]
				: [
						{ name: "Docs", path: "/docs" },
						{ name: title, path },
					],
		),
	]}
/>

<!-- The drawer copy drops the heading (the drawer has a title) and the promo card. -->
{#snippet railContent(inRail = true)}
	<PropsRail slug={data.slug} outline={data.headings} heading={inRail} promo={inRail} />
{/snippet}

<main class="@container mx-auto w-full min-w-0 max-w-5xl py-8">
	<ContentPageHeader
		{title}
		{description}
		breadcrumbs={[{ label: "Docs", href: "/docs" }, { label: title }]}
		tags={data.page.data?.tags ?? []}
	>
		{#snippet actions()}
			<PageMenu
				markdownUrl="/docs/{data.slug}.md"
				copyText={data.page.data?.description ?? ""}
				name={data.page.data?.title ?? "docs"}
			/>
			{#if data.adjacent.prev}
				<Button
					href={data.adjacent.prev.href}
					variant="secondary"
					size="icon-sm"
					aria-label="Previous page: {data.adjacent.prev.label}"
					class="rounded-md"
				>
					<IconArrowLeft size={15} />
				</Button>
			{/if}
			{#if data.adjacent.next}
				<Button
					href={data.adjacent.next.href}
					variant="secondary"
					size="icon-sm"
					aria-label="Next page: {data.adjacent.next.label}"
					class="rounded-md"
				>
					<IconArrowRight size={15} />
				</Button>
			{/if}
			{#if data.headings.length}
				<MobileNavDrawer label="On this page" title="On this page" class="xl:hidden">
					{#snippet icon()}<IconList size={14} />{/snippet}
					{#snippet children()}
						{@render railContent(false)}
					{/snippet}
				</MobileNavDrawer>
			{/if}
			<OutlineToggle />
		{/snippet}
	</ContentPageHeader>
	{#if data.slug === "index"}
		<div class="mt-8 max-w-3xl"><DocsIntroCover /></div>
	{/if}
	<article class="prose-baby mt-8 max-w-3xl"><Renderer nodes={data.page.content} {registry} /></article>
	<div class="mt-10 flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-2 text-muted-foreground text-xs">
		<!-- A real link, not only the menu item: crawlers and agents follow it to the markdown twin. -->
		<a href="/docs/{data.slug}.md" target="_blank" rel="noopener" class="underline decoration-border underline-offset-4 transition-colors hover:text-foreground">
			View this page as Markdown
		</a>
		<p>
			Powered by
			<a
				href="https://docvia.dev"
				target="_blank"
				rel="noopener"
				class="font-medium underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
			>docvia</a>
		</p>
	</div>
</main>

{#if library}
	<aside aria-label="On this page" class="hidden min-w-0 overflow-clip xl:block">
		<div
			id="outline-sidebar"
			inert={!outlineSidebar.current}
			class="scrollbar-hide sticky top-[calc(var(--header-h)+2.5rem)] max-h-[calc(100dvh-var(--header-h)-4.5rem)] w-(--right-sidebar-width) overflow-y-auto pb-1 pl-8"
		>
			{@render railContent()}
		</div>
	</aside>
{:else if wide}
	<Drawer bind:open={playgroundOutlineDrawer.current} direction="right">
		<DrawerContent
			handle={false}
			class="w-80! max-w-[85vw]! rounded-none! border-border border-l bg-card! shadow-xl [&_[data-slot=drawer-surface]]:p-6"
		>
			<DrawerHeader class="sr-only"><DrawerTitle>On this page</DrawerTitle></DrawerHeader>
			<DrawerClose />
			<div id="outline-sidebar" class="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
				{@render railContent()}
			</div>
		</DrawerContent>
	</Drawer>
{/if}
