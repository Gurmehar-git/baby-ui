<script lang="ts">
import { Carousel, CarouselItem } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { CAROUSEL_SLIDES } from "../data/carousel";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Carousel>>(props));
const interval = $derived(p.interval || 4000);
const projection = $derived(p.projection ?? "linear");
const cylindrical = $derived(projection !== "linear");
</script>

<div class={cylindrical ? "w-full max-w-5xl" : "w-full max-w-2xl"}>
	<!-- Remount when rotation settings change, so autoplay starts as the viewer asked. -->
	{#key `${interval}-${String(p.autoplay)}`}
		<Carousel
			label="Rooms at the Harbour"
			{projection}
			visibleItems={p.visibleItems ?? 5}
			minScale={p.minScale ?? 0.58}
			arc={p.arc}
			variant={p.variant ?? "default"}
			size={p.size ?? "default"}
			controls={p.controls ?? "full"}
			loop={p.loop ?? cylindrical}
			{interval}
			autoplay={p.autoplay ?? false}
			slideSize={cylindrical ? "min(22cqw,14.375rem)" : undefined}
		>
			{#each CAROUSEL_SLIDES as slide (slide.title)}
				<CarouselItem>
					<figure class={cylindrical ? "aspect-square overflow-hidden rounded-full border border-border/60 bg-background" : "overflow-hidden rounded-xl border border-border bg-background"}>
						<img src={slide.image} alt="" width="680" height="520" class={cylindrical ? "size-full object-cover" : "aspect-[4/3] w-full object-cover"} />
						<figcaption class={cylindrical ? "sr-only" : "flex items-baseline justify-between gap-3 p-3"}>
							<span class="min-w-0">
								<span class="block truncate font-medium text-foreground text-sm">{slide.title}</span>
								<span class="block truncate text-muted-foreground text-xs">{slide.detail}</span>
							</span>
							<span class="shrink-0 text-foreground text-sm tabular-nums">{slide.price}</span>
						</figcaption>
					</figure>
				</CarouselItem>
			{/each}
		</Carousel>
	{/key}
</div>
