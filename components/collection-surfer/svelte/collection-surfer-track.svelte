<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import type { ImageSlotProps } from "../../lib/image";
import { collectionSurferState } from "./context";

let {
	image,
	class: classProp,
}: {
	/** Renders each image, e.g. through your framework's image component; defaults to `<img>`. */
	image?: Snippet<[ImageSlotProps]>;
	class?: string;
} = $props();
const surfer = collectionSurferState();
const s = $derived(surfer.styles);
const count = $derived(surfer.items.length);
</script>

<!-- The endless line of cards; the second set repeats the first and is hidden from screen readers. -->
<div data-slot="collection-surfer-track" class={cn(s.scene(), classProp)}>
	<div class={s.track()}>
		{#each [...surfer.items, ...surfer.items] as item, i (`${i}-${item.src}`)}
			<div data-surf-card="" aria-hidden={i >= count || undefined} class={s.card()} style="--i: {i};">
				<span class={s.number()}>{String((i % count) + 1).padStart(2, "0")}</span>
				<div class={s.frame()}>
					{#if image}{@render image({ src: item.src, alt: item.alt, className: s.image() })}{:else}<img src={item.src} alt={item.alt} class={s.image()} draggable="false" />{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
