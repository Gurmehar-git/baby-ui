<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/svelte/cn";
import type { ImageSlotProps } from "../../lib/svelte/image";
import {
	cardLayout,
	type StickyScrollCardItem,
	type StickyScrollCardsSize,
	type StickyScrollCardsVariant,
	scrubStack,
	stickyScrollCards,
} from "./variants";

let {
	cards,
	hint = "Scroll to explore",
	tilt = 1,
	size = "default",
	variant,
	label = "Photo stack",
	image,
	class: className,
}: {
	cards: readonly StickyScrollCardItem[];
	/** Hint shown above the stack; empty hides it. */
	hint?: string;
	/** Multiplier on each card's resting tilt; 0 keeps them straight. */
	tilt?: number;
	size?: StickyScrollCardsSize;
	variant?: StickyScrollCardsVariant;
	/** Accessible name of the stack. */
	label?: string;
	/** Renders each image, e.g. through your framework's image component; defaults to `<img>`. */
	image?: Snippet<[ImageSlotProps]>;
	class?: string;
} = $props();

let root = $state<HTMLElement>();
let stack = $state<HTMLDivElement>();
const s = $derived(stickyScrollCards({ size, variant }));

$effect(() => {
	void size;
	if (!root || !stack) return;
	return scrubStack(root, stack);
});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<section
	bind:this={root}
	data-slot="sticky-scroll-cards"
	aria-label={label}
	tabindex={size === "auto" ? undefined : 0}
	class={cn(s.root(), className)}
>
	<div bind:this={stack} class={s.stack()}>
		{#if hint}
			<div class={s.hint()}>
				<p class={s.hintText()}>{hint}</p>
				<span aria-hidden="true" class={s.hintLine()}></span>
			</div>
		{/if}
		{#each cards as card, i (`${card.src}-${i}`)}
			{@const layout = cardLayout(i, cards.length, tilt)}
			<div class={s.section()}>
				<figure
					class={s.card()}
					style="top: {layout.offset}px; --sticky-scroll-start: {layout.start}; --sticky-scroll-rest: {layout.rest}; --sticky-scroll-rotate: {layout.rotate}deg"
				>
					{#if image}{@render image({ src: card.src, alt: card.alt ?? card.title, className: s.image(), loading: i < 2 ? "eager" : "lazy" })}{:else}<img
						src={card.src}
						alt={card.alt ?? card.title}
						class={s.image()}
						loading={i < 2 ? "eager" : "lazy"}
						draggable="false"
					/>{/if}
					<figcaption class={s.caption()}>{card.title}</figcaption>
				</figure>
			</div>
		{/each}
	</div>
</section>
