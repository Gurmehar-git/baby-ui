<script lang="ts">
import { type ClockHands, clockHands, nearestTurn, type TimeValue } from "./core";
import { timePicker } from "./variants";

let { value }: { value: TimeValue | null } = $props();

const hand = timePicker().hand();
let last: ClockHands = clockHands(null);
const angles = $derived.by(() => {
	const target = clockHands(value);
	last = {
		hour: nearestTurn(last.hour, target.hour),
		minute: nearestTurn(last.minute, target.minute),
	};
	return last;
});
</script>

<!-- A clock whose hands point at the field's time. -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
	<circle cx="12" cy="12" r="9" />
	<path d="M12 12V8.5" class={hand} style:rotate="{angles.hour}deg" />
	<path d="M12 12V7" class={hand} style:rotate="{angles.minute}deg" />
</svg>
