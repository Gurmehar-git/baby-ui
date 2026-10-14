<script lang="ts">
import { IconArrowRight } from "@baby-ui/icons";
import { Button } from "@baby-ui/svelte";
import type { CardItem } from "#lib/registry.js";
import ComponentCard from "./component-card.svelte";

let { items, count }: { items: CardItem[]; count: number } = $props();
</script>

<section aria-labelledby="home-new-heading" class="mx-auto max-w-7xl px-4 pb-24 md:px-8">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<h2
				id="home-new-heading"
				class="font-normal text-[clamp(1.1rem,3.4vw,1.85rem)] text-foreground tracking-[-0.05em]"
			>
				Just landed.
			</h2>
			<p class="mt-1 text-muted-foreground text-sm">
				{count} components landed in the last 15 days.
			</p>
		</div>
		<Button href="/components#new" variant="ghost" size="sm" class="group">
			See all new
			<IconArrowRight
				class="transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
			/>
		</Button>
	</div>

	<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each items as item (item.slug)}
			<ComponentCard {item} />
		{/each}
	</div>
</section>
