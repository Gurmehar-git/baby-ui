<script lang="ts">
import { RangeCalendar as Primitive } from "bits-ui";
import { calendar } from "../../calendar/svelte/variants";
import { cn } from "../../lib/svelte/cn";

let {
	ref = $bindable(null),
	class: classProp,
	value,
	onchange,
	...rest
}: Omit<Primitive.MonthSelectProps, "child" | "children"> = $props();

const s = calendar();
</script>

<!-- A native select under a styled label: platform pickers on touch, full keyboard support. -->
<span class={cn(s.dropdown(), classProp)}>
	<Primitive.MonthSelect bind:ref class="absolute inset-0 bg-popover opacity-0" {...rest}>
		{#snippet child({ props, monthItems, selectedMonthItem })}
			<select {...props} {value} {onchange}>
				{#each monthItems as item (item.value)}
					<option
						value={item.value}
						selected={value !== undefined ? item.value === value : item.value === selectedMonthItem.value}
					>
						{item.label}
					</option>
				{/each}
			</select>
			<span class={s.dropdownLabel()} aria-hidden="true">
				{monthItems.find((item) => item.value === value)?.label || selectedMonthItem.label}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="m6 9 6 6 6-6" />
				</svg>
			</span>
		{/snippet}
	</Primitive.MonthSelect>
</span>
