"use client";

import {
	Button,
	Calendar,
	type DateRange,
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
	RangeCalendar,
} from "@baby-ui/react";
import { type ComponentProps, useEffect, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

// The code a real backend would have emailed; demo only.
const SAMPLE_CODE = "418206";

export function InputOTPDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof InputOTP>>(props);
	const [value, setValue] = useState("");
	const [status, setStatus] = useState<"idle" | "verified" | "wrong">("idle");
	const size = p.size ?? "default";

	useEffect(() => {
		if (value.length < 6) return setStatus("idle");
		setStatus(value === SAMPLE_CODE ? "verified" : "wrong");
	}, [value]);

	return (
		<div className="flex flex-col items-center gap-3">
			<p className="text-muted-foreground text-sm">
				Enter the code we emailed you. Try{" "}
				<span className="font-mono">{SAMPLE_CODE}</span>.
			</p>
			<InputOTP
				maxLength={6}
				value={value}
				onChange={setValue}
				size={size}
				aria-label="Verification code"
				invalid={status === "wrong"}
				invalidMotion={p.invalidMotion ?? "shake"}
			>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
					<InputOTPSlot index={1} />
					<InputOTPSlot index={2} />
				</InputOTPGroup>
				<InputOTPSeparator />
				<InputOTPGroup>
					<InputOTPSlot index={3} />
					<InputOTPSlot index={4} />
					<InputOTPSlot index={5} />
				</InputOTPGroup>
			</InputOTP>
			<p className="h-5 text-sm" aria-live="polite">
				{status === "verified"
					? "Verified. Signing you in."
					: status === "wrong"
						? "That code doesn't match. Check the email and try again."
						: ""}
			</p>
			<Button size="sm" variant="ghost" onClick={() => setValue("")}>
				Clear
			</Button>
		</div>
	);
}

export function CalendarDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Calendar>>(props);
	const [date, setDate] = useState<Date | undefined>(() => new Date());

	return (
		<Calendar
			mode="single"
			selected={date}
			onSelect={setDate}
			captionLayout={p.captionLayout ?? "dropdown"}
			size={p.size ?? "default"}
			className="rounded-lg border border-border"
		/>
	);
}

export function RangeCalendarDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof RangeCalendar>>(props);
	const [range, setRange] = useState<DateRange | undefined>(() => {
		const from = new Date();
		return { from, to: new Date(from.getTime() + 5 * 86_400_000) };
	});

	// Two months side by side on wide screens, one on a phone.
	const [months, setMonths] = useState(2);
	useEffect(() => {
		const query = matchMedia("(min-width: 768px)");
		const sync = () => setMonths(query.matches ? 2 : 1);
		sync();
		query.addEventListener("change", sync);
		return () => query.removeEventListener("change", sync);
	}, []);

	return (
		<RangeCalendar
			selected={range}
			onSelect={setRange}
			numberOfMonths={months}
			size={p.size ?? "default"}
			className="rounded-lg border border-border"
		/>
	);
}
