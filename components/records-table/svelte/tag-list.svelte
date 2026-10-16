<script lang="ts">
import { tagToneClass } from "./variants";

let { tags }: { tags: string[] } = $props();

let containerEl = $state<HTMLDivElement>();
let measureEl = $state<HTMLDivElement>();
// svelte-ignore state_referenced_locally -- intentional one-time seed, corrected by the measurement effect below
let visibleCount = $state(tags.length);

$effect(() => {
	tags;
	const container = containerEl;
	const measure = measureEl;
	if (!container || !measure) return;

	function update() {
		if (!container || !measure) return;
		const available = container.clientWidth;
		const tagWidths = Array.from(
			measure.querySelectorAll<HTMLElement>("[data-tag-measure]"),
			(tag) => tag.offsetWidth,
		);
		const moreWidth =
			measure.querySelector<HTMLElement>("[data-more-measure]")?.offsetWidth ?? 0;
		let used = 0;
		let count = 0;

		for (let index = 0; index < tagWidths.length; index++) {
			const width = tagWidths[index] ?? 0;
			const nextUsed = used + (count > 0 ? 4 : 0) + width;
			const hiddenAfter = tags.length - (index + 1);
			const totalWithOverflow = nextUsed + (hiddenAfter > 0 ? 4 + moreWidth : 0);
			if (totalWithOverflow > available) break;
			used = nextUsed;
			count += 1;
		}

		visibleCount = count;
	}

	update();
	const observer = new ResizeObserver(update);
	observer.observe(container);
	return () => observer.disconnect();
});

const hiddenCount = $derived(tags.length - visibleCount);
</script>

{#snippet tag(name: string)}
	<span class={`inline-flex h-5.5 shrink-0 items-center rounded-md px-1.5 font-medium text-xs ${tagToneClass(name)}`}>
		{name}
	</span>
{/snippet}

<div bind:this={containerEl} class="relative flex min-w-0 items-center gap-1 overflow-hidden" title={tags.join(", ")}>
	<div bind:this={measureEl} aria-hidden="true" class="pointer-events-none absolute flex gap-1 opacity-0">
		{#each tags as name (name)}
			<span data-tag-measure>{@render tag(name)}</span>
		{/each}
		<span data-more-measure class="inline-flex h-5.5 items-center rounded-md px-1.5 text-xs">
			+{tags.length}
		</span>
	</div>
	{#each tags.slice(0, visibleCount) as name (name)}
		{@render tag(name)}
	{/each}
	{#if hiddenCount > 0}
		<span class="shrink-0 text-xs text-muted-foreground">+{hiddenCount}</span>
	{/if}
</div>
