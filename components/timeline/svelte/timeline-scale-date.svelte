<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLTimeAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { timelineScale } from "../variants";
import { getTimelineScale } from "./context";

let {
	children,
	class: classProp,
	...rest
}: HTMLTimeAttributes & { children?: Snippet } = $props();
const context = getTimelineScale();
const s = $derived(
	timelineScale({ orientation: context.orientation, variant: context.variant }),
);
</script>

<time data-slot="timeline-scale-date" class={cn(s.date(), classProp)} {...rest}>
	{@render children?.()}
</time>
