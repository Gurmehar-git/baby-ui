<script lang="ts">
import Accordion from "../../accordion/svelte/accordion.svelte";
import AccordionContent from "../../accordion/svelte/accordion-content.svelte";
import AccordionItem from "../../accordion/svelte/accordion-item.svelte";
import AccordionTrigger from "../../accordion/svelte/accordion-trigger.svelte";
import Checkbox from "../../checkbox/svelte/checkbox.svelte";
import { cn } from "../../lib/cn";
import { toggleFilter } from "../filters";
import { filterMenuState } from "./context";

let {
	pickedLabel = (count: number) => `${count} picked`,
	class: classProp,
}: { pickedLabel?: (count: number) => string; class?: string } = $props();
const ctx = filterMenuState("FilterMenuGroups");
</script>

<!-- Every group as an accordion item with its options as checkboxes and a count of picks. -->
<Accordion
	type="multiple"
	bind:value={() => ctx.open, (next) => ctx.setOpen(Array.isArray(next) ? next : next ? [next] : [])}
	class={cn(ctx.styles.groups(), classProp)}
>
	{#each ctx.groups as group (group.id)}
		{@const count = ctx.value[group.id]?.length ?? 0}
		<AccordionItem value={group.id} class={ctx.styles.item()}>
			<AccordionTrigger class={ctx.styles.trigger()}>
				<span class={ctx.styles.groupLabel()}>{group.label}</span>
				<span class={ctx.styles.groupPicked()}>{count > 0 ? pickedLabel(count) : ""}</span>
				<span class={ctx.styles.groupCount()}>{group.options.length}</span>
			</AccordionTrigger>
			<AccordionContent>
				<div class={ctx.styles.options()}>
					{#each group.options as option (option.id)}
						<Checkbox
							label={option.label}
							bind:checked={
								() => ctx.value[group.id]?.includes(option.id) ?? false,
								(on) => ctx.setValue(toggleFilter(ctx.value, group.id, option.id, on))
							}
						/>
					{/each}
				</div>
			</AccordionContent>
		</AccordionItem>
	{/each}
</Accordion>
