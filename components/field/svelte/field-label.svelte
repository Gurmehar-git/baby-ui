<script lang="ts">
import type { ComponentProps } from "svelte";
import Label from "../../label/svelte/label.svelte";
import { cn } from "../../lib/svelte/cn";
import { field } from "./variants";

let {
	ref = $bindable(null),
	class: classProp,
	children,
	...rest
}: ComponentProps<typeof Label> = $props();
</script>

<Label bind:ref data-slot="field-label" class={cn(field().label(), classProp)} {...rest}>
	{@render children?.()}
</Label>
