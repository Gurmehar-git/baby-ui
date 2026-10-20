<script lang="ts">
import { cn } from "../../lib/cn";
import Progress from "../../progress/svelte/progress.svelte";
import { subscriptionCardState } from "./context";

let {
	used,
	total,
	class: classProp,
}: { used: number; total: number; class?: string } = $props();

const ctx = subscriptionCardState("SubscriptionCardSeats");
const full = $derived(used >= total);
</script>

<!-- Seat usage as a bar; the full-house note folds in once every seat is taken. -->
<div data-slot="subscription-card-seats" class={cn(ctx.styles.seats(), classProp)}>
	<Progress
		value={used}
		max={Math.max(1, total)}
		label={ctx.labels.seats}
		showValue
		formatValue={() => ctx.labels.seatsValue(used, total)}
	/>
	<div data-open={full} class={ctx.styles.seatsHintFold()}>
		<p class={ctx.styles.clip()} aria-hidden={!full}>
			<span class={ctx.styles.seatsHint()}>{ctx.labels.seatsFull}</span>
		</p>
	</div>
</div>
