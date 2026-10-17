<script lang="ts">
import { cn } from "../../lib/cn";
import {
	type OgProductLaunchLayout,
	type OgProductLaunchMode,
	type OgProductLaunchTone,
	ogProductLaunch,
} from "../variants";

let {
	name,
	tagline,
	badge,
	brand,
	logo,
	url,
	screenshot,
	mode = "light",
	tone = "neutral",
	layout = "split",
	class: className,
}: {
	/** Product name, the headline. */
	name: string;
	tagline?: string;
	/** Filled launch badge above the name, e.g. "Now available". */
	badge?: string;
	brand?: string;
	logo?: string;
	/** Plain muted line under the tagline (split layout only). */
	url?: string;
	/** Absolute image URL, shown as a floating rounded shot that bleeds off the canvas. */
	screenshot?: string;
	mode?: OgProductLaunchMode;
	tone?: OgProductLaunchTone;
	layout?: OgProductLaunchLayout;
	class?: string;
} = $props();

const s = $derived(ogProductLaunch({ mode, tone, layout }));
</script>

<div data-slot="og-product-launch" class={cn(s.root(), className)}>
	<div class={s.shot()}>
		<div class={s.frame()}>
			{#if screenshot}<img src={screenshot} alt="" class={s.image()} />{/if}
		</div>
	</div>
	<div class={s.content()}>
		{#if brand || logo}
			<div class={s.brand()}>
				{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
				{#if brand}<span class={s.brandName()}>{brand}</span>{/if}
			</div>
		{/if}
		<div class={s.body()}>
			{#if badge}<span class={s.badge()}>{badge}</span>{/if}
			<h1 class={s.name()}>{name}</h1>
			{#if tagline}<p class={s.tagline()}>{tagline}</p>{/if}
			{#if url}<span class={s.url()}>{url}</span>{/if}
		</div>
	</div>
</div>
