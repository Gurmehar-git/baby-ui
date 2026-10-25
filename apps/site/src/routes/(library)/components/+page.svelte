<script lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@baby-ui/svelte";
import CardGallery from "#lib/components/card-gallery.svelte";
import GalleryIntro from "#lib/components/gallery-intro.svelte";
import Seo from "#lib/components/seo.svelte";
import { CATEGORY_LABEL, componentCountLabel } from "#lib/registry.js";
import { breadcrumbLd, collectionLd } from "#lib/seo.js";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();

let activeGroup = $state("");

const total = $derived(data.sections.reduce((n, s) => n + s.items.length, 0));
const fresh = $derived(data.fresh);
const SUMMARY = $derived(
	`${total} components, charts included, each with a React and a Svelte port built from the same spec.`,
);
const groups = $derived([
	...(fresh.length ? [{ id: "new", label: "Newly added", items: fresh }] : []),
	...data.sections.map((s) => ({
		id: s.category,
		label: CATEGORY_LABEL[s.category],
		items: s.items,
	})),
]);
const everything = $derived(data.sections.flatMap((s) => s.items));
const DESCRIPTION = $derived(
	`Browse ${componentCountLabel(total)} animated, accessible React and Svelte components: controls, blocks, charts, text effects, backgrounds and AI agent UI.`,
);
$effect(() => {
	if (!groups.some((group) => group.id === activeGroup))
		activeGroup = groups[0]?.id ?? "";
});
</script>

<Seo
	title="React & Svelte Components"
	description={DESCRIPTION}
	tag="{componentCountLabel(total)} components"
	jsonLd={[
		collectionLd({
			name: "Baby UI components",
			description: DESCRIPTION,
			path: "/components",
			items: data.sections.flatMap((s) => s.items.map((i) => ({ name: i.name, path: i.href }))),
		}),
		breadcrumbLd([{ name: "Components", path: "/components" }]),
	]}
/>

<main class="max-w-7xl min-w-0 py-6 xl:col-span-2">
	<GalleryIntro
		title="React & Svelte components, built to stay yours."
		description={SUMMARY}
		items={everything}
		compact
	/>
	<Tabs bind:value={activeGroup} variant="underline">
		<div class="sticky top-(--header-h) z-20 bg-background/95 pt-5 backdrop-blur-md">
			<TabsList aria-label="Component categories" class="min-w-full justify-start">
				{#each groups as group (group.id)}
					<TabsTrigger value={group.id}>
						{group.label}
						<span class="text-xs tabular-nums">{group.items.length}</span>
					</TabsTrigger>
				{/each}
			</TabsList>
		</div>
		{#each groups as group (group.id)}
			<TabsContent value={group.id} class="mt-10">
				<div class="mb-3 flex items-baseline gap-2">
					<h2 class="font-medium text-base text-foreground tracking-tight">{group.label}</h2>
					<span class="text-muted-foreground text-xs tabular-nums">{group.items.length}</span>
				</div>
				<CardGallery items={group.items} mode="grid" />
			</TabsContent>
		{/each}
	</Tabs>
</main>
