<script lang="ts">
import { RangeCalendar as Primitive } from "bits-ui";
import { calendar } from "../../calendar/svelte/variants";
import { cn } from "../../lib/svelte/cn";

let {
	ref = $bindable(null),
	class: classProp,
	...rest
}: Primitive.GridBodyProps = $props();
</script>

<Primitive.GridBody bind:ref class={classProp} {...rest} />
