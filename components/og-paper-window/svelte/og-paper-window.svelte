<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import {
	OG_PAPER_WINDOW_LIGHTS,
	type OgPaperWindowMode,
	ogPaperWindow,
	ogPaperWindowLight,
} from "./variants";

let {
	name,
	title,
	image,
	logo,
	mode = "light",
	class: className,
}: {
	/** Brand name set as the wordmark; one line. */
	name: string;
	/** Up to three lines in the serif. */
	title: string;
	/** Artwork URL behind the window. */
	image: string;
	/** Logo image URL beside the name. */
	logo?: string;
	mode?: OgPaperWindowMode;
	class?: string;
} = $props();

const s = $derived(ogPaperWindow({ mode }));
</script>

<div data-slot="og-paper-window" class={cn(s.root(), className)}>
	<img src={image} alt="" class={s.image()} />
	<div class={s.paper()}>
		<div class={s.lights()}>
			{#each OG_PAPER_WINDOW_LIGHTS as button (button)}
				<span class={cn(s.light(), ogPaperWindowLight({ button }))}></span>
			{/each}
		</div>
		<div class={s.brand()}>
			{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
			<span class={s.name()}>{name}</span>
		</div>
		<p class={s.title()}>{title}</p>
	</div>
</div>
