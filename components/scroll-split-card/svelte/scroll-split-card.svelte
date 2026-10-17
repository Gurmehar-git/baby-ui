<script lang="ts">
import Card from "../../card/svelte/card.svelte";
import CardDescription from "../../card/svelte/card-description.svelte";
import CardTitle from "../../card/svelte/card-title.svelte";
import { cn } from "../../lib/cn";
import { bindScrollProgress } from "../../lib/scroll-frame";
import { type ScrollSplitCardItem, SPLIT_POSITIONS } from "../types";
import {
	type ScrollSplitCardSize,
	type ScrollSplitCardTone,
	scrollSplitCard,
} from "../variants";

let {
	image,
	imageAlt,
	cards,
	hint = "Scroll down",
	endLabel,
	label = "Scroll to flip the cards",
	tone = "card",
	size = "default",
	class: classProp,
}: {
	/** One image, split into three panels that flip over to reveal `cards`. */
	image: string;
	imageAlt: string;
	/** The first three become the panels' back faces. */
	cards: ScrollSplitCardItem[];
	/** Shown until scrolling starts. */
	hint?: string;
	/** Fades in once the panels have flipped. */
	endLabel?: string;
	/** Accessible name of the scroll region. */
	label?: string;
	tone?: ScrollSplitCardTone;
	size?: ScrollSplitCardSize;
	class?: string;
} = $props();

let root = $state<HTMLElement>();
let track = $state<HTMLDivElement>();
const s = $derived(scrollSplitCard({ size, tone }));

$effect(() => {
	if (!root || !track) return;
	return bindScrollProgress(root, track);
});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<section
	bind:this={root}
	data-slot="scroll-split-card"
	aria-label={label}
	tabindex="0"
	class={cn(s.root(), classProp)}
>
	<div bind:this={track} class={s.track()}>
		<div class={s.stage()}>
			{#if hint}
				<p class={s.hint()}>{hint}</p>
			{/if}
			<div class={s.row()}>
				{#each cards.slice(0, 3) as card, i (`${i}-${card.title}`)}
					<div
						class={s.piece()}
						style="--i: {i}; --side: {i - 1}; --tint: var(--chart-{i + 1}); z-index: {i};"
					>
						<div class={scrollSplitCard({ size, tone, position: SPLIT_POSITIONS[i] ?? "middle" }).front()}>
							<img
								src={image}
								alt={i === 0 ? imageAlt : ""}
								aria-hidden={i === 0 ? undefined : true}
								class={s.image()}
								draggable="false"
							/>
						</div>
						<Card class={s.back()}>
							<CardTitle class={s.title()}>{card.title}</CardTitle>
							<CardDescription class={s.description()}>{card.description}</CardDescription>
						</Card>
					</div>
				{/each}
			</div>
			{#if endLabel}
				<p class={s.end()}>{endLabel}</p>
			{/if}
		</div>
	</div>
</section>
