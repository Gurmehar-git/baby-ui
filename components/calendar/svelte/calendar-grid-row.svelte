<script lang="ts">
import { Calendar as Primitive } from "bits-ui";
import { cn } from "../../lib/svelte/cn";
import { calendar } from "./variants";

let {
	ref = $bindable(null),
	class: classProp,
	...rest
}: Primitive.GridRowProps = $props();
</script>

<Primitive.GridRow bind:ref class={cn(calendar().gridRow(), classProp)} {...rest} />
