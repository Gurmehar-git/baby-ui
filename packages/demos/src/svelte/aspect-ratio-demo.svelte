<script lang="ts">
import { AspectRatio, AspectRatioImage } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { CAROUSEL_SLIDES } from "../data/carousel";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof AspectRatio>>(props));
const ratios = [
	{ label: "16:9", value: 16 / 9 },
	{ label: "1:1", value: 1 },
	{ label: "4:5", value: 4 / 5 },
];
let ratio = $state(16 / 9);
$effect(() => {
	ratio = p.ratio ?? 16 / 9;
});
const image = CAROUSEL_SLIDES[0];
</script>

{#if image}
	<div class="grid w-full max-w-lg gap-4">
		<fieldset class="flex justify-center gap-2">
			<legend class="sr-only">Aspect ratio</legend>
			{#each ratios as item (item.label)}
				<button
					type="button"
					aria-pressed={ratio === item.value}
					class="rounded-full border border-border px-3 py-1.5 text-sm transition-[scale,background-color,color] duration-(--duration-fast) active:scale-(--press-scale) aria-pressed:bg-foreground aria-pressed:text-background"
					onclick={() => (ratio = item.value)}
				>
					{item.label}
				</button>
			{/each}
		</fieldset>
		<AspectRatio {ratio} motion={p.motion ?? "smooth"} class="rounded-2xl bg-muted">
			<AspectRatioImage
				src={image.image}
				alt={image.title}
				width={680}
				height={520}
				fit={(props.fit as "cover" | "contain") ?? "cover"}
			/>
		</AspectRatio>
	</div>
{/if}
