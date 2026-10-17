<script lang="ts">
import { cn } from "../../lib/cn";
import { BANNER_DEFAULTS, bannerPace } from "../banner";
import { ctaBannerStyles } from "./context";

let {
	radius = BANNER_DEFAULTS.radius,
	grid = true,
	sweep = true,
	class: classProp,
}: {
	/** The light's radius in pixels. */
	radius?: number;
	/** The grid the light reveals. */
	grid?: boolean;
	/** A highlight that sweeps along the top edge. */
	sweep?: boolean;
	class?: string;
} = $props();

const s = $derived(ctaBannerStyles());
</script>

<span
	aria-hidden="true"
	data-slot="cta-banner-spotlight"
	class={cn(s.layer(), "rounded-[inherit]", classProp)}
	style:--r="{radius}px"
>
	<span class={s.spotEdge()}></span>
	<span class={s.spotSurface()}></span>
	<span class={s.spotOrb()}></span>
	{#if grid}
		<span class={s.spotGrid()}></span>
		<span class={s.spotReveal()}></span>
	{/if}
	<span class={s.spotLight()}></span>
	{#if sweep}<span class={s.spotSweep()} style:animation-duration={bannerPace(6)}></span>{/if}
</span>
