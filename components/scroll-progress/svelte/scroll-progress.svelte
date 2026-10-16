<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { type ScrollProgressPosition, scrollPercent, scrollProgress } from "./variants";

let {
	value: valueProp,
	onValueChange,
	position = "right",
	container,
	tickCount = 40,
	height = 160,
	width = 14,
	showLabel = true,
	label = "Scroll progress",
	class: className,
}: {
	/** Controlled progress, 0 to 100. Omit to follow the scroll position. */
	value?: number;
	/** Fired with the scroll position, 0 to 100, as it changes. */
	onValueChange?: (value: number) => void;
	position?: ScrollProgressPosition;
	/** Scroll this element instead of the page; the rail then sits inside it. */
	container?: HTMLElement | null;
	tickCount?: number;
	/** Rail height in px. */
	height?: number;
	/** Rail width in px. */
	width?: number;
	showLabel?: boolean;
	/** Accessible name of the progress bar. */
	label?: string;
	class?: string;
} = $props();

let scrolled = $state(0);
const value = $derived(Math.min(100, Math.max(0, valueProp ?? scrolled)));
const styles = $derived(
	scrollProgress({ position, scope: container ? "container" : "page" }),
);

$effect(() => {
	const el = container ?? null;
	const target: HTMLElement | Window = el ?? window;
	let last = -1;
	const update = () => {
		const next = scrollPercent(el);
		if (next === last) return;
		last = next;
		scrolled = next;
		onValueChange?.(next);
	};
	update();
	target.addEventListener("scroll", update, { passive: true });
	window.addEventListener("resize", update, { passive: true });
	return () => {
		target.removeEventListener("scroll", update);
		window.removeEventListener("resize", update);
	};
});
</script>

{#snippet ticks(tick: string)}
	<div class={styles.ticks()}>
		{#each { length: tickCount }, i (i)}
			<span class={tick}></span>
		{/each}
	</div>
{/snippet}

<div
	data-slot="scroll-progress"
	data-position={position}
	role="progressbar"
	aria-label={label}
	aria-valuemin={0}
	aria-valuemax={100}
	aria-valuenow={Math.round(value)}
	class={cn(styles.root(), className)}
	style:--scroll-progress={value}
>
	<div class={styles.track()} style:height="{height}px" style:width="{width}px">
		{@render ticks(styles.tick())}
		<div class={styles.fill()} aria-hidden="true">
			{@render ticks(styles.fillTick())}
		</div>
		{#if showLabel}
			<div class={styles.label()} aria-hidden="true">
				<span class={styles.labelRule()}></span>
				<span class={styles.labelValue()}>{Math.round(value)}</span>
			</div>
		{/if}
	</div>
</div>
