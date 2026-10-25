<script lang="ts">
import { IconChevronRight } from "@baby-ui/icons";
import { Badge } from "@baby-ui/svelte";
import type { Snippet } from "svelte";

let {
	title,
	description,
	breadcrumbs,
	tags = [],
	meta,
	actions,
}: {
	title: string;
	description?: string;
	breadcrumbs: { label: string; href?: string }[];
	tags?: string[];
	meta?: Snippet;
	actions?: Snippet;
} = $props();
</script>

<header>
	<nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-sm">
		{#each breadcrumbs as item, index (item.label)}
			{#if index > 0}<IconChevronRight size={14} class="text-muted-foreground" />{/if}
			{#if item.href}
				<a
					href={item.href}
					class="text-muted-foreground transition-colors duration-(--duration-fast) hover:text-foreground motion-reduce:transition-none"
				>
					{item.label}
				</a>
			{:else}
				<span aria-current="page" class="font-medium text-foreground">{item.label}</span>
			{/if}
		{/each}
	</nav>

	<div class="mt-5 grid min-w-0 gap-x-6 @xl:grid-cols-[minmax(0,1fr)_auto]">
		<div class="flex min-w-0 flex-wrap items-center gap-3 @xl:col-start-1 @xl:row-start-1">
			<h1 class="text-balance font-medium text-3xl text-foreground tracking-tight">{title}</h1>
			{@render meta?.()}
		</div>

		{#if description}
			<p class="mt-3 max-w-3xl text-pretty text-base text-muted-foreground leading-7 @xl:col-start-1">
				{description}
			</p>
		{/if}
		{#if tags.length}
			<div class="mt-4 flex flex-wrap gap-1.5 @xl:col-start-1" aria-label="Page tags">
				{#each tags as tag (tag)}
					<Badge variant="secondary" size="sm" class="font-normal text-muted-foreground">{tag}</Badge>
				{/each}
			</div>
		{/if}
		{#if actions}
			<div class="mt-4 flex shrink-0 flex-wrap items-center gap-2 self-start @xl:col-start-2 @xl:row-start-1 @xl:mt-0">
				{@render actions()}
			</div>
		{/if}
	</div>
</header>
