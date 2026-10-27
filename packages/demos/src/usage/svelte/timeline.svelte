<script lang="ts">
import {
	TimelineScale,
	TimelineScaleContent,
	TimelineScaleDate,
	TimelineScaleHeader,
	TimelineScaleItem,
	TimelineScaleRail,
	TimelineScaleTick,
	TimelineScaleTrack,
	TimelineScaleViewport,
} from "@baby-ui/svelte";

const milestones = [
	{ id: "research", date: "2026-08-04", title: "Research complete" },
	{ id: "beta", date: "2026-09-18", title: "Private beta" },
	{ id: "launch", date: "2026-10-12", title: "Version 1.0" },
];
let active = $state("launch");
const selected = $derived(milestones.find((item) => item.id === active));
</script>

<TimelineScale aria-label="Release history" variant="card" bind:value={active}>
	<TimelineScaleHeader>
		<span>Release history</span>
		<span aria-live="polite">{selected?.title}</span>
	</TimelineScaleHeader>
	<TimelineScaleViewport>
		<TimelineScaleTrack>
			<TimelineScaleRail />
			{#each milestones as item (item.id)}
				<TimelineScaleItem value={item.id} label={item.title}>
					<TimelineScaleTick />
					<TimelineScaleDate datetime={item.date}>{item.date}</TimelineScaleDate>
					<TimelineScaleContent>{item.title}</TimelineScaleContent>
				</TimelineScaleItem>
			{/each}
		</TimelineScaleTrack>
	</TimelineScaleViewport>
</TimelineScale>
