"use client";

import { useId, useMemo, useState } from "react";
import type { Matcher } from "react-day-picker";
import { button } from "../button/variants";
import { Calendar, type CalendarProps } from "../calendar/calendar";
import {
	type DateParts,
	type Draft,
	dateToDraft,
	draftToDate,
	fieldLayout,
	fromDateParts,
	isOutsideRange,
	isoDate,
	toDateParts,
} from "../date-field/core";
import { DateSegments, useFieldDraft } from "../date-field/segments";
import { dateField } from "../date-field/variants";
import { FieldError } from "../field/field";
import { cn } from "../lib/cn";
import { Popover, PopoverContent, PopoverTrigger } from "../popover/popover";
import { DATE_PICKER_LABELS, type DatePickerLabels } from "./core";
import type { DatePickerSize } from "./variants";

export type { DatePickerLabels, DatePickerSize };

export interface DatePickerProps {
	/** Controlled date; `null` while empty or half typed. */
	value: Date | null;
	onValueChange: (value: Date | null) => void;
	/** BCP 47 locale; sets the segment order and the calendar. */
	locale?: string;
	min?: Date;
	max?: Date;
	/** Extra react-day-picker matchers, e.g. `{ dayOfWeek: [0, 6] }` for weekends. */
	disabledDates?: Matcher | Matcher[];
	disabled?: boolean;
	/** Marks the field invalid from outside, e.g. a form error. */
	invalid?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	captionLayout?: CalendarProps["captionLayout"];
	size?: DatePickerSize;
	labels?: Partial<DatePickerLabels>;
	id?: string;
	/** Submits the date as ISO `yyyy-mm-dd`. */
	name?: string;
	"aria-label"?: string;
	"aria-describedby"?: string;
	className?: string;
}

/** A segmented date field with a calendar popover on the button at its end. */
export function DatePicker({
	value,
	onValueChange,
	locale,
	min,
	max,
	disabledDates,
	disabled = false,
	invalid = false,
	open: openProp,
	onOpenChange,
	captionLayout = "dropdown",
	size = "default",
	labels: labelsProp,
	id,
	name,
	"aria-label": ariaLabel,
	"aria-describedby": describedBy,
	className,
}: DatePickerProps) {
	const labels = { ...DATE_PICKER_LABELS, ...labelsProp };
	const s = dateField({ size });
	const errorId = `${useId()}-error`;
	const layout = useMemo(() => fieldLayout("date", locale), [locale]);

	const [internalOpen, setInternalOpen] = useState(false);
	const open = openProp ?? internalOpen;
	const setOpen = (next: boolean) => {
		if (openProp === undefined) setInternalOpen(next);
		onOpenChange?.(next);
	};

	const [draft, setDraft] = useFieldDraft<DateParts, Draft>(
		value ? toDateParts(value) : null,
		isoDate,
		dateToDraft,
		draftToDate,
		(parts) => onValueChange(parts ? fromDateParts(parts) : null),
	);
	const parts = value ? toDateParts(value) : null;
	const outside =
		parts !== null &&
		isOutsideRange(parts, min && toDateParts(min), max && toDateParts(max));

	const matchers: Matcher[] = [
		...(min ? [{ before: min }] : []),
		...(max ? [{ after: max }] : []),
		...(disabledDates ? ([] as Matcher[]).concat(disabledDates) : []),
	];

	return (
		<div data-slot="date-picker" className={cn(s.root(), className)}>
			<fieldset
				id={id}
				aria-label={ariaLabel ?? labels.group}
				aria-describedby={
					[describedBy, outside ? errorId : undefined].filter(Boolean).join(" ") ||
					undefined
				}
				aria-disabled={disabled || undefined}
				aria-invalid={invalid || outside || undefined}
				data-slot="date-picker-group"
				className={s.group()}
				onKeyDown={(e) => {
					if (e.key === "ArrowDown" && e.altKey) {
						e.preventDefault();
						setOpen(true);
					}
				}}
			>
				<DateSegments
					layout={layout}
					draft={draft}
					onDraftChange={setDraft}
					labels={{ ...labels, hour: "", minute: "", dayPeriod: "" }}
					placeholders={{ ...labels.placeholders, hour: "", minute: "", dayPeriod: "" }}
					locale={locale}
					disabled={disabled}
					invalid={invalid || outside}
					className={s.input()}
					segmentClassName={s.segment()}
				/>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger
						disabled={disabled}
						aria-label={labels.choose}
						className={cn(button({ variant: "ghost", size: "icon-xs" }), s.trigger())}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 3v4M8 3v4M4 11h16" />
						</svg>
					</PopoverTrigger>
					<PopoverContent align="end" className={s.content()}>
						<Calendar
							mode="single"
							selected={value ?? undefined}
							defaultMonth={value ?? min ?? undefined}
							onSelect={(date) => {
								onValueChange(date ?? null);
								setOpen(false);
							}}
							disabled={matchers}
							startMonth={min}
							endMonth={max}
							captionLayout={captionLayout}
							autoFocus
						/>
					</PopoverContent>
				</Popover>
			</fieldset>
			{name ? (
				<input type="hidden" name={name} value={parts ? isoDate(parts) : ""} />
			) : null}
			<FieldError
				id={errorId}
				errors={outside ? [{ message: labels.outOfRange }] : undefined}
			/>
		</div>
	);
}
