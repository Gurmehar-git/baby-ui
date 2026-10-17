<script lang="ts">
import { RangeCalendar as Primitive } from "bits-ui";
import { calendar } from "../../calendar/variants";
import { cn } from "../../lib/cn";

let { ref = $bindable(null), class: classProp, ...rest }: Primitive.DayProps = $props();
</script>

<Primitive.Day
	bind:ref
	data-slot="calendar-day"
	class={cn(calendar().day(), calendar().rangeDay(), classProp)}
	{...rest}
/>
