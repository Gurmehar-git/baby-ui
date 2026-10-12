<script lang="ts">
import { Carousel, CarouselItem } from "@baby-ui/svelte";

let { rooms }: { rooms: { name: string; image: string }[] } = $props();
</script>

<Carousel label="Rooms at the Harbour" interval={4000}>
	{#each rooms as room (room.name)}
		<CarouselItem>
			<img src={room.image} alt={room.name} class="aspect-[4/3] w-full rounded-xl object-cover" />
		</CarouselItem>
	{/each}
</Carousel>
