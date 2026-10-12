<script lang="ts">
import { PhoneInput } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof PhoneInput>>(props));
let value = $state("");
</script>

<div class="flex w-full max-w-xs flex-col gap-2">
	<PhoneInput
		label={p.label || "Phone number"}
		defaultCountry="GB"
		preferredCountries={["GB", "US", "IN"]}
		variant={p.variant}
		size={p.size}
		validate={p.validate}
		bind:value
	/>
	<p class="h-4 text-muted-foreground text-xs tabular-nums">{value}</p>
</div>
