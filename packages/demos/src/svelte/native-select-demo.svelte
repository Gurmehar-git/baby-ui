<script lang="ts">
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof NativeSelect>>(props));

let region = $state("fra");
</script>

<div class="flex w-full max-w-60 flex-col gap-1.5">
	<label for="region" class="font-medium text-sm">Region</label>
	<NativeSelect id="region" class="w-full" size={p.size ?? "default"} bind:value={region} disabled={p.disabled ?? false}>
		<NativeSelectOptGroup label="Europe">
			<NativeSelectOption value="fra">Frankfurt</NativeSelectOption>
			<NativeSelectOption value="lhr">London</NativeSelectOption>
		</NativeSelectOptGroup>
		<NativeSelectOptGroup label="Americas">
			<NativeSelectOption value="iad">Virginia</NativeSelectOption>
			<NativeSelectOption value="sfo">San Francisco</NativeSelectOption>
		</NativeSelectOptGroup>
	</NativeSelect>
</div>
