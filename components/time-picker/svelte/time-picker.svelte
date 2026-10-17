<script lang="ts">
import { Time } from "@internationalized/date";
import { TimeField } from "bits-ui";
import { stepMinute } from "../../date-field/core";
import { dateField } from "../../date-field/variants";
import FieldError from "../../field/svelte/field-error.svelte";
import { cn } from "../../lib/cn";
import {
	formatTime,
	nowAsTimeValue,
	parseTime,
	TIME_PICKER_LABELS,
	type TimePickerLabels,
	type TimeValue,
	timeOutOfRange,
} from "../core";
import { type TimePickerSize, timePicker } from "../variants";
import TimePickerClock from "./time-picker-clock.svelte";

let {
	value = $bindable(null),
	onValueChange,
	hourCycle,
	step = 1,
	locale,
	min,
	max,
	clearable = false,
	showNow = false,
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
	/** Bindable 24-hour "HH:mm", or `null` while empty or half typed. */
	value?: TimeValue | null;
	onValueChange?: (value: TimeValue | null) => void;
	/** Defaults to the locale's own clock. */
	hourCycle?: 12 | 24;
	/** Minutes moved per arrow press; typed minutes are not snapped. */
	step?: number;
	locale?: string;
	/** Earliest allowed time; a value outside marks the field invalid. */
	min?: TimeValue;
	/** Latest allowed time; a value outside marks the field invalid. */
	max?: TimeValue;
	/** Show an X button at the end while the field has a value. */
	clearable?: boolean;
	/** Show a "Now" quick-set button at the end. */
	showNow?: boolean;
	disabled?: boolean;
	/** Marks the field invalid from outside, e.g. a form error. */
	invalid?: boolean;
	size?: TimePickerSize;
	labels?: Partial<TimePickerLabels>;
	id?: string;
	/** Submits the time as "HH:mm". */
	name?: string;
	"aria-label"?: string;
	"aria-describedby"?: string;
	class?: string;
} = $props();

const labels = $derived({ ...TIME_PICKER_LABELS, ...labelsProp });
const s = $derived(dateField({ size }));
const tp = $derived(timePicker());
const uid = $props.id();
const errorId = `${uid}-error`;
const time = $derived.by(() => {
	const parts = parseTime(value);
	return parts ? new Time(parts.hour, parts.minute) : undefined;
});
const minTime = $derived.by(() => {
	const parts = parseTime(min);
	return parts ? new Time(parts.hour, parts.minute) : undefined;
});
const maxTime = $derived.by(() => {
	const parts = parseTime(max);
	return parts ? new Time(parts.hour, parts.minute) : undefined;
});
const outside = $derived(timeOutOfRange(value, min, max));
const showClear = $derived(clearable && value !== null);
const showNowButton = $derived(showNow);
const showTrailing = $derived(showClear || showNowButton);

function set(next: Time | undefined) {
	const text = next ? formatTime({ hour: next.hour, minute: next.minute }) : null;
	if (text === value) return;
	value = text;
	onValueChange?.(text);
}

function clear() {
	value = null;
	onValueChange?.(null);
}

function setNow() {
	const text = nowAsTimeValue();
	value = text;
	onValueChange?.(text);
}

// bits-ui steps minutes by one; a larger step takes the key before it does.
function onMinuteKey(event: KeyboardEvent) {
	if (step <= 1 || !time || (event.key !== "ArrowUp" && event.key !== "ArrowDown"))
		return;
	event.preventDefault();
	set(
		time.set({ minute: stepMinute(time.minute, event.key === "ArrowUp" ? 1 : -1, step) }),
	);
}
</script>

<TimeField.Root
	bind:value={() => time, set}
	minValue={minTime}
	maxValue={maxTime}
	{hourCycle}
	{locale}
	{disabled}
	granularity="minute"
	validate={invalid ? () => labels.group : undefined}
>
	<div
		data-slot="time-picker"
		class={cn(s.root(), classProp)}
	>
		<div
			data-slot="time-picker-group"
			data-disabled={disabled || undefined}
			aria-invalid={invalid || outside || undefined}
			aria-describedby={[describedBy, outside ? errorId : undefined]
				.filter(Boolean)
				.join(" ") || undefined}
			class={cn(s.group(), "w-fit")}
		>
			<span class={s.icon()}>
				<TimePickerClock {value} />
			</span>
			<TimeField.Input
				{id}
				aria-label={ariaLabel ?? labels.group}
				class={s.input()}
			>
				{#snippet children({ segments })}
					{#each segments as { part, value: text }, i (i)}
						<TimeField.Segment
							{part}
							class={s.segment()}
							onkeydown={part === "minute" ? onMinuteKey : undefined}>{text}</TimeField.Segment
						>
					{/each}
				{/snippet}
			</TimeField.Input>
			{#if showTrailing}
				<div data-slot="time-picker-trailing" class={tp.trailing()}>
					{#if showNowButton}
						<button
							type="button"
							aria-label={labels.now}
							{disabled}
							onclick={setNow}
							class={tp.nowButton()}
						>
							{labels.now}
						</button>
					{/if}
					{#if showClear}
						<button
							type="button"
							aria-label={labels.clear}
							{disabled}
							onclick={clear}
							class={tp.clearButton()}
						>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5">
								<path d="M18 6 6 18M6 6l12 12" />
							</svg>
						</button>
					{/if}
				</div>
			{/if}
			{#if name}
				<input type="hidden" {name} value={value ?? ""} />
			{/if}
		</div>
		<FieldError id={errorId} errors={outside ? [{ message: labels.outOfRange }] : undefined} />
	</div>
</TimeField.Root>