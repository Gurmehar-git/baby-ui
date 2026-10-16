<script lang="ts" module>
import type { Snippet } from "svelte";
import type { TimelineEventBase } from "./feed";

export type TimelineEvent = TimelineEventBase & {
	/** Revealed in place when the row expands; rows without it are not interactive. */
	detail?: Snippet | string;
	/** Icon for a system event, used when there is no avatar. */
	icon?: Snippet;
};
</script>

<script lang="ts">
import { untrack } from "svelte";
import Avatar from "../../avatar/svelte/avatar.svelte";
import AvatarFallback from "../../avatar/svelte/avatar-fallback.svelte";
import AvatarImage from "../../avatar/svelte/avatar-image.svelte";
import Collapsible from "../../collapsible/svelte/collapsible.svelte";
import CollapsibleContent from "../../collapsible/svelte/collapsible-content.svelte";
import CollapsibleTrigger from "../../collapsible/svelte/collapsible-trigger.svelte";
import { cn } from "../../lib/svelte/cn";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import SlotText from "../../slot-text/svelte/slot-text.svelte";
import { addedEvents, announceAdded, createTimelineReveal, groupTimeline, moveTimelineFocus } from "./feed";
import { type TimelineVariant, timeline } from "./variants";

let {
	events,
	now,
	label,
	timeZone = "UTC",
	locale = "en-US",
	maxHeight,
	scrollToNew = true,
	expanded = $bindable(),
	defaultExpanded = [],
	onExpandedChange,
	headingLevel = 3,
	variant = "default",
	class: classProp,
}: {
	/** Updates in any order; the newest shows first. */
	events: TimelineEvent[];
	/** Reference time in epoch ms for relative labels and day groups; pass a ticking clock to refresh them. */
	now: number;
	/** Accessible name for the feed. */
	label: string;
	/** Time zone for day groups and clock times; fixed by default so server and client agree. */
	timeZone?: string;
	locale?: string;
	/** Height of the scrolling area; without it the feed grows with the page. */
	maxHeight?: number | string;
	/** Scroll back to the top when a new update arrives while scrolled down. */
	scrollToNew?: boolean;
	/** Ids of expanded rows. Bindable. */
	expanded?: string[];
	defaultExpanded?: string[];
	onExpandedChange?: (expanded: string[]) => void;
	headingLevel?: 2 | 3 | 4 | 5 | 6;
	variant?: TimelineVariant;
	class?: string;
} = $props();

const uid = $props.id();
let root = $state<HTMLElement>();
let scroller = $state<HTMLDivElement>();
let ownExpanded = $state(untrack(() => defaultExpanded));
const open = $derived(expanded ?? ownExpanded);
const known = new Set(untrack(() => events.map((event) => event.id)));
const initialDays = new Set(untrack(() => groupTimeline(events, now, timeZone, locale).map((g) => g.day)));
let fresh = $state(new Set<string>());
let announcement = $state("");
const groups = $derived(groupTimeline(events, now, timeZone, locale));
const newest = $derived(groups[0]?.rows[0]?.event.id);

$effect.pre(() => {
	const added = addedEvents(known, events);
	if (!added.length) return;
	for (const event of added) known.add(event.id);
	untrack(() => {
		fresh = new Set([...fresh, ...added.map((event) => event.id)]);
		announcement = announceAdded(added);
	});
});

let engine: ReturnType<typeof createTimelineReveal> | undefined;
$effect(() => {
	if (!root || !scroller) return;
	engine = createTimelineReveal(root, scroller);
	return () => engine?.destroy();
});
$effect(() => {
	void groups;
	engine?.scan();
});
$effect(() => {
	void newest;
	if (!scrollToNew || !scroller || untrack(() => scroller?.scrollTop ?? 0) < 1) return;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
	scroller.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
});

function toggle(rowId: string, next: boolean) {
	const list = next ? [...open, rowId] : open.filter((item) => item !== rowId);
	if (expanded === undefined) ownExpanded = list;
	else expanded = list;
	onExpandedChange?.(list);
}

const s = $derived(timeline({ variant }));
const height = $derived(typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight);
</script>

<section bind:this={root} aria-label={label} data-slot="timeline" class={cn(s.root(), classProp)}>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={scroller}
		class={s.scroller()}
		data-scrolls={maxHeight !== undefined || undefined}
		style:--tl-height={height}
		onkeydown={(event) => root && moveTimelineFocus(root, event)}
	>
		<div>
			{#each groups as group (group.day)}
				<section aria-labelledby="{uid}-{group.day}" data-fresh={!initialDays.has(group.day) || undefined} class={s.group()}>
					<div class={s.groupInner()}>
						<svelte:element this={`h${headingLevel}`} id="{uid}-{group.day}" class={s.day()}>
							<span>{group.label}</span>
							<span class={s.count()} aria-hidden="true"><RollingDigits value={group.rows.length} /> {group.count}</span>
							<span class="sr-only">, {group.rows.length} {group.count}</span>
						</svelte:element>
						<ol class={s.list()}>
							{#each group.rows as row (row.event.id)}
								{@const event = row.event}
								{#snippet body()}
									<span class={s.text()}>
										<span class={s.title()}
											>{#if event.actor}<span class={s.actor()}>{event.actor} </span>{/if}{event.title}</span
										>
										{#if event.meta}<span class={s.meta()}>{event.meta}</span>{/if}
									</span>
									<time datetime={row.iso} title={row.timeFull} class={s.time()}>
										<span aria-hidden="true"><SlotText value={row.timeLabel} spins={0} duration={0.4} /></span>
										<span class="sr-only">{row.timeFull}</span>
									</time>
								{/snippet}
								<li data-timeline-row="" data-fresh={fresh.has(event.id) || undefined} class={s.item()}>
									<div class={s.itemInner()}>
										{#if event.avatar}
											<Avatar class={cn(s.marker(), "size-(--tl-marker)")} aria-hidden="true">
												<AvatarImage src={event.avatar} alt="" />
												<AvatarFallback>{event.actor?.slice(0, 1)}</AvatarFallback>
											</Avatar>
										{:else}
											<span aria-hidden="true" data-tone={event.tone ?? "neutral"} class={cn(s.marker(), s.node())}
												>{@render event.icon?.()}</span
											>
										{/if}
										{#if !row.last}<span aria-hidden="true" class={s.segment()}></span>{/if}
										{#if event.detail}
											{@const detail = event.detail}
											<Collapsible bind:open={() => open.includes(event.id), (next) => toggle(event.id, next)}>
												<CollapsibleTrigger data-timeline-trigger="" class={cn(s.trigger(), s.expandable())}>
													{@render body()}
												</CollapsibleTrigger>
												<CollapsibleContent class={s.detail()}>
													{#if typeof detail === "string"}{detail}{:else}{@render detail()}{/if}
												</CollapsibleContent>
											</Collapsible>
										{:else}
											<div class={s.trigger()}>{@render body()}</div>
										{/if}
									</div>
								</li>
							{/each}
						</ol>
					</div>
				</section>
			{/each}
		</div>
	</div>
	<span class="sr-only" role="status">{announcement}</span>
</section>
