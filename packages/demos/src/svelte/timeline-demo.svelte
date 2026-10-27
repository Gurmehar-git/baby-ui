<script lang="ts">
import {
	Button,
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	TimelineScale,
	TimelineScaleContent,
	TimelineScaleDate,
	TimelineScaleHeader,
	TimelineScaleItem,
	TimelineScaleRail,
	TimelineScaleTick,
	TimelineScaleTrack,
	TimelineScaleViewport,
	TimelineScaleYear,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { TIMELINE_EVENTS, TIMELINE_NEXT, timelineAt } from "../data/timeline";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof TimelineScale>>(props));
const DATE = new Intl.DateTimeFormat("en", {
	month: "short",
	day: "numeric",
	hour: "numeric",
	minute: "2-digit",
});
const now = Date.now();
let events = $state(
	TIMELINE_EVENTS.toReversed().map(({ ago, icon: _, tone: __, ...event }) => ({
		...event,
		at: timelineAt(now, ago),
	})),
);
let active = $state(TIMELINE_EVENTS[0]?.id);
let added = $state(0);
const selected = $derived(events.find((event) => event.id === active));

function addMilestone() {
	const next = TIMELINE_NEXT[added % TIMELINE_NEXT.length];
	if (!next) return;
	const id = `n${added}`;
	events = [...events, { id, at: Date.now(), ...next }];
	active = id;
	added += 1;
}
</script>

<div class="grid w-full min-w-0 gap-3">
	<TimelineScale
		aria-label="Project history"
		orientation={p.orientation ?? "horizontal"}
		variant={p.variant ?? "default"}
		bind:value={active}
	>
		<TimelineScaleHeader>
			<span class="font-medium text-foreground">Project history</span>
			<span aria-live="polite" class="max-w-[70%] truncate text-right">
				{selected?.title}
			</span>
		</TimelineScaleHeader>
		<TimelineScaleViewport class="max-h-96">
			<TimelineScaleTrack>
				<TimelineScaleRail />
				{#each events as event (event.id)}
					{@const date = new Date(event.at)}
					{@const label = [event.actor, event.title].filter(Boolean).join(" ")}
					<TimelineScaleItem
						value={event.id}
						{label}
						description={event.detail ?? event.meta}
					>
						<TimelineScaleTick />
						<TimelineScaleYear>{date.getFullYear()}</TimelineScaleYear>
						<TimelineScaleDate datetime={date.toISOString()}>{DATE.format(date)}</TimelineScaleDate>
						<TimelineScaleContent>
							<Card class="h-full border-0 bg-transparent py-0 shadow-none">
								<CardHeader class="px-0">
									<CardTitle>{label}</CardTitle>
									{#if event.detail || event.meta}
										<CardDescription>{event.detail ?? event.meta}</CardDescription>
									{/if}
								</CardHeader>
							</Card>
						</TimelineScaleContent>
					</TimelineScaleItem>
				{/each}
			</TimelineScaleTrack>
		</TimelineScaleViewport>
	</TimelineScale>
	<div class="flex flex-wrap gap-2">
		<Button variant="outline" size="sm" onclick={addMilestone}>Add milestone</Button>
	</div>
</div>
