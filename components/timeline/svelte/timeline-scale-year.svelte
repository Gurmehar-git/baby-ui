<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { timelineScale } from "../variants";
import { getTimelineScale } from "./context";

let {
	children,
	class: classProp,
	...rest
}: HTMLAttributes<HTMLSpanElement> & { children?: Snippet } = $props();
const context = getTimelineScale();
const s = $derived(
	timelineScale({ orientation: context.orientation, variant: context.variant }),
);
</script>

<span
	aria-hidden="true"
	data-slot="timeline-scale-year"
	class={cn(s.year(), classProp)}
	{...rest}
>
	{@render children?.()}
</span>
