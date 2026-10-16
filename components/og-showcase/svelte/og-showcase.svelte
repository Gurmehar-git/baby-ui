<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { OG_SHOWCASE_COLUMNS, type OgShowcaseMode, ogShowcase } from "./variants";

let {
	title,
	images,
	site,
	logo,
	description,
	mode = "light",
	class: className,
}: {
	/** Headline, bottom left; clamps to four lines. */
	title: string;
	/** Screenshot URLs for the two columns of framed shots; they repeat to fill. */
	images: string[];
	/** Product name beside the logo. */
	site?: string;
	logo?: string;
	description?: string;
	mode?: OgShowcaseMode;
	class?: string;
} = $props();

const s = $derived(ogShowcase({ mode }));
const pics = $derived(images.filter(Boolean));
</script>

<div data-slot="og-showcase" class={cn(s.root(), className)}>
	{#if pics.length}
		{#each OG_SHOWCASE_COLUMNS as col, c (col.left)}
			<div class={s.column()} style="left:{col.left}px;top:{col.top}px">
				{#each col.heights as height, i (`${height}-${i}`)}
					<div class={s.frame()} style="height:{height}px">
						<img src={pics[(c * 3 + i) % pics.length]} alt="" class={s.shot()} />
					</div>
				{/each}
			</div>
		{/each}
	{/if}
	{#if logo || site}
		<div class={s.brand()}>
			{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
			{#if site}<span class={s.site()}>{site}</span>{/if}
		</div>
	{/if}
	<h1 class={s.title()}>{title}</h1>
	{#if description}<p class={s.description()}>{description}</p>{/if}
</div>
