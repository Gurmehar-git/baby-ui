<script lang="ts">
import { RangeCalendar as Primitive } from "bits-ui";
import { calendar } from "../../calendar/variants";
import { cn } from "../../lib/cn";

let {
	ref = $bindable(null),
	class: classProp,
	...rest
}: Primitive.HeadingProps = $props();
</script>

<Primitive.Heading bind:ref class={cn(calendar().heading(), classProp)} {...rest} />
