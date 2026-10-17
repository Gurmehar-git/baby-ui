<script lang="ts">
import { RangeCalendar as Primitive } from "bits-ui";
import { calendar } from "../../calendar/variants";
import { cn } from "../../lib/cn";

let {
	ref = $bindable(null),
	class: classProp,
	...rest
}: Primitive.HeadCellProps = $props();
</script>

<Primitive.HeadCell bind:ref class={cn(calendar().headCell(), classProp)} {...rest} />
