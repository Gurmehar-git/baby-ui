<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { timelineScale } from "../variants";
import { getTimelineScale } from "./context";

let { class: classProp, ...rest }: HTMLAttributes<HTMLSpanElement> = $props();
const context = getTimelineScale();
const s = $derived(
	timelineScale({ orientation: context.orientation, variant: context.variant }),
);
</script>

<span
	aria-hidden="true"
	data-slot="timeline-scale-tick"
	class={cn(s.tick(), classProp)}
	{...rest}
></span>
