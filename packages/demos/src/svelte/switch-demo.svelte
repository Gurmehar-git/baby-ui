<script lang="ts">
import { Switch } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Switch>>(props));

let checked = $state(false);
let digest = $state(true);

$effect(() => {
	checked = p.checked ?? false;
});

const size = $derived(p.size ?? "default");
const variant = $derived(p.variant ?? "default");

// Switch renders its own label; reversing the row puts the text first without a second one.
const ROW = "flex w-full flex-row-reverse items-center justify-between gap-6";
</script>

<div class="flex w-full max-w-72 flex-col divide-y divide-border rounded-xl border border-border">
	<div class="px-4 py-3">
		<Switch
			bind:checked
			{variant}
			{size}
			disabled={p.disabled ?? false}
			label={p.label || "Push notifications"}
			class={ROW}
		/>
	</div>
	<div class="px-4 py-3">
		<Switch bind:checked={digest} {variant} label="Weekly digest" class={ROW} />
	</div>
	<div class="px-4 py-3">
		<Switch checked={false} {variant} disabled label="SMS alerts" class={ROW} />
	</div>
</div>
