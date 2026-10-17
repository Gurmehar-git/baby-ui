"use client";

import { useId, useMemo } from "react";
import { FieldError } from "../../field/react/field";
import { cn } from "../../lib/cn";
import {
	DATE_FIELD_LABELS,
	type DateFieldLabels,
	type DateParts,
	type Draft,
	dateToDraft,
	draftToDate,
	fieldLayout,
	fromDateParts,
	isOutsideRange,
	isoDate,
	toDateParts,
} from "../core";
import { type DateFieldSize, dateField } from "../variants";
import { DateSegments, useFieldDraft } from "./segments";

export type { DateFieldLabels, DateFieldSize };

export interface DateFieldProps {
	/** Controlled date; `null` while empty or half typed. */
	value: Date | null;
	onValueChange: (value: Date | null) => void;
	/** BCP 47 locale; sets the segment order and separators. */
	locale?: string;
	min?: Date;
	max?: Date;
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
	className?: string;
}

function CalendarIcon() {
	return (
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
	);
}

/** Segmented month, day and year in the locale's order, typed or stepped with the arrow keys. */
export function DateField({
	value,
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
	className,
}: DateFieldProps) {
	const labels = { ...DATE_FIELD_LABELS, ...labelsProp };
	const s = dateField({ size });
	const errorId = `${useId()}-error`;
	const layout = useMemo(() => fieldLayout("date", locale), [locale]);
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

	return (
		<div data-slot="date-field" className={cn(s.root(), className)}>
			<fieldset
				id={id}
				aria-label={ariaLabel ?? labels.group}
				aria-describedby={
					[describedBy, outside ? errorId : undefined].filter(Boolean).join(" ") ||
					undefined
				}
				aria-disabled={disabled || undefined}
				aria-invalid={invalid || outside || undefined}
				data-slot="date-field-group"
				className={s.group()}
			>
				<span className={s.icon()}>
					<CalendarIcon />
				</span>
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
