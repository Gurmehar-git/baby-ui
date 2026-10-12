<script lang="ts">
import { CardStack } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { DESTINATIONS } from "../data/card-stack";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof CardStack>>(props));
</script>

<CardStack
	items={DESTINATIONS}
	getKey={(item) => item.city}
	getLabel={(item) => item.city}
	labels={{ left: "Skip", right: "Shortlist" }}
	outcomes={{ left: "skipped", right: "shortlisted" }}
	label="Destinations"
	variant={p.variant ?? "stack"}
	size={p.size ?? "default"}
	buttons={p.buttons ?? true}
>
	{#snippet card(item)}
		<div class="flex h-full flex-col">
			<img src={item.image} alt="" class="min-h-0 w-full flex-1 object-cover" draggable="false" />
			<div class="p-4">
				<p class="font-medium text-foreground">{item.city}</p>
				<p class="text-muted-foreground text-sm">{item.country} · {item.note}</p>
			</div>
		</div>
	{/snippet}
</CardStack>
