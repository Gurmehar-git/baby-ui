<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import {
	MARKER_SHAPES,
	MARKER_STAGGER_MS,
	type MarkerTone,
	type MarkerVariant,
	marker,
} from "../variants";

let {
	children,
	variant = "wavy",
	tone = "auto",
	animate = true,
	drawn: drawnProp,
	durationMs = 700,
	delayMs = 0,
	class: classProp,
}: {
	children?: Snippet;
	variant?: MarkerVariant;
	/** Ink colour; `auto` picks the style's own tone. */
	tone?: MarkerTone;
	/** Draw in once scrolled into view; off renders the mark finished. */
	animate?: boolean;
	/** Controlled: whether the mark is drawn. Omit to draw on first view. */
	drawn?: boolean;
	/** One stroke's draw time. */
	durationMs?: number;
	delayMs?: number;
	class?: string;
} = $props();

const id = $props.id();
let root = $state<HTMLSpanElement | null>(null);
let seen = $state(false);
const drawn = $derived(drawnProp ?? seen);
const styles = $derived(marker({ variant, tone }));
const shape = $derived(MARKER_SHAPES[variant]);
const flag = $derived(drawn ? "" : undefined);

$effect(() => {
	if (!animate || drawnProp !== undefined) return;
	const node = root;
	if (!node) return;
	const observer = new IntersectionObserver(([entry]) => {
		if (!entry?.isIntersecting) return;
		seen = true;
		observer.disconnect();
	});
	observer.observe(node);
	return () => observer.disconnect();
});

const timing = (extra = 0, scale = 1) =>
	`--marker-duration: ${durationMs * scale}ms; --marker-delay: ${delayMs + extra}ms;`;
</script>

<span bind:this={root} data-slot="marker" data-variant={variant} class={cn(styles.root(), classProp)}>
	<span class={styles.content()}>{@render children?.()}</span>
	{#if shape.kind === "bar"}
		<span aria-hidden="true" class={styles.decoration()}>
			<span
				data-drawn={flag}
				class={cn(styles.bar(), animate && "marker-sweep")}
				style={timing()}
			></span>
		</span>
	{:else}
		<svg
			aria-hidden="true"
			fill="none"
			preserveAspectRatio="none"
			viewBox={shape.viewBox}
			data-drawn={shape.kind === "fill" ? flag : undefined}
			class={cn(styles.decoration(), shape.kind === "fill" && animate && "marker-sweep")}
			style={shape.kind === "fill" ? timing(0, 1.1) : undefined}
		>
			<defs>
				<filter id="{id}-hard" x="-30%" y="-30%" width="160%" height="160%">
					<feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" result="n" />
					<feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
				</filter>
				<filter id="{id}-soft" x="-30%" y="-30%" width="160%" height="160%">
					<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="11" result="n" />
					<feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
				</filter>
			</defs>
			{#if shape.kind === "fill"}
				<path d={shape.d} fill="currentColor" filter="url(#{id}-soft)" />
			{:else}
				{#each shape.strokes as stroke (stroke.d)}
					<path
						d={stroke.d}
						pathLength="1"
						stroke="currentColor"
						stroke-width={stroke.width}
						stroke-linecap="round"
						stroke-linejoin={stroke.join}
						opacity={animate ? undefined : stroke.opacity}
						filter="url(#{id}-{stroke.rough})"
						data-drawn={flag}
						class={animate ? "marker-stroke" : undefined}
						style="{timing(stroke.second ? MARKER_STAGGER_MS : 0)} --marker-opacity: {stroke.opacity ?? 1};"
					/>
				{/each}
			{/if}
		</svg>
	{/if}
</span>
