<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { type OgWordmarkMode, ogWordmark } from "./variants";

let {
	name,
	logo,
	tagline,
	mode = "light",
	class: className,
}: {
	/** Brand name, set as the wordmark; one line. */
	name: string;
	/** Logo image URL beside the name. */
	logo?: string;
	tagline?: string;
	mode?: OgWordmarkMode;
	class?: string;
} = $props();

const s = $derived(ogWordmark({ mode }));
</script>

<div data-slot="og-wordmark" class={cn(s.root(), className)}>
	<div class={s.mark()}>
		<div class={s.wordmark()}>
			{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
			<span class={s.name()}>{name}</span>
		</div>
		{#if tagline}<p class={s.tagline()}>{tagline}</p>{/if}
	</div>
</div>
