<script lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@baby-ui/svelte";
import CardGallery from "#lib/components/card-gallery.svelte";
import GalleryIntro from "#lib/components/gallery-intro.svelte";
import Seo from "#lib/components/seo.svelte";
import {
	breadcrumbLd,
	categoryKeywords,
	collectionLd,
	metaDescription,
} from "#lib/seo.js";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
let activeGroup = $state("");

const label = $derived(data.label);
const path = $derived(data.path);
const topLevel = $derived(data.topLevel);
const heading = $derived(topLevel ? label : `${label} Components`);
const back = $derived(
	topLevel ? undefined : { label: "Components", href: "/components" },
);
const count = $derived(data.items.length);
const description = $derived(
	metaDescription(
		data.blurb,
		`${count} components for React and Svelte, via the shadcn CLI.`,
	),
);
$effect(() => {
	if (data.groups && !data.groups.some((group) => group.id === activeGroup)) {
		activeGroup = data.groups[0]?.id ?? "";
	}
});
</script>

<Seo
	title="{heading} for React & Svelte"
	{description}
	tag="{count} components"
	keywords={categoryKeywords(label)}
	jsonLd={[
		collectionLd({
			name: heading,
			description,
			path,
			items: data.items.map((i) => ({
				name: i.name,
				path: i.href,
				description: i.description,
			})),
		}),
		breadcrumbLd(
			topLevel
				? [{ name: heading, path }]
				: [
						{ name: "Components", path: "/components" },
						{ name: heading, path },
					],
		),
	]}
/>

<main class="max-w-7xl min-w-0 py-6 xl:col-span-2">
	<GalleryIntro title={label} description={data.blurb} items={data.items} {back} compact />
	{#if data.groups}
		<Tabs bind:value={activeGroup} variant="underline">
			<div class="sticky top-(--header-h) z-20 bg-background/95 pt-5 backdrop-blur-md">
				<TabsList aria-label="{label} groups" class="min-w-full justify-start">
					{#each data.groups as group (group.id)}
						<TabsTrigger value={group.id}>
							{group.label}
							<span class="text-xs tabular-nums">{group.items.length}</span>
						</TabsTrigger>
					{/each}
				</TabsList>
			</div>
			{#each data.groups as group (group.id)}
				<TabsContent value={group.id} class="mt-10">
					<div class="mb-3 flex items-baseline gap-2">
						<h2 class="font-medium text-base text-foreground tracking-tight">{group.label}</h2>
						<span class="text-muted-foreground text-xs tabular-nums">{group.items.length}</span>
					</div>
					<CardGallery items={group.items} mode="grid" />
				</TabsContent>
			{/each}
		</Tabs>
	{:else}
		<div class="mt-10"><CardGallery items={data.items} mode="grid" /></div>
	{/if}

	<section aria-labelledby="category-about" class="mt-12 max-w-2xl text-muted-foreground text-sm leading-relaxed">
		<h2 id="category-about" class="font-medium text-base text-foreground">About {heading}</h2>
		<p class="mt-2">
			{count} {heading} for React and Svelte, each with a TypeScript and a JavaScript
			version. They install as source with the shadcn CLI, take their colours from your theme
			tokens, and respect reduced motion and keyboard use.
		</p>
		<p class="mt-2">
			Start with <a href={data.items[0]?.href} class="font-medium text-foreground underline underline-offset-4"
				>{data.items[0]?.name}</a
			>, or read the <a href="/docs/installation" class="font-medium text-foreground underline underline-offset-4"
				>install guide</a
			>.
		</p>
	</section>
</main>
