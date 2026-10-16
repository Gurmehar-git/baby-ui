"use client";

import { useState } from "react";
import type { DateRange, PropsBase, PropsRange } from "react-day-picker";
import { Calendar, type CalendarProps } from "../../calendar/react/calendar";

export type { DateRange };

export type RangeCalendarProps = Omit<PropsBase, "mode"> &
	Omit<PropsRange, "mode"> &
	Pick<CalendarProps, "buttonVariant" | "size">;

/** Calendar in range mode, named to match the Svelte port's bits-ui RangeCalendar. */
export function RangeCalendar({
	modifiers,
	onDayMouseEnter,
	onDayFocus,
	...props
}: RangeCalendarProps) {
	const [hovered, setHovered] = useState<Date | null>(null);
	const from = props.selected?.from;
	// With only the start picked, the track follows the pointer or focus to preview the end.
	const preview =
		from && !props.selected?.to && hovered
			? hovered < from
				? { from: hovered, to: from }
				: { from, to: hovered }
			: undefined;
	const rangeProps = {
		...props,
		mode: "range",
		modifiers: { ...modifiers, highlighted: preview ?? false },
		onDayMouseEnter: (day, mods, event) => {
			setHovered(day);
			onDayMouseEnter?.(day, mods, event);
		},
		onDayFocus: (day, mods, event) => {
			setHovered(day);
			onDayFocus?.(day, mods, event);
		},
	} satisfies CalendarProps;
	return <Calendar {...rangeProps} />;
}
