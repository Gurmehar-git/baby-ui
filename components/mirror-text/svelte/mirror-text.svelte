<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { type MirrorTextDirection, mirrorText } from "./variants";

let {
	text,
	as = "span",
	direction = "up",
	durationMs = 500,
	staggerMs = 67,
	class: classProp,
}: {
	text: string;
	as?: string;
	direction?: MirrorTextDirection;
	/** How long each layer's slide takes, in ms. */
	durationMs?: number;
	/** Delay step between the four stacked layers, in ms. */
	staggerMs?: number;
	class?: string;
} = $props();

const classes = $derived(mirrorText({ direction }));
const LAYER_COUNT = 4;
const layers = Array.from({ length: LAYER_COUNT }, (_, index) => index);
</script>

<svelte:element this={as} data-slot="mirror-text" class={cn(classes.root(), classProp)}>
	<span class="sr-only">{text}</span>
	{#each layers as index (index)}
		<div
			aria-hidden="true"
			class={cn("h-[0.6em] overflow-hidden", classes.layer())}
			style="transition-duration: {durationMs}ms; transition-delay: {(LAYER_COUNT - 1 - index) * staggerMs}ms;"
		>
			<div class="inline-block leading-none">{text}</div>
		</div>
	{/each}
</svelte:element>
