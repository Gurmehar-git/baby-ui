"use client";

import { useId, useMemo, useState } from "react";
import {
	type Draft,
	draftToTime,
	fieldLayout,
	localeHourCycle,
	timeToDraft,
} from "../../date-field/react/core";
import { DateSegments, useFieldDraft } from "../../date-field/react/segments";
import { dateField } from "../../date-field/react/variants";
import { FieldError } from "../../field/react/field";
import { cn } from "../../lib/react/cn";
import {
	clockHands,
	formatTime,
	nearestTurn,
	nowAsTimeValue,
	parseTime,
	TIME_PICKER_LABELS,
	type TimePickerLabels,
	type TimeValue,
	timeOutOfRange,
} from "./core";
import { type TimePickerSize, timePicker } from "./variants";

export type { TimePickerLabels, TimePickerSize, TimeValue };

export interface TimePickerProps {
	/** 24-hour "HH:mm", or `null` while empty or half typed. */
	value: TimeValue | null;
	onValueChange: (value: TimeValue | null) => void;
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
	className?: string;
}

function TimePickerClock({
	value,
	handClassName,
}: {
	value: TimeValue | null;
	handClassName: string;
}) {
	const target = clockHands(value);
	const [angles, setAngles] = useState(target);
	const next = {
		hour: nearestTurn(angles.hour, target.hour),
		minute: nearestTurn(angles.minute, target.minute),
	};
	if (next.hour !== angles.hour || next.minute !== angles.minute) setAngles(next);

	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="9" />
			<path
				d="M12 12V8.5"
				className={handClassName}
				style={{ rotate: `${next.hour}deg` }}
			/>
			<path
				d="M12 12V7"
				className={handClassName}
				style={{ rotate: `${next.minute}deg` }}
			/>
		</svg>
	);
}

/** Segmented hour and minute (plus AM/PM on a 12-hour clock), typed or stepped with the arrows. */
export function TimePicker({
	value,
	onValueChange,
	hourCycle: hourCycleProp,
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
	className,
}: TimePickerProps) {
	const labels = { ...TIME_PICKER_LABELS, ...labelsProp };
	const hourCycle = hourCycleProp ?? localeHourCycle(locale);
	const s = dateField({ size });
	const tp = timePicker();
	const errorId = `${useId()}-error`;
	const layout = useMemo(
		() => fieldLayout("time", locale, hourCycle),
		[locale, hourCycle],
	);
	const [draft, setDraft] = useFieldDraft<TimeValue, Draft>(
		parseTime(value) ? value : null,
		(time) => time,
		(time) => timeToDraft(parseTime(time), hourCycle),
		(next) => {
			const time = draftToTime(next, hourCycle);
			return time ? formatTime(time) : null;
		},
		onValueChange,
	);

	const outside = timeOutOfRange(value, min, max);
	const showClear = clearable && value !== null;
	const showNowButton = showNow;
	const showTrailing = showClear || showNowButton;

	const clear = () => onValueChange(null);
	const setNow = () => onValueChange(nowAsTimeValue());

	return (
		<div data-slot="time-picker" className={cn(s.root(), className)}>
			<fieldset
				id={id}
				aria-label={ariaLabel ?? labels.group}
				aria-describedby={
					[describedBy, outside ? errorId : undefined].filter(Boolean).join(" ") ||
					undefined
				}
				aria-disabled={disabled || undefined}
				aria-invalid={invalid || outside || undefined}
				data-slot="time-picker-group"
				className={cn(s.group(), "w-fit")}
			>
				<span className={s.icon()}>
					<TimePickerClock value={value} handClassName={tp.hand()} />
				</span>
				<DateSegments
					layout={layout}
					draft={draft}
					onDraftChange={setDraft}
					labels={{
						year: "",
						month: "",
						day: "",
						hour: labels.hour,
						minute: labels.minute,
						dayPeriod: labels.period,
					}}
					placeholders={{
						year: "",
						month: "",
						day: "",
						hour: labels.empty,
						minute: labels.empty,
						dayPeriod: "",
					}}
					hourCycle={hourCycle}
					step={step}
					locale={locale}
					disabled={disabled}
					invalid={invalid || outside}
					className={s.input()}
					segmentClassName={s.segment()}
				/>
				{showTrailing ? (
					<div data-slot="time-picker-trailing" className={tp.trailing()}>
						{showNowButton ? (
							<button
								type="button"
								aria-label={labels.now}
								disabled={disabled}
								onClick={setNow}
								className={tp.nowButton()}
							>
								{labels.now}
							</button>
						) : null}
						{showClear ? (
							<button
								type="button"
								aria-label={labels.clear}
								disabled={disabled}
								onClick={clear}
								className={tp.clearButton()}
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={1.75}
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
									className="size-3.5"
								>
									<path d="M18 6 6 18M6 6l12 12" />
								</svg>
							</button>
						) : null}
					</div>
				) : null}
			</fieldset>
			{name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
			<FieldError
				id={errorId}
				errors={outside ? [{ message: labels.outOfRange }] : undefined}
			/>
		</div>
	);
}
