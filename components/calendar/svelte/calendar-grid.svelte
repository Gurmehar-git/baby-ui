<script lang="ts">
import { Calendar as Primitive } from "bits-ui";
import { cn } from "../../lib/svelte/cn";
import { calendar } from "./variants";

let { ref = $bindable(null), class: classProp, ...rest }: Primitive.GridProps = $props();
</script>

<Primitive.Grid bind:ref class={cn(calendar().grid(), classProp)} {...rest} />
