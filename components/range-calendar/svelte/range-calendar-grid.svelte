<script lang="ts">
import { RangeCalendar as Primitive } from "bits-ui";
import { calendar } from "../../calendar/variants";
import { cn } from "../../lib/cn";

let { ref = $bindable(null), class: classProp, ...rest }: Primitive.GridProps = $props();
</script>

<Primitive.Grid bind:ref class={cn(calendar().grid(), classProp)} {...rest} />
