<script lang="ts">
import { CalendarDate, type DateValue } from "@internationalized/date";
import { type DateRange, DateRangeField } from "bits-ui";
import Button from "../../button/svelte/button.svelte";
import { button } from "../../button/svelte/variants";
import { dateField } from "../../date-field/svelte/variants";
import FieldError from "../../field/svelte/field-error.svelte";
import { cn } from "../../lib/svelte/cn";
import Popover from "../../popover/svelte/popover.svelte";
import PopoverContent from "../../popover/svelte/popover-content.svelte";
import PopoverTrigger from "../../popover/svelte/popover-trigger.svelte";
import RangeCalendar from "../../range-calendar/svelte/range-calendar.svelte";
import {
	DATE_RANGE_PICKER_LABELS,
	type DateRangeParts,
	type DateRangePickerLabels,
	type DateRangePreset,
	DEFAULT_RANGE_PRESETS,
	type RangeDateParts,
} from "./core";
import DateRangePickerPresets from "./date-range-picker-presets.svelte";
import { type DateRangePickerSize, dateRangePicker } from "./variants";

let {
	value = $bindable(),
	onValueChange,
	locale,
	presets = DEFAULT_RANGE_PRESETS,
	confirm = false,
	min,
	max,
	isDateDisabled,
	disabled = false,
	invalid = false,
	open = $bindable(false),
	onOpenChange,
	size = "default",
	labels: labelsProp,
	id,
	"aria-label": ariaLabel,
	"aria-describedby": describedBy,
	class: classProp,
}: {
	/** Bindable; `end` is missing while the second day is being picked. */
	value?: DateRange;
	onValueChange?: (value: DateRange | undefined) => void;
	/** BCP 47 locale; sets the segment order and the calendar. */
	locale?: string;
	presets?: DateRangePreset[];
	/** Hold the pick in a draft until Apply, instead of committing each click. */
	confirm?: boolean;
	min?: DateValue;
	max?: DateValue;
	isDateDisabled?: (date: DateValue) => boolean;
	disabled?: boolean;
	/** Marks the field invalid from outside, e.g. a form error. */
	invalid?: boolean;
	/** Bindable. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	size?: DateRangePickerSize;
	labels?: Partial<DateRangePickerLabels>;
	id?: string;
	"aria-label"?: string;
	"aria-describedby"?: string;
	class?: string;
} = $props();

const labels = $derived({ ...DATE_RANGE_PICKER_LABELS, ...labelsProp });
const field = $derived(dateField({ size }));
const s = dateRangePicker();
const uid = $props.id();
const errorId = `${uid}-error`;

const toParts = (d: DateValue): RangeDateParts => ({
	year: d.year,
	month: d.month,
	day: d.day,
});
const toDate = (p: RangeDateParts) => new CalendarDate(p.year, p.month, p.day);
const rangeParts = (r: DateRange | undefined): DateRangeParts | null =>
	r?.start && r.end ? { from: toParts(r.start), to: toParts(r.end) } : null;

let pending = $state<DateRange | undefined>();
let month = $state<DateValue | undefined>();
let wide = $state(false);

$effect(() => {
	const query = matchMedia("(min-width: 640px)");
	const sync = () => (wide = query.matches);
	sync();
	query.addEventListener("change", sync);
	return () => query.removeEventListener("change", sync);
});

const shown = $derived(confirm ? pending : value);
const outsideOf = (d: DateValue | undefined) =>
	d !== undefined &&
	((min !== undefined && d.compare(min) < 0) ||
		(max !== undefined && d.compare(max) > 0));
const reversed = $derived(
	!!value?.start && !!value.end && value.start.compare(value.end) > 0,
);
const error = $derived(
	reversed
		? labels.reversed
		: outsideOf(value?.start) || outsideOf(value?.end)
			? labels.outOfRange
			: null,
);

function setOpen(next: boolean) {
	if (next) {
		pending = value;
		month = value?.start ?? min;
	}
	open = next;
	onOpenChange?.(next);
}

function commit(next: DateRange | undefined) {
	value = next;
	onValueChange?.(next);
}

function pick(next: DateRange | undefined) {
	if (confirm) pending = next;
	else commit(next);
}
</script>

<div data-slot="date-range-picker" class={cn(field.root(), classProp)}>
	<DateRangeField.Root
		bind:value={() => value ?? { start: undefined, end: undefined }, (next) =>
			commit(next.start || next.end ? next : undefined)}
		minValue={min}
		maxValue={max}
		{locale}
		{disabled}
		granularity="day"
		validate={invalid || reversed ? () => labels.group : undefined}
		{id}
		aria-label={ariaLabel ?? labels.group}
		aria-describedby={[describedBy, error ? errorId : undefined].filter(Boolean).join(" ") ||
			undefined}
		data-slot="date-range-picker-group"
		data-disabled={disabled || undefined}
		aria-invalid={invalid || error !== null || undefined}
		class={field.group()}
		onkeydown={(e: KeyboardEvent) => {
			if (e.key === "ArrowDown" && e.altKey) {
				e.preventDefault();
				setOpen(true);
			}
		}}
	>
		{#each ["start", "end"] as const as type (type)}
			{#if type === "end"}
				<span aria-hidden="true" class={field.separator()}>–</span>
			{/if}
			<DateRangeField.Input
				{type}
				aria-label={type === "start" ? labels.start : labels.end}
				class={field.input()}
			>
				{#snippet children({ segments })}
					{#each segments as { part, value: text }, i (i)}
						<DateRangeField.Segment {part} class={field.segment()}>{text}</DateRangeField.Segment>
					{/each}
				{/snippet}
			</DateRangeField.Input>
		{/each}
		<Popover bind:open={() => open, setOpen}>
			<PopoverTrigger
				{disabled}
				aria-label={labels.choose}
				class={cn(button({ variant: "ghost", size: "icon-xs" }), field.trigger())}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 3v4M8 3v4M4 11h16" />
				</svg>
			</PopoverTrigger>
			<PopoverContent align="end" class={s.content()}>
				{#if presets.length}
					<DateRangePickerPresets
						{presets}
						label={labels.presets}
						selected={rangeParts(shown)}
						onPick={(range) => {
							pick({ start: toDate(range.from), end: toDate(range.to) });
							// Show where the range starts, so a preset never lands off screen.
							month = toDate(range.from);
						}}
					/>
				{/if}
				<div class={s.main()}>
					<RangeCalendar
						value={shown}
						onValueChange={(next: DateRange) => pick(next)}
						bind:placeholder={month}
						numberOfMonths={wide ? 2 : 1}
						minValue={min}
						maxValue={max}
						{isDateDisabled}
						{locale}
					/>
					{#if confirm}
						<div class={s.footer()}>
							<Button variant="ghost" size="sm" onclick={() => setOpen(false)}>{labels.cancel}</Button>
							<Button
								size="sm"
								onclick={() => {
									commit(pending);
									setOpen(false);
								}}>{labels.apply}</Button
							>
						</div>
					{/if}
				</div>
			</PopoverContent>
		</Popover>
	</DateRangeField.Root>
	<FieldError id={errorId} errors={error ? [{ message: error }] : undefined} />
</div>
