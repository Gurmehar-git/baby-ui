<script lang="ts">
import { RadioGroup, RadioGroupItem } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof RadioGroup>>(props));

let value = $state("weekly");
</script>

<RadioGroup
	bind:value
	orientation={p.orientation ?? "vertical"}
	variant={p.variant ?? "default"}
	size={p.size ?? "default"}
	disabled={p.disabled ?? false}
	name="demo-radio"
>
	<RadioGroupItem value="daily" label="Daily digest" />
	<RadioGroupItem value="weekly" label="Weekly summary" />
	<RadioGroupItem value="never" label="Never" />
</RadioGroup>
