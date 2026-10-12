<script lang="ts">
import { Button, Spinner } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Spinner>>(props));

const size = $derived(p.size ?? "default");
const label = $derived(p.label || "Checking availability");
</script>

<div class="flex w-64 flex-col items-center gap-4">
	<div class="flex items-center gap-2.5 text-muted-foreground">
		<Spinner {size} {label} />
		<span class="text-sm">{label}</span>
	</div>
	<Button loading loadingLabel="Reserving…" class="w-full">Reserve name</Button>
</div>
