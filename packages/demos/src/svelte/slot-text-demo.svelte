<script lang="ts">
import { Button, SlotText } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof SlotText>>(props));
const PRICES = [12480, 9875, 128430, 1004, 56210];
const money = (value: number) => `$${value.toLocaleString("en-US")}`;
let step = $state(0);
</script>

<div class="flex flex-col items-center gap-4">
	<SlotText
		value={PRICES[step % PRICES.length] ?? 0}
		format={money}
		variant={p.variant}
		size={p.size ?? "default"}
		duration={p.duration}
		spins={p.spins}
		class="font-semibold"
	/>
	<Button variant="outline" size="sm" onclick={() => (step += 1)}>Next price</Button>
</div>
