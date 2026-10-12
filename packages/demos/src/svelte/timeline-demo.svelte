<script lang="ts">
import { Button, Timeline } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { TIMELINE_EVENTS, TIMELINE_NEXT, timelineAt } from "../data/timeline";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Timeline>>(props));
const PATHS = {
	rocket:
		"M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2m4-3-3-3m3 3 6.5-6.5a4.9 4.9 0 0 0 1.4-4.4 4.9 4.9 0 0 0-4.4 1.4L9 12m3 3v4l3-2v-4m-6-1H5l2-3h4",
	alert:
		"M12 8v5m0 3h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
	check: "m5 12 5 5 9-10",
};
const start = Date.now();
let now = $state(start);
let added = $state<
	{ id: string; at: number; actor: string; title: string; meta?: string }[]
>([]);
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// The demo's clock ticks so relative times stay fresh; the component never runs its own timer.
$effect(() => {
	const timer = setInterval(() => (now = Date.now()), 30_000);
	return () => clearInterval(timer);
});

function addUpdate() {
	const next = TIMELINE_NEXT[added.length % TIMELINE_NEXT.length];
	now = Date.now();
	if (next) added = [{ id: `n${added.length}`, at: now, ...next }, ...added];
}
</script>

{#snippet glyph(d: string)}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<path {d} />
	</svg>
{/snippet}
{#snippet rocket()}{@render glyph(PATHS.rocket)}{/snippet}
{#snippet alert()}{@render glyph(PATHS.alert)}{/snippet}
{#snippet check()}{@render glyph(PATHS.check)}{/snippet}

<div class="grid w-full max-w-lg gap-3">
	<Timeline
		label="Project activity"
		events={[
			...added,
			...TIMELINE_EVENTS.map(({ ago, icon, ...event }) => ({
				...event,
				at: timelineAt(start, ago),
				icon: icon === "rocket" ? rocket : icon === "alert" ? alert : icon === "check" ? check : undefined,
			})),
		]}
		{now}
		maxHeight={360}
		variant={p.variant}
		{timeZone}
	/>
	<Button variant="outline" size="sm" class="justify-self-start" onclick={addUpdate}>Add update</Button>
</div>
