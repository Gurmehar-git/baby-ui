"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/react/cn";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import {
	type CountdownUnit,
	countdownParts,
	createCountdownClock,
	sortUnits,
	spokenCountdown,
	toEpoch,
	UNIT_NAMES,
} from "./clock";
import { type CountdownVariant, countdown } from "./variants";

export type { CountdownUnit, CountdownVariant };

export interface CountdownProps {
	/** Epoch ms, a Date, or an ISO string; a string without an offset is wall time in `timeZone`, or UTC. */
	target: Date | number | string;
	/** IANA zone for a target string without an offset, such as "America/Los_Angeles". */
	timeZone?: string;
	/** Units to show; the largest absorbs the rest, so hours pass 24 when days are left out. */
	units?: CountdownUnit[];
	/** Shown once the target passes; the digits cross-fade into it. */
	completeLabel?: ReactNode;
	/** Fires once when the countdown reaches zero while mounted, even in a hidden tab. */
	onComplete?: () => void;
	/** Accessible name, such as "Keynote starts in". */
	label?: string;
	/** Clock source in epoch ms; pass a server-synced clock when device time cannot be trusted. */
	clock?: () => number;
	variant?: CountdownVariant;
	className?: string;
}

const systemClock = () => Date.now();

/** Counts down to a fixed moment: digits roll on each second and give way to a live label at zero. */
export function Countdown({
	target,
	timeZone,
	units = ["days", "hours", "minutes", "seconds"],
	completeLabel = "Live now",
	onComplete,
	label = "Time remaining",
	clock = systemClock,
	variant = "default",
	className,
}: CountdownProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const end = toEpoch(target, timeZone);
	const valid = Number.isFinite(end);
	const shown = sortUnits(units);
	const [now, setNow] = useState<number | null>(null);
	const clockRef = useRef(clock);
	clockRef.current = clock;
	const onCompleteRef = useRef(onComplete);
	onCompleteRef.current = onComplete;
	const armed = useRef<number | null>(null);

	useEffect(() => {
		const root = rootRef.current;
		if (!root || !valid) return;
		return createCountdownClock(root, end, () => clockRef.current(), setNow);
	}, [end, valid]);

	const left = now === null || !valid ? null : Math.max(0, end - now);
	useEffect(() => {
		if (left === null) return;
		if (left > 0) {
			armed.current = end;
			return;
		}
		if (armed.current === end) {
			armed.current = null;
			onCompleteRef.current?.();
		}
	}, [end, left]);

	const complete = left === 0;
	const seconds = left === null ? 0 : Math.ceil(left / 1000);
	const parts = countdownParts(seconds, shown);
	const compact = variant !== "default";
	const s = countdown({ variant });
	const spoken = complete
		? typeof completeLabel === "string"
			? completeLabel
			: "Complete"
		: left === null
			? ""
			: spokenCountdown(parts, seconds);

	return (
		<div
			ref={rootRef}
			role="timer"
			aria-label={label}
			data-slot="countdown"
			data-complete={complete || undefined}
			data-pending={left === null || undefined}
			className={cn(s.root(), className)}
		>
			<div aria-hidden className={s.shell()}>
				<span data-on={!complete} className={s.units()}>
					{parts.map((part, index) => (
						<span key={part.unit} className={s.unit()}>
							{!compact && index > 0 && <span className={s.colon()}>:</span>}
							<span className={s.group()}>
								<RollingDigits
									value={part.value}
									pad={2}
									direction="down"
									startOnView={false}
									className={s.number()}
								/>
								<span className={s.name()}>{UNIT_NAMES[part.unit][compact ? 1 : 0]}</span>
							</span>
						</span>
					))}
				</span>
				<span data-on={complete} className={s.done()}>
					<span className={s.pulse()}>
						<span className={s.ping()} />
					</span>
					{completeLabel}
				</span>
			</div>
			<span className="sr-only">{spoken}</span>
		</div>
	);
}
