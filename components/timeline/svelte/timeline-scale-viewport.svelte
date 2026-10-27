<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { timelineScale } from "../variants";
import { getTimelineScale } from "./context";

let {
	children,
	class: classProp,
	onscroll,
	onscrollend,
	onwheel,
	onpointerdown,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children: Snippet } = $props();

const context = getTimelineScale();
const s = $derived(
	timelineScale({ orientation: context.orientation, variant: context.variant }),
);
let frame: number | undefined;
</script>

<div
	data-slot="timeline-scale-viewport"
	class={cn(s.viewport(), classProp)}
	onscroll={(event) => {
		if (frame !== undefined) cancelAnimationFrame(frame);
		const target = event.currentTarget;
		frame = requestAnimationFrame(() => context.syncViewport(target));
		onscroll?.(event);
	}}
	onscrollend={(event) => {
		context.release();
		onscrollend?.(event);
	}}
	onwheel={(event) => {
		context.release();
		onwheel?.(event);
	}}
	onpointerdown={(event) => {
		context.release();
		onpointerdown?.(event);
	}}
	{...rest}
>
	{@render children()}
</div>
