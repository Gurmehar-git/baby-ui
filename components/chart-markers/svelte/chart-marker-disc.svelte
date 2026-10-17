<script lang="ts">
import { cn } from "../../lib/cn";
import { MARKER_SPRING } from "../geometry";
import { actionable, assign, type ChartMarker, spring } from "./types";

let {
	marker,
	label,
	class: className,
	tabindex,
}: { marker: ChartMarker; label: string; class: string; tabindex?: number } = $props();

let el = $state<HTMLElement | null>(null);
let hovered = false;
const press = spring(MARKER_SPRING.press, (v) => assign(el, { scale: String(v) }));
press.jump(1);
$effect(() => () => press.stop());

const classes = $derived(
	cn(className, "cursor-pointer transition-shadow hover:shadow-lg"),
);
const handlers = {
	onpointerenter: () => {
		hovered = true;
		press.set(1.15);
	},
	onpointerleave: () => {
		hovered = false;
		press.set(1);
	},
	onpointerdown: () => press.set(0.95),
	onpointerup: () => press.set(hovered ? 1.15 : 1),
};
</script>

{#snippet face()}
	{#if marker.icon}
		{@render marker.icon()}
	{:else}
		{marker.title.slice(0, 1).toUpperCase()}
	{/if}
{/snippet}

{#if !actionable(marker)}
	<span role="img" aria-label={label} class={className} style:background={marker.color}>
		{@render face()}
	</span>
{:else if marker.href}
	<a
		bind:this={el}
		href={marker.href}
		target={marker.target}
		rel={marker.target === "_blank" ? "noopener noreferrer" : undefined}
		aria-label={label}
		{tabindex}
		class={classes}
		style:background={marker.color}
		onclick={marker.onclick}
		{...handlers}
	>
		{@render face()}
	</a>
{:else}
	<button
		bind:this={el}
		type="button"
		aria-label={label}
		{tabindex}
		class={classes}
		style:background={marker.color}
		onclick={marker.onclick}
		{...handlers}
	>
		{@render face()}
	</button>
{/if}
