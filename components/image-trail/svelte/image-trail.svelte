<script lang="ts">
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import { cn } from "../../lib/svelte/cn";
import {
	type ImageTrailOptions,
	type ImageTrailSize,
	type ImageTrailVariant,
	imageTrail,
	mountImageTrail,
} from "./trail";

let {
	images,
	threshold = 80,
	duration = 1600,
	variant,
	size,
	class: className,
	children,
}: {
	/** Image URLs; each one is a pooled element reused round-robin. */
	images: string[];
	/** Pointer travel in px between two spawned images. */
	threshold?: number;
	/** Lifetime of one image, in ms. */
	duration?: number;
	variant?: ImageTrailVariant;
	size?: ImageTrailSize;
	class?: string;
	children?: Snippet;
} = $props();

const s = $derived(imageTrail({ variant, size }));
const options: ImageTrailOptions = $derived({ threshold, duration });

let root = $state<HTMLDivElement>();
let trail: ReturnType<typeof mountImageTrail> | undefined;

$effect(() => {
	if (!root) return;
	trail = mountImageTrail(
		root,
		untrack(() => $state.snapshot(options)),
	);
	return () => trail?.destroy();
});

$effect(() => {
	const next = $state.snapshot(options);
	trail?.update(next);
});
</script>

<div bind:this={root} data-slot="image-trail" class={cn(s.root(), className)}>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
	<div aria-hidden="true" class={s.layer()}>
		{#each images as src, i (i)}
			<img data-slot="image-trail-item" {src} alt="" draggable="false" class={s.item()} />
		{/each}
	</div>
</div>
