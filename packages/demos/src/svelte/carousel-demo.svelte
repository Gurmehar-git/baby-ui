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
const variant = $derived(p.variant ?? "default");
const showcase = $derived(variant === "showcase");
let index = $state(0);
</script>

<div class={cylindrical ? "w-full max-w-5xl" : showcase ? "w-full max-w-6xl" : "w-full max-w-2xl"}>
	<!-- Remount when rotation settings change, so autoplay starts as the viewer asked. -->
	{#key `${interval}-${String(p.autoplay)}`}
		<Carousel
			label="Rooms at the Harbour"
			{projection}
			visibleItems={p.visibleItems ?? 5}
			minScale={p.minScale ?? 0.58}
			arc={p.arc}
			{variant}
			size={p.size ?? "default"}
			bind:index
			controls={p.controls ?? "full"}
			loop={p.loop ?? cylindrical}
			{interval}
			autoplay={p.autoplay ?? false}
		>
			{#each CAROUSEL_SLIDES as slide (slide.title)}
				<CarouselItem>
					<figure class={showcase ? cylindrical ? "dark relative aspect-[4/5] overflow-hidden rounded-[inherit] bg-muted" : "dark relative h-[clamp(24rem,55cqw,38rem)] overflow-hidden rounded-[inherit] bg-muted" : "overflow-hidden rounded-xl border border-border bg-background"}>
						<img src={slide.image} alt="" width="680" height="520" class={showcase ? "absolute inset-0 size-full object-cover" : "aspect-[4/3] w-full object-cover"} />
						{#if showcase}<div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-linear-to-t from-background/80 via-background/10 to-transparent"></div>{/if}
						<figcaption class={showcase ? "absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-8 text-foreground @max-[640px]:p-5" : "flex items-baseline justify-between gap-3 p-3"}>
							<span class="min-w-0">
								<span class={showcase ? "block text-balance font-semibold text-2xl tracking-tight" : "block truncate font-medium text-foreground text-sm"}>{slide.title}</span>
								<span class={showcase ? "mt-1 block max-w-lg text-pretty text-sm text-foreground/75" : "block truncate text-muted-foreground text-xs"}>{slide.detail}</span>
							</span>
							<span class={showcase ? "shrink-0 rounded-full bg-background/75 px-3 py-1.5 font-medium text-sm tabular-nums backdrop-blur-md" : "shrink-0 text-foreground text-sm tabular-nums"}>{slide.price}</span>
						</figcaption>
					</figure>
				</CarouselItem>
			{/each}
		</Carousel>
	{/key}
</div>
