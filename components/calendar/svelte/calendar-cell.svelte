<script lang="ts">
import { Calendar as Primitive } from "bits-ui";
import { cn } from "../../lib/svelte/cn";
import { calendar } from "./variants";

let { ref = $bindable(null), class: classProp, ...rest }: Primitive.CellProps = $props();
</script>

<Primitive.Cell bind:ref class={cn(calendar().cell(), classProp)} {...rest} />
