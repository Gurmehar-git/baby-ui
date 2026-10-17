<script lang="ts">
import { RangeCalendar as Primitive } from "bits-ui";
import { calendar } from "../../calendar/variants";
import { cn } from "../../lib/cn";

let { ref = $bindable(null), class: classProp, ...rest }: Primitive.DayProps = $props();
</script>

<Primitive.Day bind:ref class={cn(calendar().day(), calendar().rangeDay(), classProp)} {...rest} />
