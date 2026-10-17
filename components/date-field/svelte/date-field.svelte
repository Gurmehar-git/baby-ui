<script lang="ts">
import type { DateValue } from "@internationalized/date";
import { DateField as DateFieldPrimitive } from "bits-ui";
import FieldError from "../../field/svelte/field-error.svelte";
import { cn } from "../../lib/cn";
import { DATE_FIELD_LABELS, type DateFieldLabels } from "../core";
import { type DateFieldSize, dateField } from "../variants";

let {
	value = $bindable(),
	onValueChange,
	locale,
	min,
	max,
	disabled = false,
	invalid = false,
	size = "default",
	labels: labelsProp,
	id,
	name,
	"aria-label": ariaLabel,
	"aria-describedby": describedBy,
	class: classProp,
}: {
	/** Bindable; `undefined` while empty or half typed. */
	value?: DateValue;
	onValueChange?: (value: DateValue | undefined) => void;
	/** BCP 47 locale; sets the segment order and separators. */
	locale?: string;
	min?: DateValue;
	max?: DateValue;
	disabled?: boolean;
	/** Marks the field invalid from outside, e.g. a form error. */
	invalid?: boolean;
	size?: DateFieldSize;
	labels?: Partial<DateFieldLabels>;
	id?: string;
	/** Submits the date as ISO `yyyy-mm-dd`. */
	name?: string;
	"aria-label"?: string;
	"aria-describedby"?: string;
	class?: string;
} = $props();

const labels = $derived({ ...DATE_FIELD_LABELS, ...labelsProp });
const s = $derived(dateField({ size }));
const uid = $props.id();
const errorId = `${uid}-error`;
const outside = $derived(
	value !== undefined &&
		((min !== undefined && value.compare(min) < 0) ||
			(max !== undefined && value.compare(max) > 0)),
);

function set(next: DateValue | undefined) {
	value = next;
	onValueChange?.(next);
}
</script>

<div data-slot="date-field" class={cn(s.root(), classProp)}>
	<DateFieldPrimitive.Root
		bind:value={() => value, set}
		minValue={min}
		maxValue={max}
		{locale}
		{disabled}
		granularity="day"
		validate={invalid ? () => labels.group : undefined}
	>
		<div
			data-slot="date-field-group"
			data-disabled={disabled || undefined}
			aria-invalid={invalid || outside || undefined}
			class={s.group()}
		>
			<span class={s.icon()}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 3v4M8 3v4M4 11h16" />
				</svg>
			</span>
			<DateFieldPrimitive.Input
				data-slot="date-segments"
				{id}
				{name}
				aria-label={ariaLabel ?? labels.group}
				aria-describedby={[describedBy, outside ? errorId : undefined].filter(Boolean).join(" ") ||
					undefined}
				class={s.input()}
			>
				{#snippet children({ segments })}
					{#each segments as { part, value: text }, i (i)}
						<DateFieldPrimitive.Segment {part} class={s.segment()}>{text}</DateFieldPrimitive.Segment>
					{/each}
				{/snippet}
			</DateFieldPrimitive.Input>
		</div>
	</DateFieldPrimitive.Root>
	<FieldError id={errorId} errors={outside ? [{ message: labels.outOfRange }] : undefined} />
</div>
