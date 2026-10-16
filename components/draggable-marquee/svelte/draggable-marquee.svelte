<script lang="ts">
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import { cn } from "../../lib/svelte/cn";
import { createMarquee } from "./marquee";
import {
	type DraggableMarqueeDirection,
	type DraggableMarqueeGap,
	draggableMarquee,
} from "./variants";

let {
	children,
	speed = 1,
	direction = "left",
	gap = "md",
	pauseOnHover = false,
	friction = 0.975,
	label = "Scrolling gallery. Drag, or use the left and right arrow keys.",
	class: classProp,
}: {
	/** One set of items; it repeats as often as the width needs. */
	children: Snippet;
	/** Drift in px per frame; 0 holds still until dragged. */
	speed?: number;
	direction?: DraggableMarqueeDirection;
	gap?: DraggableMarqueeGap;
	pauseOnHover?: boolean;
	/** Share of a throw's velocity kept each frame, 0 to 1. */
	friction?: number;
	/** Accessible name of the region. */
	label?: string;
	class?: string;
} = $props();

let root: HTMLElement | undefined = $state();
let track: HTMLDivElement | undefined = $state();
let copies = $state(2);
let marquee: ReturnType<typeof createMarquee> | undefined;
const s = $derived(draggableMarquee({ gap, direction }));
const onCopies = (count: number) => (copies = count);
const options = $derived({ speed, direction, pauseOnHover, friction, onCopies });

$effect(() => {
	const el = root;
	const row = track;
	if (!el || !row) return;
	// Options flow through update(); recreating would reset the track's position.
	marquee = untrack(() => createMarquee(el, row, options));
	return () => marquee?.destroy();
});

$effect(() => {
	marquee?.update(options);
});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -- focus is how arrow keys reach the track -->
<section
	bind:this={root}
	data-slot="draggable-marquee"
	aria-label={label}
	aria-roledescription="marquee"
	tabindex="0"
	class={cn(s.root(), classProp)}
>
	<div bind:this={track} class={s.track()}>
		{#each { length: copies } as _, copy (copy)}
			<div aria-hidden={copy > 0 || undefined} inert={copy > 0} class={s.copy()}>
				{@render children()}
			</div>
		{/each}
	</div>
</section>
