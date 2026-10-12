<script lang="ts">
import { cn } from "../lib/cn";
import { bindScrollProgress } from "../lib/scroll-frame";
import { CHOREOGRAPHY_SLOTS, type ScrollChoreographyImages } from "./types";
import {
	type ScrollChoreographySize,
	type ScrollChoreographyVariant,
	scrollChoreography,
} from "./variants";

let {
	images,
	variant = "expand",
	size = "default",
	label = "Scroll to arrange the images",
	class: classProp,
}: {
	/** Four images; `topRight` is the one that ends up filling the frame. */
	images: ScrollChoreographyImages;
	/** `expand` grows the top-right image to fill the frame at the end; `stack` stops at the stack. */
	variant?: ScrollChoreographyVariant;
	size?: ScrollChoreographySize;
	/** Accessible name of the scroll region. */
	label?: string;
	class?: string;
} = $props();

let root = $state<HTMLElement>();
let track = $state<HTMLDivElement>();
const s = $derived(scrollChoreography({ size, variant }));

$effect(() => {
	if (!root || !track) return;
	return bindScrollProgress(root, track);
});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<section
	bind:this={root}
	data-slot="scroll-choreography"
	aria-label={label}
	tabindex="0"
	class={cn(s.root(), classProp)}
>
	<div bind:this={track} class={s.track()}>
		<div class={s.stage()}>
			{#each CHOREOGRAPHY_SLOTS as slot (slot.key)}
				<div
					class={cn(s.image(), slot.key === "topRight" ? s.hero() : s.under())}
					style="--x0: {slot.x}; --y0: {slot.y}; --dy: {slot.dy}; z-index: {slot.z};"
				>
					<img
						src={images[slot.key].src}
						alt={images[slot.key].alt}
						class={s.img()}
						draggable="false"
					/>
				</div>
			{/each}
		</div>
	</div>
</section>
