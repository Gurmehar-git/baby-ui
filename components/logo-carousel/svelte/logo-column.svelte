<script lang="ts">
import type { Snippet } from "svelte";

let {
	items,
	logo,
	activeIndex,
	delayMs,
	reduced,
}: {
	items: unknown[];
	logo: Snippet<[unknown]>;
	activeIndex: number;
	delayMs: number;
	reduced: boolean;
} = $props();

let prevIndex = $state<number | null>(null);
// svelte-ignore state_referenced_locally -- intentional one-time seed of the "previous value" tracker
let lastActiveIndex = activeIndex;

// Runs before the DOM updates, so `lastActiveIndex` still holds the outgoing value
// (React does the same comparison during render, to capture it for the exit).
$effect.pre(() => {
	const current = activeIndex;
	if (current !== lastActiveIndex) {
		prevIndex = reduced ? null : lastActiveIndex;
		lastActiveIndex = current;
	}
});

let mounted = $state(false);
$effect(() => {
	mounted = true;
});

function onExitEnd(index: number) {
	if (prevIndex === index) prevIndex = null;
}
</script>

<div class="relative overflow-hidden" data-slot="logo-carousel-column">
	<!-- Invisible spacer: holds the column's natural height so the absolutely
	     positioned logo below doesn't collapse the grid cell. -->
	<div aria-hidden="true" class="pointer-events-none invisible select-none">
		{#if items[0] !== undefined}
			{@render logo(items[0])}
		{/if}
	</div>
	{#if prevIndex !== null}
		{@const exitIndex = prevIndex}
		{@const exitItem = items[exitIndex]}
		{#if exitItem !== undefined}
			<span
				class="logo-carousel-exit absolute inset-0 flex items-center justify-center"
				style="--lc-delay: {delayMs}ms;"
				onanimationend={() => onExitEnd(exitIndex)}
			>
				{@render logo(exitItem)}
			</span>
		{/if}
	{/if}
	{#if items[activeIndex] !== undefined}
		{#key activeIndex}
			<span
				data-slot="logo-carousel-logo"
				class="absolute inset-0 flex items-center justify-center{mounted ? ' logo-carousel-enter' : ''}"
				style="--lc-delay: {delayMs}ms;"
			>
				{@render logo(items[activeIndex])}
			</span>
		{/key}
	{/if}
</div>
