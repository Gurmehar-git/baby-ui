<script lang="ts">
import type { DateValue } from "@internationalized/date";
import { DateField } from "bits-ui";
import { button } from "../button/variants";
import Calendar from "../calendar/calendar.svelte";
import type { CalendarCaptionLayout } from "../calendar/variants";
import { dateField } from "../date-field/variants";
import FieldError from "../field/field-error.svelte";
import { cn } from "../lib/cn";
import Popover from "../popover/popover.svelte";
import PopoverContent from "../popover/popover-content.svelte";
import PopoverTrigger from "../popover/popover-trigger.svelte";
import { DATE_PICKER_LABELS, type DatePickerLabels } from "./core";
import type { DatePickerSize } from "./variants";

let {
	value = $bindable(),
	onValueChange,
	locale,
	min,
	max,
	isDateDisabled,
	disabled = false,
	invalid = false,
	open = $bindable(false),
	onOpenChange,
	captionLayout = "dropdown",
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
	/** BCP 47 locale; sets the segment order and the calendar. */
	locale?: string;
	min?: DateValue;
	max?: DateValue;
	/** Extra rule for unavailable days, e.g. weekends. */
	isDateDisabled?: (date: DateValue) => boolean;
	disabled?: boolean;
	/** Marks the field invalid from outside, e.g. a form error. */
	invalid?: boolean;
	/** Bindable. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	captionLayout?: CalendarCaptionLayout;
	size?: DatePickerSize;
	labels?: Partial<DatePickerLabels>;
	id?: string;
	/** Submits the date as ISO `yyyy-mm-dd`. */
	name?: string;
	"aria-label"?: string;
	"aria-describedby"?: string;
	class?: string;
} = $props();

const labels = $derived({ ...DATE_PICKER_LABELS, ...labelsProp });
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

function setOpen(next: boolean) {
	open = next;
	onOpenChange?.(next);
}
</script>

<div data-slot="date-picker" class={cn(s.root(), classProp)}>
	<DateField.Root
		bind:value={() => value, set}
		minValue={min}
		maxValue={max}
		{locale}
		{disabled}
		granularity="day"
		validate={invalid ? () => labels.group : undefined}
	>
		<div
			data-slot="date-picker-group"
			data-disabled={disabled || undefined}
			aria-invalid={invalid || outside || undefined}
			class={s.group()}
		>
			<DateField.Input
				{id}
				{name}
				aria-label={ariaLabel ?? labels.group}
				aria-describedby={[describedBy, outside ? errorId : undefined].filter(Boolean).join(" ") ||
					undefined}
				class={s.input()}
				onkeydown={(e: KeyboardEvent) => {
					if (e.key === "ArrowDown" && e.altKey) {
						e.preventDefault();
						setOpen(true);
					}
				}}
			>
				{#snippet children({ segments })}
					{#each segments as { part, value: text }, i (i)}
						<DateField.Segment {part} class={s.segment()}>{text}</DateField.Segment>
					{/each}
				{/snippet}
			</DateField.Input>
			<Popover bind:open={() => open, setOpen}>
				<PopoverTrigger
					{disabled}
					aria-label={labels.choose}
					class={cn(button({ variant: "ghost", size: "icon-xs" }), s.trigger())}
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 3v4M8 3v4M4 11h16" />
					</svg>
				</PopoverTrigger>
				<PopoverContent align="end" class={s.content()}>
					<Calendar
						type="single"
						{value}
						onValueChange={(next: DateValue | undefined) => {
							set(next);
							setOpen(false);
						}}
						minValue={min}
						maxValue={max}
						{isDateDisabled}
						{captionLayout}
						{locale}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	</DateField.Root>
	<FieldError id={errorId} errors={outside ? [{ message: labels.outOfRange }] : undefined} />
</div>
