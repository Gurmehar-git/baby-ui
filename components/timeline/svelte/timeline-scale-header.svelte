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
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const context = getTimelineScale();
const s = $derived(
	timelineScale({ orientation: context.orientation, variant: context.variant }),
);
</script>

<div data-slot="timeline-scale-header" class={cn(s.header(), classProp)} {...rest}>
	{@render children?.()}
</div>
