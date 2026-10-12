<script lang="ts">
import { CardStack } from "@baby-ui/svelte";

type Place = { id: string; name: string };
let { places, onShortlist }: { places: Place[]; onShortlist: (place: Place) => void } =
	$props();
</script>

<CardStack
	items={places}
	getKey={(place) => place.id}
	getLabel={(place) => place.name}
	labels={{ left: "Skip", right: "Shortlist" }}
	onDecide={(place, decision) => decision === "right" && onShortlist(place)}
>
	{#snippet card(place)}<p class="p-6 font-medium">{place.name}</p>{/snippet}
</CardStack>
