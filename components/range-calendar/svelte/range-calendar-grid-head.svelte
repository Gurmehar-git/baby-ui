<script lang="ts">
import { RangeCalendar as Primitive } from "bits-ui";
import { calendar } from "../../calendar/variants";
import { cn } from "../../lib/cn";

let {
	ref = $bindable(null),
	class: classProp,
	...rest
}: Primitive.GridHeadProps = $props();
</script>

<Primitive.GridHead bind:ref class={classProp} {...rest} />
