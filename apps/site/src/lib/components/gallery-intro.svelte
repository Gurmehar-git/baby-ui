<script lang="ts">
import { IconArrowLeft, IconShuffle, IconTerminal2 } from "@baby-ui/icons";
import { Badge, Button } from "@baby-ui/svelte";
import type { CardItem } from "#lib/registry.js";
import { goto } from "$app/navigation";

let {
	title,
	description,
	items,
	back,
	compact = false,
}: {
	title: string;
	description: string;
	/** What "Surprise me" picks from, and what the new/updated badge counts. */
	items: CardItem[];
	/** A link up one level, at the tile's top. */
	back?: { label: string; href: string };
	compact?: boolean;
} = $props();

const fresh = $derived(items.filter((item) => item.isNew).length);
const updated = $derived(items.filter((item) => item.isUpdated).length);

function surprise() {
	const pick = items[Math.floor(Math.random() * items.length)];
	if (pick) void goto(pick.href);
}
</script>

{#if compact}
	<header class="py-6">
		{#if back}
			<a href={back.href} class="mb-4 inline-flex w-fit items-center gap-1 text-muted-foreground text-xs transition-colors hover:text-foreground">
				<IconArrowLeft size={14} />
				{back.label}
			</a>
		{/if}
		<div class="flex max-w-2xl flex-col gap-3">
			{#if fresh || updated}
				<div class="flex flex-wrap gap-1.5">
					{#if fresh}<Badge variant="info" class="tabular-nums">{fresh} new</Badge>{/if}
					{#if updated}<Badge variant="success" class="tabular-nums">{updated} updated</Badge>{/if}
				</div>
			{/if}
			<h1 class="text-balance font-medium text-2xl text-foreground leading-tight tracking-tight">{title}</h1>
			<p class="text-pretty text-muted-foreground text-sm leading-6">{description}</p>
			<div class="flex flex-wrap items-center gap-2">
				<Button variant="outline" size="sm" onclick={surprise}><IconShuffle />Surprise me</Button>
				<Button href="/docs/installation" size="sm"><IconTerminal2 />Install</Button>
			</div>
		</div>
	</header>
{:else}
	<!-- Text sits low in the tile, so the page opens on previews and the copy leads into them. -->
	<div class="flex min-h-80 flex-col justify-between gap-6 px-1 pb-2">
	{#if back}
		<a
			href={back.href}
			class="inline-flex w-fit items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
		>
			<IconArrowLeft size={14} />
			{back.label}
		</a>
	{:else}
		<span></span>
	{/if}

	<div class="flex flex-col gap-4">
		{#if fresh || updated}
			<div class="flex flex-wrap gap-1.5">
				{#if fresh}<Badge variant="info" class="tabular-nums">{fresh} new</Badge>{/if}
				{#if updated}<Badge variant="success" class="tabular-nums">{updated} updated</Badge>{/if}
			</div>
		{/if}
		<h1 class="text-balance font-medium text-3xl text-foreground leading-tight tracking-tight">
			{title}
		</h1>
		<p class="text-pretty text-base text-muted-foreground leading-relaxed">{description}</p>
		<div class="mt-1 flex flex-wrap items-center gap-2">
			<Button variant="outline" size="sm" onclick={surprise}>
				<IconShuffle />
				Surprise me
			</Button>
			<Button href="/docs/installation" size="sm">
				<IconTerminal2 />
				Install
			</Button>
		</div>
	</div>
	</div>
{/if}
