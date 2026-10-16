<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { OG_SPOTLIGHT_TILES, type OgSpotlightMode, ogSpotlight } from "./variants";

let {
	title,
	images,
	site,
	logo,
	mode = "light",
	class: className,
}: {
	/** Centred headline; clamps to two lines. */
	title: string;
	/** Portrait URLs for the eight tiles around the headline; they repeat to fill. */
	images: string[];
	/** Product name under the headline. */
	site?: string;
	logo?: string;
	mode?: OgSpotlightMode;
	class?: string;
} = $props();

const s = $derived(ogSpotlight({ mode }));
const pics = $derived(images.filter(Boolean));
</script>

<div data-slot="og-spotlight" class={cn(s.root(), className)}>
	<div class={s.grid()}></div>
	{#if pics.length}
		{#each OG_SPOTLIGHT_TILES as tile, i (`${tile.left}-${tile.top}`)}
			<img
				src={pics[i % pics.length]}
				alt=""
				class={s.face()}
				style="left:{tile.left}px;top:{tile.top}px;width:{tile.width}px;height:{tile.height}px"
			/>
		{/each}
	{/if}
	<h1 class={s.title()}>{title}</h1>
	{#if logo || site}
		<div class={s.brand()}>
			{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
			{#if site}<span class={s.site()}>{site}</span>{/if}
		</div>
	{/if}
</div>
