<script lang="ts">
import { untrack } from "svelte";
import Card from "../card/card.svelte";
import { cn } from "../lib/cn";
import { bindScrollProgress, scrollToProgress } from "../lib/scroll-frame";
import { activeFlipCard, type CaseStudyFlipItem, flipCardOffsets } from "./types";
import {
	type CaseStudyFlipStackSize,
	type CaseStudyFlipStackTone,
	caseStudyFlipStack,
} from "./variants";

let {
	items,
	index = $bindable(0),
	onIndexChange,
	hint = "Scroll down",
	heading,
	endLabel,
	label = "Case studies",
	tone = "card",
	size = "default",
	class: classProp,
}: {
	items: CaseStudyFlipItem[];
	/** The card facing the reader; setting it scrolls there. */
	index?: number;
	onIndexChange?: (index: number) => void;
	/** Shown between two bobbing arrows above the stack. */
	hint?: string;
	heading?: string;
	/** Closes the scroll once every card has flipped away. */
	endLabel?: string;
	/** Accessible name of the scroll region. */
	label?: string;
	tone?: CaseStudyFlipStackTone;
	size?: CaseStudyFlipStackSize;
	class?: string;
} = $props();

let root = $state<HTMLElement>();
let track = $state<HTMLDivElement>();
let emitted = 0;
let mounted = false;
const total = $derived(items.length);
const s = $derived(caseStudyFlipStack({ size, tone }));

$effect(() => {
	const n = total;
	const scroller = root;
	const el = track;
	if (!scroller || !el || !n) return;
	return untrack(() =>
		bindScrollProgress(scroller, el, (progress) => {
			const next = activeFlipCard(progress, n);
			if (next === emitted) return;
			emitted = next;
			index = next;
			onIndexChange?.(next);
		}),
	);
});

$effect(() => {
	const target = index;
	const first = !mounted;
	mounted = true;
	if (!root || !track || !total || target === emitted) return;
	emitted = target;
	const still = first || matchMedia("(prefers-reduced-motion: reduce)").matches;
	scrollToProgress(root, track, target / total, still ? "auto" : "smooth");
});
</script>

{#snippet arrow(delayed: boolean)}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class={cn(s.arrow(), delayed && "[animation-delay:180ms]")}
	>
		<path d="M12 5l0 14" />
		<path d="M18 13l-6 6" />
		<path d="M6 13l6 6" />
	</svg>
{/snippet}

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<section
	bind:this={root}
	data-slot="case-study-flip-stack"
	aria-label={label}
	tabindex="0"
	class={cn(s.root(), classProp)}
>
	<div class={s.intro()}>
		{#if hint}
			<p class={s.hint()}>
				{@render arrow(false)}
				<span>{hint}</span>
				{@render arrow(true)}
			</p>
		{/if}
		{#if heading}
			<h2 class={s.heading()}>{heading}</h2>
		{/if}
	</div>
	<div bind:this={track} class={s.track()} style="height: calc({total + 1} * 100cqh);">
		<div class={s.stage()}>
			<div class={s.deck()}>
				{#each items as item, i (`${i}-${item.title}`)}
					{@const offsets = flipCardOffsets(i, total)}
					<article
						data-active={i === index || undefined}
						class={s.article()}
						style="--i: {i}; --n: {total}; --stack: {offsets.stack}; --rest-y: {offsets.restY}; --rest-s: {offsets.restS}; --tint: var(--chart-{(i % 5) + 1}); z-index: {total - i};"
					>
						<Card class={s.card()}>
							<div class={s.copy()}>
								<span class={s.number()}>{item.number ?? String(i + 1).padStart(2, "0")}</span>
								<div class="mt-auto pt-6">
									<p class={s.eyebrow()}>{item.eyebrow}</p>
									<h3 class={s.title()}>{item.title}</h3>
									<p class={s.description()}>{item.description}</p>
								</div>
							</div>
							<div class={s.media()}>
								<img
									src={item.image}
									alt={item.imageAlt}
									class={s.image()}
									loading={i < 2 ? "eager" : "lazy"}
									draggable="false"
								/>
							</div>
						</Card>
					</article>
				{/each}
			</div>
		</div>
	</div>
	{#if endLabel}
		<p class={s.end()}>{endLabel}</p>
	{/if}
</section>
