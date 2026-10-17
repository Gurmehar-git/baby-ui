<script lang="ts">
import type { ComponentProps } from "svelte";
import { cn } from "../../lib/cn";
import Separator from "../../separator/svelte/separator.svelte";
import { buttonGroup } from "../variants";

let {
	ref = $bindable(null),
	class: classProp,
	orientation = "vertical",
	...rest
}: ComponentProps<typeof Separator> = $props();
</script>

<Separator
	bind:ref
	data-slot="button-group-separator"
	{orientation}
	class={cn(buttonGroup().separator(), classProp)}
	{...rest}
/>
