<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { type OgTaglineMode, type OgTaglineTone, ogTagline } from "./variants";

let {
	name,
	title,
	accent,
	logo,
	mode = "dark",
	tone = "success",
	class: className,
}: {
	/** Brand name beside the logo; one line. */
	name: string;
	/** First headline line. */
	title: string;
	/** Second headline line, set in the tone colour. */
	accent: string;
	/** Logo image URL beside the name. */
	logo?: string;
	mode?: OgTaglineMode;
	tone?: OgTaglineTone;
	class?: string;
} = $props();

const s = $derived(ogTagline({ mode, tone }));
</script>

<div data-slot="og-tagline" class={cn(s.root(), className)}>
	<div class={s.brand()}>
		{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
		<span class={s.name()}>{name}</span>
	</div>
	<div class={s.lines()}>
		<span class={s.line()}>{title}</span>
		<span class={s.accent()}>{accent}</span>
	</div>
</div>
