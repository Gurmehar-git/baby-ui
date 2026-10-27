<script lang="ts">
import { Carousel, CarouselItem } from "@baby-ui/svelte";

let { rooms }: { rooms: { name: string; image: string }[] } = $props();
let index = $state(0);
</script>

<Carousel label="Rooms at the Harbour" variant="showcase" interval={4000} bind:index>
	{#each rooms as room (room.name)}
		<CarouselItem>
			<figure class="dark relative h-[clamp(24rem,55cqw,38rem)] overflow-hidden rounded-[inherit] bg-muted">
				<img src={room.image} alt="" class="size-full object-cover" />
				<div class="absolute inset-0 bg-linear-to-t from-background/75 to-transparent"></div>
				<figcaption class="absolute inset-x-0 bottom-0 p-8 font-semibold text-2xl text-foreground">{room.name}</figcaption>
			</figure>
		</CarouselItem>
	{/each}
</Carousel>
