<script lang="ts">
import { cn } from "../../lib/cn";
import { type OgSplitMode, ogSplit } from "../variants";

let {
	name,
	image,
	logo,
	tagline,
	mode = "dark",
	class: className,
}: {
	/** Brand name, set as the wordmark; one line. */
	name: string;
	/** Image URL for the curved panel on the right. */
	image: string;
	/** Logo image URL beside the name. */
	logo?: string;
	tagline?: string;
	mode?: OgSplitMode;
	class?: string;
} = $props();

const s = $derived(ogSplit({ mode }));
</script>

<div data-slot="og-split" class={cn(s.root(), className)}>
	<img src={image} alt="" class={s.panel()} />
	<div class={s.mark()}>
		<div class={s.wordmark()}>
			{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
			<span class={s.name()}>{name}</span>
		</div>
		{#if tagline}<p class={s.tagline()}>{tagline}</p>{/if}
	</div>
</div>
