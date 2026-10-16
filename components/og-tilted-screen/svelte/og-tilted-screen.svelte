<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import {
	type OgTiltedScreenMode,
	type OgTiltedScreenTone,
	ogTiltedScreen,
} from "./variants";

let {
	title,
	image,
	site,
	logo,
	description,
	mode = "dark",
	tone = "primary",
	class: className,
}: {
	/** Headline, left; clamps to three lines. */
	title: string;
	/** Screenshot URL, tilted off the right edge. */
	image: string;
	/** Product name beside the logo. */
	site?: string;
	logo?: string;
	description?: string;
	mode?: OgTiltedScreenMode;
	tone?: OgTiltedScreenTone;
	class?: string;
} = $props();

const s = $derived(ogTiltedScreen({ mode, tone }));
</script>

<div data-slot="og-tilted-screen" class={cn(s.root(), className)}>
	<div class={s.glow()}></div>
	<img src={image} alt="" class={s.screen()} />
	{#if logo || site}
		<div class={s.brand()}>
			{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
			{#if site}<span class={s.site()}>{site}</span>{/if}
		</div>
	{/if}
	<h1 class={s.title()}>{title}</h1>
	{#if description}<p class={s.description()}>{description}</p>{/if}
</div>
