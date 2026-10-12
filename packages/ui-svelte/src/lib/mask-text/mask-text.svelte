<script lang="ts">
import { cn } from "../lib/cn";
import { type MaskTextSize, maskText } from "./variants";

let {
	revealText,
	baseText,
	revealSize = 240,
	durationMs = 500,
	size = "default",
	class: classProp,
}: {
	revealText: string;
	baseText: string;
	revealSize?: number;
	/** How long the mask grows/shrinks on hover, in ms. */
	durationMs?: number;
	size?: MaskTextSize;
	class?: string;
} = $props();

const classes = $derived(maskText({ size }));
let x = $state("50%");
let y = $state("50%");
let hovered = $state(false);

function onMove(event: PointerEvent & { currentTarget: HTMLDivElement }) {
	const rect = event.currentTarget.getBoundingClientRect();
	x = `${event.clientX - rect.left}px`;
	y = `${event.clientY - rect.top}px`;
}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -- decorative pointer-follow mask, no click/keyboard semantics -->
<div
	data-slot="mask-text"
	class={cn(classes.root(), classProp)}
	onpointermove={onMove}
	onpointerenter={() => {
		hovered = true;
	}}
	onpointerleave={() => {
		hovered = false;
	}}
>
	<span class={classes.base()}>{baseText}</span>
	<span
		aria-hidden="true"
		class={classes.reveal()}
		style="--mt-x: {x}; --mt-y: {y}; --mt-size: {hovered
			? `${revealSize}px ${revealSize}px`
			: '0px 0px'}; --mt-duration: {durationMs}ms;"
	>
		{revealText}
	</span>
</div>
