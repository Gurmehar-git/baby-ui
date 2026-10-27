<script lang="ts">
import { TableOfContents } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { TOC_ARTICLE, TOC_ITEMS } from "../data/table-of-contents";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof TableOfContents>>(props));

let scroller = $state<HTMLElement | null>(null);
</script>

<div class="flex w-full max-w-2xl gap-6">
	<!-- Focusable so keyboard users can scroll the article too. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<section
		bind:this={scroller}
		aria-label="Article"
		tabindex="0"
		class="h-80 min-w-0 flex-1 overflow-y-auto rounded-xl border border-border p-5 [scroll-behavior:smooth]"
	>
		{#each TOC_ARTICLE as section (section.id)}
			<svelte:element
				this={section.depth === 2 ? "h2" : "h3"}
				id={section.id}
				class={section.depth === 2
					? "mt-8 font-semibold text-foreground text-lg first:mt-0"
					: "mt-5 font-medium text-foreground text-sm"}
			>
				{section.label}
			</svelte:element>
			<p class="mt-2 text-muted-foreground text-sm leading-6">{section.body}</p>
			<p class="mt-2 text-muted-foreground text-sm leading-6">
				Scroll the article and the outline follows along.
			</p>
		{/each}
		<div class="h-40"></div>
	</section>
	<TableOfContents
		items={TOC_ITEMS}
		root={scroller}
		scrollOffset={0}
		variant={p.variant ?? "curve"}
		indicator={props.indicator !== false}
		class={p.variant === "minimap" ? "shrink-0" : "w-44 shrink-0"}
	/>
</div>
