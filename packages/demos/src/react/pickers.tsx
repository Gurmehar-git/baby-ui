"use client";

import {
	DateField,
	DatePicker,
	type DateRange,
	DateRangePicker,
	Field,
	FieldDescription,
	FieldLabel,
	TimePicker,
} from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

// A sign-up form: a birthday is known, so it is typed, never picked.
export function DateFieldDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof DateField>>(props);
	const [birthday, setBirthday] = useState<Date | null>(null);
	return (
		<Field className="w-fit">
			<FieldLabel>Date of birth</FieldLabel>
			<DateField
				value={birthday}
				onValueChange={setBirthday}
				max={new Date()}
				locale={p.locale || undefined}
				invalid={p.invalid ?? false}
				size={p.size ?? "default"}
				aria-label="Date of birth"
				aria-describedby="demo-birthday-hint"
			/>
			<FieldDescription id="demo-birthday-hint">
				Type it, or use the arrow keys.
			</FieldDescription>
		</Field>
	);
}

// A booking form: nothing earlier than today can be picked or typed.
export function DatePickerDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof DatePicker>>(props);
	const [checkIn, setCheckIn] = useState<Date | null>(null);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const later = new Date(today);
	later.setMonth(later.getMonth() + 6);

	return (
		<Field className="w-full max-w-64">
			<FieldLabel htmlFor="demo-check-in">Check-in</FieldLabel>
			<DatePicker
				id="demo-check-in"
				value={checkIn}
				onValueChange={setCheckIn}
				min={today}
				max={later}
				locale={p.locale || undefined}
				captionLayout={p.captionLayout ?? "dropdown"}
				invalid={p.invalid ?? false}
				size={p.size ?? "default"}
				aria-describedby="demo-check-in-hint"
			/>
			<FieldDescription id="demo-check-in-hint">
				Type a date or pick one. Up to six months ahead.
			</FieldDescription>
		</Field>
	);
}

// A report filter: empty until the reader picks a range or a preset.
export function DateRangePickerDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof DateRangePicker>>(props);
	const [range, setRange] = useState<DateRange | undefined>();
	return (
		<DateRangePicker
			value={range}
			onValueChange={setRange}
			aria-label="Report period"
			confirm={p.confirm ?? false}
			locale={p.locale || undefined}
			invalid={p.invalid ?? false}
			size={p.size ?? "default"}
		/>
	);
}

export function TimePickerDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof TimePicker>>(props);
	const [time, setTime] = useState<string | null>("09:30");
	const cycle = props.hourCycle === "24" ? 24 : props.hourCycle === "12" ? 12 : undefined;
	return (
		<Field className="w-fit">
			<FieldLabel>Meeting starts</FieldLabel>
			<TimePicker
				value={time}
				onValueChange={setTime}
				aria-label="Meeting starts"
				hourCycle={cycle}
				step={p.step ?? 15}
				min="08:00"
				max="18:00"
				clearable={p.clearable ?? false}
				showNow={p.showNow ?? false}
				invalid={p.invalid ?? false}
				size={p.size ?? "default"}
			/>
			<FieldDescription>
				Type it, or use the arrow keys. Clear and Now sit at the end.
			</FieldDescription>
			<p className="text-muted-foreground text-xs tabular-nums">
				Saved as {time ?? "no time"}
			</p>
		</Field>
	);
}
