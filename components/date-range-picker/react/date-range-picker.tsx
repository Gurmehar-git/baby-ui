"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { DateRange, Matcher } from "react-day-picker";
import { Button } from "../../button/react/button";
import { button } from "../../button/react/variants";
import {
	compareDateParts,
	type Draft,
	dateToDraft,
	draftToDate,
	fieldLayout,
	fromDateParts,
	isOutsideRange,
	toDateParts,
} from "../../date-field/react/core";
import { DateSegments, useFieldDraft } from "../../date-field/react/segments";
import { dateField } from "../../date-field/react/variants";
import { FieldError } from "../../field/react/field";
import { cn } from "../../lib/react/cn";
import { type PillBox, pillStyle, pressedBox } from "../../lib/react/pill";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover/react/popover";
import { RangeCalendar } from "../../range-calendar/react/range-calendar";
import {
	DATE_RANGE_PICKER_LABELS,
	type DateRangeParts,
	type DateRangePickerLabels,
	type DateRangePreset,
	DEFAULT_RANGE_PRESETS,
	sameRange,
	todayParts,
} from "./core";
import { type DateRangePickerSize, dateRangePicker } from "./variants";

export type { DateRange, DateRangePickerLabels, DateRangePickerSize, DateRangePreset };

export interface DateRangePickerProps {
	/** Controlled range; `to` may be missing while the second day is being picked. */
	value: DateRange | undefined;
	onValueChange: (value: DateRange | undefined) => void;
	/** BCP 47 locale; sets the segment order and the calendar. */
	locale?: string;
	presets?: DateRangePreset[];
	/** Hold the pick in a draft until Apply, instead of committing each click. */
	confirm?: boolean;
	min?: Date;
	max?: Date;
	disabledDates?: Matcher | Matcher[];
	disabled?: boolean;
	/** Marks the field invalid from outside, e.g. a form error. */
	invalid?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	size?: DateRangePickerSize;
	labels?: Partial<DateRangePickerLabels>;
	id?: string;
	"aria-label"?: string;
	"aria-describedby"?: string;
	className?: string;
}

type RangeDraft = { start: Draft; end: Draft };

const rangeParts = (r: DateRange | undefined): DateRangeParts | null =>
	r?.from && r.to ? { from: toDateParts(r.from), to: toDateParts(r.to) } : null;
const rangeKey = (r: DateRange) => `${r.from?.getTime() ?? ""}|${r.to?.getTime() ?? ""}`;

function useWideScreen() {
	const [wide, setWide] = useState(false);
	useEffect(() => {
		const query = matchMedia("(min-width: 640px)");
		const sync = () => setWide(query.matches);
		sync();
		query.addEventListener("change", sync);
		return () => query.removeEventListener("change", sync);
	}, []);
	return wide;
}

/** The preset rail: one pressed preset at most, marked by a fill that slides between them. */
export function DateRangePickerPresets({
	presets,
	label,
	selected,
	onPick,
}: {
	presets: DateRangePreset[];
	label: string;
	selected: DateRangeParts | null;
	onPick: (range: DateRangeParts) => void;
}) {
	const s = dateRangePicker();
	const rail = useRef<HTMLFieldSetElement>(null);
	const today = todayParts();
	const [box, setBox] = useState<PillBox | null>(null);
	const [ready, setReady] = useState(false);
	const pressedKey = presets.find((p) => sameRange(selected, p.range(today)))?.label;

	// biome-ignore lint/correctness/useExhaustiveDependencies: pressedKey, presets is a content key, so equal data does not re-run.
	useLayoutEffect(() => {
		setBox(pressedBox(rail.current));
	}, [pressedKey, presets]);

	// Placed before it may slide, so the first paint never sweeps in from the corner.
	useEffect(() => {
		if (!box || ready) return;
		const frame = requestAnimationFrame(() => setReady(true));
		return () => cancelAnimationFrame(frame);
	}, [box, ready]);

	return (
		<fieldset ref={rail} aria-label={label} className={s.rail()}>
			<span
				aria-hidden
				data-ready={ready ? "" : undefined}
				className={s.pill()}
				style={pillStyle(box)}
			/>
			{presets.map((preset) => (
				<button
					key={preset.label}
					type="button"
					aria-pressed={preset.label === pressedKey}
					onClick={() => onPick(preset.range(today))}
					className={s.preset()}
				>
					{preset.label}
				</button>
			))}
		</fieldset>
	);
}

/** Segmented start and end dates, with a two-month calendar (one on phones) and presets. */
export function DateRangePicker({
	value,
	onValueChange,
	locale,
	presets = DEFAULT_RANGE_PRESETS,
	confirm = false,
	min,
	max,
	disabledDates,
	disabled = false,
	invalid = false,
	open: openProp,
	onOpenChange,
	size = "default",
	labels: labelsProp,
	id,
	"aria-label": ariaLabel,
	"aria-describedby": describedBy,
	className,
}: DateRangePickerProps) {
	const labels = { ...DATE_RANGE_PICKER_LABELS, ...labelsProp };
	const field = dateField({ size });
	const s = dateRangePicker();
	const wide = useWideScreen();
	const errorId = `${useId()}-error`;
	const layout = useMemo(() => fieldLayout("date", locale), [locale]);

	const [internalOpen, setInternalOpen] = useState(false);
	const open = openProp ?? internalOpen;
	const [pending, setPending] = useState<DateRange | undefined>(value);
	const [month, setMonth] = useState<Date | undefined>(value?.from ?? min);
	const setOpen = (next: boolean) => {
		if (next) {
			setPending(value);
			setMonth(value?.from ?? min);
		}
		if (openProp === undefined) setInternalOpen(next);
		onOpenChange?.(next);
	};

	const shown = confirm ? pending : value;
	const pick = (next: DateRange | undefined) =>
		confirm ? setPending(next) : onValueChange(next);

	const [draft, setDraft] = useFieldDraft<DateRange, RangeDraft>(
		value?.from || value?.to ? value : null,
		rangeKey,
		(range) => ({
			start: dateToDraft(range?.from ? toDateParts(range.from) : null),
			end: dateToDraft(range?.to ? toDateParts(range.to) : null),
		}),
		({ start, end }) => {
			const from = draftToDate(start);
			const to = draftToDate(end);
			if (!from && !to) return null;
			return {
				from: from ? fromDateParts(from) : undefined,
				to: to ? fromDateParts(to) : undefined,
			};
		},
		(range) => onValueChange(range ?? undefined),
	);

	const committed = rangeParts(value);
	const minParts = min && toDateParts(min);
	const maxParts = max && toDateParts(max);
	const reversed =
		committed !== null && compareDateParts(committed.from, committed.to) > 0;
	const outside =
		committed !== null &&
		(isOutsideRange(committed.from, minParts, maxParts) ||
			isOutsideRange(committed.to, minParts, maxParts));
	const error = reversed ? labels.reversed : outside ? labels.outOfRange : null;

	const matchers: Matcher[] = [
		...(min ? [{ before: min }] : []),
		...(max ? [{ after: max }] : []),
		...(disabledDates ? ([] as Matcher[]).concat(disabledDates) : []),
	];
	const segments = (end: boolean) => (
		<DateSegments
			layout={layout}
			draft={end ? draft.end : draft.start}
			onDraftChange={(next) =>
				setDraft(end ? { ...draft, end: next } : { ...draft, start: next })
			}
			labels={{
				year: `${end ? labels.end : labels.start}, ${labels.year}`,
				month: `${end ? labels.end : labels.start}, ${labels.month}`,
				day: `${end ? labels.end : labels.start}, ${labels.day}`,
				hour: "",
				minute: "",
				dayPeriod: "",
			}}
			placeholders={{ ...labels.placeholders, hour: "", minute: "", dayPeriod: "" }}
			locale={locale}
			disabled={disabled}
			invalid={invalid || error !== null}
			className={field.input()}
			segmentClassName={field.segment()}
		/>
	);

	return (
		<div data-slot="date-range-picker" className={cn(field.root(), className)}>
			<fieldset
				id={id}
				aria-label={ariaLabel ?? labels.group}
				aria-describedby={
					[describedBy, error ? errorId : undefined].filter(Boolean).join(" ") ||
					undefined
				}
				aria-disabled={disabled || undefined}
				aria-invalid={invalid || error !== null || undefined}
				data-slot="date-range-picker-group"
				className={field.group()}
				onKeyDown={(e) => {
					if (e.key === "ArrowDown" && e.altKey) {
						e.preventDefault();
						setOpen(true);
					}
				}}
			>
				{segments(false)}
				<span aria-hidden="true" className={field.separator()}>
					–
				</span>
				{segments(true)}
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger
						disabled={disabled}
						aria-label={labels.choose}
						className={cn(button({ variant: "ghost", size: "icon-xs" }), field.trigger())}
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
						{presets.length ? (
							<DateRangePickerPresets
								presets={presets}
								label={labels.presets}
								selected={rangeParts(shown)}
								onPick={(range) => {
									pick({ from: fromDateParts(range.from), to: fromDateParts(range.to) });
									// Show where the range starts, so a preset never lands off screen.
									setMonth(fromDateParts(range.from));
								}}
							/>
						) : null}
						<div className={s.main()}>
							<RangeCalendar
								selected={shown}
								onSelect={pick}
								numberOfMonths={wide ? 2 : 1}
								month={month}
								onMonthChange={setMonth}
								disabled={matchers}
								startMonth={min}
								endMonth={max}
								autoFocus
							/>
							{confirm ? (
								<div className={s.footer()}>
									<Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
										{labels.cancel}
									</Button>
									<Button
										size="sm"
										onClick={() => {
											onValueChange(pending);
											setOpen(false);
										}}
									>
										{labels.apply}
									</Button>
								</div>
							) : null}
						</div>
					</PopoverContent>
				</Popover>
			</fieldset>
			<FieldError id={errorId} errors={error ? [{ message: error }] : undefined} />
		</div>
	);
}
