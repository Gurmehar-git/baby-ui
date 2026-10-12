<script lang="ts">
import { cn } from "../lib/cn";
import { type ScrollRevealSize, scrollReveal } from "./variants";

let {
	text,
	minOpacity = 0.5,
	blur = true,
	size = "default",
	class: classProp,
}: {
	/** The text to reveal word by word as the container scrolls. */
	text: string;
	/** Opacity of words not yet reached by the scroll position. */
	minOpacity?: number;
	/** Also blurs unreached words, sharpening as they're reached. */
	blur?: boolean;
	size?: ScrollRevealSize;
	class?: string;
} = $props();

const words = $derived(text.trim().split(/\s+/));
let el = $state<HTMLDivElement>();

$effect(() => {
	const node = el;
	if (!node) return;
	let raf = 0;
	function onScroll() {
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			if (!node) return;
			const maxScroll = node.scrollHeight - node.clientHeight;
			const progress = maxScroll > 0 ? node.scrollTop / maxScroll : 0;
			node.style.setProperty("--sr-progress", String(progress));
		});
	}
	node.addEventListener("scroll", onScroll, { passive: true });
	return () => {
		node.removeEventListener("scroll", onScroll);
		cancelAnimationFrame(raf);
	};
});
</script>

<div
	bind:this={el}
	data-slot="scroll-reveal"
	class={cn(scrollReveal({ size }), classProp)}
	style="--sr-min: {minOpacity};"
>
	<div class="sticky top-0 flex h-full w-full items-center justify-center">
		<div class="flex h-fit w-full flex-wrap justify-center gap-x-[0.35em] p-8">
			{#each words as word, index (index + word)}
				<span
					data-blur={blur}
					class="scroll-reveal-word"
					style="--sr-t: clamp(0, calc((var(--sr-progress, 0) - {index / words.length}) * {words.length}), 1);"
				>
					{word}
				</span>
			{/each}
		</div>
	</div>
	{#each words as _, index (index)}
		<div class="h-32" aria-hidden="true"></div>
	{/each}
</div>
