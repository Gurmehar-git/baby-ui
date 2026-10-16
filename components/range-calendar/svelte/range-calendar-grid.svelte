<script lang="ts">
import { RangeCalendar as Primitive } from "bits-ui";
import { calendar } from "../../calendar/svelte/variants";
import { cn } from "../../lib/svelte/cn";

let { ref = $bindable(null), class: classProp, ...rest }: Primitive.GridProps = $props();
</script>

<Primitive.Grid bind:ref class={cn(calendar().grid(), classProp)} {...rest} />
