<script lang="ts">
import { cn } from "../../lib/cn";
import { OG_SCATTER_TILES, type OgScatterMode, ogScatter } from "../variants";

let {
	name,
	logo,
	tagline,
	images,
	mode = "light",
	class: className,
}: {
	/** Brand name, set as the wordmark; one line. */
	name: string;
	/** Logo image URL beside the name. */
	logo?: string;
	tagline?: string;
	/** Image URLs for the seven tiles around the mark; they repeat to fill. */
	images: string[];
	mode?: OgScatterMode;
	class?: string;
} = $props();

const s = $derived(ogScatter({ mode }));
const pics = $derived(images.filter(Boolean));
</script>

<div data-slot="og-scatter" class={cn(s.root(), className)}>
	{#if pics.length}
		{#each OG_SCATTER_TILES as tile, i (`${tile.left}-${tile.top}`)}
			<img
				src={pics[i % pics.length]}
				alt=""
				class={cn(s.tile(), tile.soft && s.softTile())}
				style="left:{tile.left}px;top:{tile.top}px;width:{tile.width}px;height:{tile.height}px"
			/>
		{/each}
	{/if}
	<div class={s.mark()}>
		<div class={s.wordmark()}>
			{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
			<span class={s.name()}>{name}</span>
		</div>
		{#if tagline}<p class={s.tagline()}>{tagline}</p>{/if}
	</div>
</div>
