<script lang="ts">
import type { Snippet } from "svelte";
import type { Attachment } from "svelte/attachments";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { timelineScale } from "../variants";
import { getTimelineScale } from "./context";

let {
	children,
	value,
	label,
	description,
	class: classProp,
	...rest
}: Omit<HTMLAttributes<HTMLLIElement>, "children"> & {
	children: Snippet;
	value: string;
	label: string;
	description?: string;
} = $props();
const context = getTimelineScale();
const active = $derived(context.active === value);
const s = $derived(
	timelineScale({ orientation: context.orientation, variant: context.variant }),
);
const descriptionId = $props.id();

function registerTrigger(
	currentValue: string,
	currentLabel: string,
	currentDescription?: string,
): Attachment<HTMLButtonElement> {
	return (element) =>
		context.register({
			id: currentValue,
			label: currentLabel,
			description: currentDescription,
			element,
		});
}
</script>

<li
	data-slot="timeline-scale-item"
	data-active={active || undefined}
	class={cn(s.item(), classProp)}
	{...rest}
>
	<button
		{@attach registerTrigger(value, label, description)}
		type="button"
		data-slot="timeline-scale-item-trigger"
		aria-current={active ? "step" : undefined}
		aria-label={label}
		aria-describedby={description ? descriptionId : undefined}
		tabindex={active ? 0 : -1}
		class={s.itemTrigger()}
		onclick={() => context.select(value)}
		onkeydown={(event) => context.move(event, value)}
	>
		{@render children()}
	</button>
	{#if description}<span id={descriptionId} class="sr-only">{description}</span>{/if}
</li>
