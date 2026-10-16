<script lang="ts">
import { onDestroy } from "svelte";
import { cn } from "../../lib/svelte/cn";
import type { LoadingStateVariant } from "./types";

export type { LoadingStateVariant } from "./types";

const CHEVRON = Array.from({ length: 9 }, (_, i) => {
	const row = Math.floor(i / 3);
	const col = i % 3;
	return (col + Math.abs(row - 1)) * 90;
});

const ORBIT_ORDER = [0, 1, 2, 5, 8, 7, 6, 3];
const ORBIT = Array.from({ length: 9 }, (_, i) => {
	const step = ORBIT_ORDER.indexOf(i);
	return step === -1 ? null : step * 110;
});

type Pattern = { delays: (number | null)[]; duration: number; round: boolean };

const PATTERNS: Record<Exclude<LoadingStateVariant, "surfer">, Pattern> = {
	drive: { delays: CHEVRON, duration: 650, round: false },
	dots: { delays: CHEVRON, duration: 650, round: true },
	orbit: { delays: ORBIT, duration: 950, round: false },
};

let {
	label,
	variant = "drive",
	videoSrc,
}: {
	label?: string;
	variant?: LoadingStateVariant;
	/** Surfer variant only; falls back to a "Video unavailable" placeholder without one. */
	videoSrc?: string;
} = $props();

const surfer = $derived(variant === "surfer");
const resolvedLabel = $derived(label ?? (surfer ? "Subway surfing" : "Churning"));
const pattern = $derived(
	PATTERNS[surfer ? "drive" : (variant as Exclude<LoadingStateVariant, "surfer">)],
);

let videoOk = $state(true);

let deciseconds = $state(0);
const interval = setInterval(() => {
	deciseconds += 1;
}, 100);
onDestroy(() => clearInterval(interval));

const elapsed = $derived.by(() => {
	const total = deciseconds / 10;
	if (total < 60) return `${total.toFixed(1)}s`;
	return `${Math.floor(total / 60)}m ${(total % 60).toFixed(1)}s`;
});
</script>

{#snippet grid(p: Pattern)}
	<span aria-hidden="true" class="grid shrink-0 grid-cols-[repeat(3,4px)] gap-[1.5px]">
		{#each p.delays as delay, index (index)}
			<span
				class={cn(
					"size-[4px] bg-foreground",
					p.round ? "rounded-full" : "rounded-[1px]",
					delay !== null && "pixel-cell",
				)}
				style={`opacity: ${delay === null ? 0.07 : 0.15}; ${delay === null ? "" : `animation-duration: ${p.duration}ms; animation-delay: ${delay}ms;`}`}
			></span>
		{/each}
	</span>
{/snippet}

{#snippet labelText()}
	<span class="reasoning-shimmer font-medium text-sm">{resolvedLabel}</span>
{/snippet}

{#snippet elapsedText()}
	<span class="font-mono text-xs text-muted-foreground tabular-nums">{elapsed}</span>
{/snippet}

{#if surfer}
	<div role="status" class="flex w-fit flex-col items-start">
		<div class="flex items-center gap-2.5">
			{@render grid(PATTERNS.drive)}
			{@render labelText()}
			{@render elapsedText()}
		</div>
		<div class="pop-in mt-2 w-56 overflow-hidden rounded-[10px] shadow-2xl" style="transform-origin: top left">
			<div class="relative aspect-video w-full bg-muted">
				{#if videoOk && videoSrc}
					<!-- svelte-ignore a11y_media_has_caption -- decorative loading-state loop, no meaningful audio -->
					<video
						src={videoSrc}
						autoplay
						muted
						loop
						playsinline
						onerror={() => (videoOk = false)}
						class="h-full w-full object-cover"
					></video>
				{:else}
					<div class="flex h-full w-full flex-col items-center justify-center gap-1.5">
						{@render grid(PATTERNS.drive)}
						<span class="px-3 text-center font-mono text-xs text-muted-foreground">
							Video unavailable
						</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<div role="status" class="flex w-fit items-center gap-2.5">
		{@render grid(pattern)}
		{@render labelText()}
		{@render elapsedText()}
	</div>
{/if}
