<script lang="ts">
import { RangeCalendar as Primitive } from "bits-ui";
import { calendar } from "../../calendar/variants";
import { cn } from "../../lib/cn";

let {
	ref = $bindable(null),
	class: classProp,
	...rest
}: Primitive.GridRowProps = $props();
</script>

<Primitive.GridRow bind:ref class={cn(calendar().gridRow(), classProp)} {...rest} />
