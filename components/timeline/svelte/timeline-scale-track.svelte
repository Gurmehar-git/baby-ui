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
}: HTMLAttributes<HTMLOListElement> & { children: Snippet } = $props();
const context = getTimelineScale();
const s = $derived(
	timelineScale({ orientation: context.orientation, variant: context.variant }),
);
</script>

<ol data-slot="timeline-scale-track" class={cn(s.track(), classProp)} {...rest}>
	{@render children()}
</ol>
