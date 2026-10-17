"use client";

import {
	type CSSProperties,
	type KeyboardEvent,
	type PointerEvent,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import {
	addDays,
	addMonths,
	arrowTarget,
	dayKey,
	monthWeeks,
	sameDay,
	sameMonth,
	startOfDay,
	startOfWeek,
	type WeekStartsOn,
} from "../dates";
import {
	HANDLE_DRAG_PX,
	ROW_STAGGER_MS,
	SWIPE,
	WEEK_CALENDAR_LABELS,
	type WeekCalendarDayTone,
	type WeekCalendarLabels,
	type WeekCalendarVariant,
	weekCalendar,
} from "../variants";

export type { WeekCalendarLabels, WeekCalendarVariant, WeekStartsOn };

export interface WeekCalendarProps {
	/** Controlled selected day; `null` clears it. */
	selected?: Date | null;
	/** Defaults to today. */
	defaultSelected?: Date | null;
	onSelect?: (date: Date) => void;
	/** Controlled: month grid instead of a week strip. */
	expanded?: boolean;
	defaultExpanded?: boolean;
	onExpandedChange?: (expanded: boolean) => void;
	/** Controlled: any day inside the week or month on screen. */
	month?: Date;
	defaultMonth?: Date;
	onMonthChange?: (month: Date) => void;
	weekStartsOn?: WeekStartsOn;
	/** BCP 47 locale for every date label. */
	locale?: string;
	/** Overrides "today", e.g. for tests or another time zone. */
	today?: Date;
	labels?: Partial<WeekCalendarLabels>;
	variant?: WeekCalendarVariant;
	className?: string;
}

type Period = { id: number; key: string; anchor: Date; expanded: boolean };
type Label = { id: number; text: string };

export function WeekCalendar({
	selected: selectedProp,
	defaultSelected,
	onSelect,
	expanded: expandedProp,
	defaultExpanded = false,
	onExpandedChange,
	month: monthProp,
	defaultMonth,
	onMonthChange,
	weekStartsOn = 0,
	locale = "en-US",
	today: todayProp,
	labels: labelsProp,
	variant = "card",
	className,
}: WeekCalendarProps) {
	const labels = { ...WEEK_CALENDAR_LABELS, ...labelsProp };
	const today = useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp]);
	const [selectedState, setSelectedState] = useState<Date | null>(
		defaultSelected !== undefined ? defaultSelected : today,
	);
	const selected = selectedProp !== undefined ? selectedProp : selectedState;
	const [expandedState, setExpandedState] = useState(defaultExpanded);
	const expanded = expandedProp ?? expandedState;
	const [anchorState, setAnchorState] = useState(() =>
		startOfDay(defaultMonth ?? selected ?? today),
	);
	const anchor = monthProp ? startOfDay(monthProp) : anchorState;
	const styles = weekCalendar({ variant });

	const format = useMemo(
		() => ({
			weekday: new Intl.DateTimeFormat(locale, { weekday: "narrow" }),
			month: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
			range: new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }),
			full: new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
			day: new Intl.DateTimeFormat(locale, { day: "numeric" }),
		}),
		[locale],
	);

	const weekStart = startOfWeek(anchor, weekStartsOn);
	const periodKey = expanded
		? `m${anchor.getFullYear()}-${anchor.getMonth()}`
		: `w${dayKey(weekStart)}`;
	const [period, setPeriod] = useState<Period>({
		id: 0,
		key: periodKey,
		anchor,
		expanded,
	});
	const [leaving, setLeaving] = useState<Period[]>([]);
	if (
		period.key !== periodKey ||
		!sameDay(period.anchor, anchor) ||
		period.expanded !== expanded
	) {
		// A toggle morphs the rows in place; moving to another week or month dissolves.
		if (period.expanded === expanded && period.key !== periodKey) {
			setLeaving((current) => [...current, period]);
			setPeriod({ id: period.id + 1, key: periodKey, anchor, expanded });
		} else {
			setPeriod({ ...period, key: periodKey, anchor, expanded });
		}
	}

	const title = expanded
		? format.month.format(anchor)
		: format.range.formatRange(weekStart, addDays(weekStart, 6));
	const [label, setLabel] = useState<Label>({ id: 0, text: title });
	const [leavingLabels, setLeavingLabels] = useState<Label[]>([]);
	if (label.text !== title) {
		setLeavingLabels((current) => [...current, label]);
		setLabel({ id: label.id + 1, text: title });
	}

	const [focusDay, setFocusDay] = useState<Date>(() => selected ?? anchor);
	const pendingFocus = useRef(false);
	const rootRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!pendingFocus.current) return;
		pendingFocus.current = false;
		rootRef.current
			?.querySelector<HTMLButtonElement>(
				`[data-period="${period.id}"] [data-day="${dayKey(focusDay)}"]`,
			)
			?.focus();
	});

	const setAnchor = (next: Date) => {
		const day = startOfDay(next);
		if (!monthProp) setAnchorState(day);
		onMonthChange?.(day);
	};
	const setExpanded = (next: boolean) => {
		if (expandedProp === undefined) setExpandedState(next);
		onExpandedChange?.(next);
	};
	const visible = (date: Date) =>
		expanded
			? sameMonth(date, anchor)
			: sameDay(startOfWeek(date, weekStartsOn), weekStart);
	const step = (direction: 1 | -1) =>
		setAnchor(expanded ? addMonths(anchor, direction) : addDays(anchor, direction * 7));
	const select = (date: Date) => {
		const day = startOfDay(date);
		if (selectedProp === undefined) setSelectedState(day);
		onSelect?.(day);
		setFocusDay(day);
		if (!visible(day) || expanded) setAnchor(day);
	};
	const onDayKey = (event: KeyboardEvent, date: Date) => {
		const target = arrowTarget(date, event.key);
		if (!target) return;
		event.preventDefault();
		pendingFocus.current = true;
		setFocusDay(target);
		if (!visible(target)) setAnchor(target);
	};

	const [dragX, setDragX] = useState(0);
	const drag = useRef<{
		x: number;
		lastX: number;
		lastT: number;
		vx: number;
		moved: boolean;
	} | null>(null);
	const suppressClick = useRef(false);
	const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
		if (expanded || (event.pointerType === "mouse" && event.button !== 0)) return;
		const now = performance.now();
		drag.current = {
			x: event.clientX,
			lastX: event.clientX,
			lastT: now,
			vx: 0,
			moved: false,
		};
	};
	const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
		const state = drag.current;
		if (!state) return;
		const dx = event.clientX - state.x;
		if (!state.moved && Math.abs(dx) < 4) return;
		if (!state.moved) event.currentTarget.setPointerCapture(event.pointerId);
		state.moved = true;
		const now = performance.now();
		state.vx = ((event.clientX - state.lastX) / Math.max(1, now - state.lastT)) * 1000;
		state.lastX = event.clientX;
		state.lastT = now;
		setDragX(dx * SWIPE.elastic);
	};
	const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
		const state = drag.current;
		drag.current = null;
		if (!state?.moved) return;
		suppressClick.current = true;
		setTimeout(() => {
			suppressClick.current = false;
		}, 0);
		const dx = event.clientX - state.x;
		const velocity = state.vx;
		setDragX(0);
		if (dx <= -SWIPE.distance || velocity <= -SWIPE.velocity) step(1);
		else if (dx >= SWIPE.distance || velocity >= SWIPE.velocity) step(-1);
	};
	const tilt = Math.max(-1, Math.min(1, dragX / SWIPE.tiltRange)) * SWIPE.tiltDeg;

	const handle = useRef<{ y: number; fired: boolean } | null>(null);
	const handleFired = useRef(false);

	const renderBody = (p: Period, exiting: boolean) => {
		const weeks = monthWeeks(p.anchor, weekStartsOn);
		const pStart = startOfWeek(p.anchor, weekStartsOn);
		const anchorRow = Math.max(
			0,
			weeks.findIndex((w) => w[0] && sameDay(w[0], pStart)),
		);
		const focusable = weeks.flat().some((d) => sameDay(d, focusDay))
			? focusDay
			: p.anchor;
		return (
			<div
				key={p.id}
				data-period={p.id}
				aria-hidden={exiting || undefined}
				inert={exiting}
				className={cn(
					styles.body(),
					exiting ? "week-calendar-out" : p.id > 0 && "week-calendar-in",
				)}
				onAnimationEnd={
					exiting
						? (event) => {
								if (event.target === event.currentTarget)
									setLeaving((current) => current.filter((l) => l.id !== p.id));
							}
						: undefined
				}
			>
				{weeks.map((week, i) => {
					const collapsed = !p.expanded && i !== anchorRow;
					const col = selected ? week.findIndex((d) => sameDay(d, selected)) : -1;
					return (
						<div
							key={week[0] ? dayKey(week[0]) : i}
							data-collapsed={collapsed || undefined}
							inert={collapsed}
							className={styles.row()}
							style={
								{
									"--row-delay": `${Math.abs(i - anchorRow) * ROW_STAGGER_MS}ms`,
								} as CSSProperties
							}
						>
							<div className={styles.rowClip()}>
								<div className={styles.cells()}>
									{col >= 0 ? (
										<span
											aria-hidden="true"
											className={styles.pill()}
											style={{ "--col": col } as CSSProperties}
										/>
									) : null}
									{week.map((date) => {
										const isSelected = selected ? sameDay(date, selected) : false;
										const isToday = sameDay(date, today);
										const tone: WeekCalendarDayTone = isSelected
											? "selected"
											: isToday
												? "today"
												: p.expanded && !sameMonth(date, p.anchor)
													? "outside"
													: "default";
										return (
											<button
												key={dayKey(date)}
												type="button"
												data-day={dayKey(date)}
												data-selected={isSelected || undefined}
												aria-pressed={isSelected}
												aria-current={isToday ? "date" : undefined}
												aria-label={format.full.format(date)}
												tabIndex={sameDay(date, focusable) ? 0 : -1}
												className={styles.day()}
												onClick={() => {
													if (suppressClick.current) return;
													select(date);
												}}
												onKeyDown={(event) => onDayKey(event, date)}
											>
												<span className={weekCalendar({ tone }).dayFace()}>
													{format.day.format(date)}
												</span>
											</button>
										);
									})}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	const onPeriod = expanded
		? sameMonth(anchor, today)
		: sameDay(startOfWeek(today, weekStartsOn), weekStart);

	return (
		<div
			ref={rootRef}
			data-slot="week-calendar"
			data-expanded={expanded || undefined}
			className={cn(styles.root(), className)}
		>
			<span aria-live="polite" className={styles.srOnly()}>
				{selected ? labels.selected(format.full.format(selected)) : labels.none}
			</span>
			<div className={styles.header()}>
				<div className={styles.titleGroup()}>
					<div className={styles.titleClip()}>
						{leavingLabels.map((l) => (
							<p
								key={l.id}
								aria-hidden="true"
								className={cn(styles.title(), "week-calendar-label-out")}
								onAnimationEnd={() =>
									setLeavingLabels((current) => current.filter((c) => c.id !== l.id))
								}
							>
								{l.text}
							</p>
						))}
						<p
							key={label.id}
							className={cn(styles.title(), label.id > 0 && "week-calendar-label-in")}
						>
							{label.text}
						</p>
					</div>
					<button
						type="button"
						data-hidden={onPeriod || undefined}
						inert={onPeriod}
						className={styles.today()}
						onClick={() => setAnchor(today)}
					>
						{labels.today}
					</button>
				</div>
				<div className={styles.nav()}>
					<button
						type="button"
						aria-label={expanded ? labels.previousMonth : labels.previousWeek}
						className={styles.navButton()}
						onClick={() => step(-1)}
					>
						<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
							<path
								d="m10 4-4 4 4 4"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
					<button
						type="button"
						aria-label={expanded ? labels.nextMonth : labels.nextWeek}
						className={styles.navButton()}
						onClick={() => step(1)}
					>
						<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
							<path
								d="m6 4 4 4-4 4"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
				</div>
			</div>
			<div aria-hidden="true" className={styles.weekdays()}>
				{Array.from({ length: 7 }, (_, i) => {
					const date = addDays(weekStart, i);
					return (
						<span key={date.getDay()} className={styles.weekday()}>
							{format.weekday.format(date)}
						</span>
					);
				})}
			</div>
			<div
				data-dragging={dragX !== 0 || undefined}
				className={styles.viewport()}
				style={{ translate: `${dragX}px 0`, rotate: `${tilt}deg` }}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerEnd}
				onPointerCancel={onPointerEnd}
			>
				<div className={styles.stage()}>
					{leaving.map((p) => renderBody(p, true))}
					{renderBody(period, false)}
				</div>
			</div>
			<div className={styles.handleBar()}>
				<button
					type="button"
					aria-expanded={expanded}
					aria-label={expanded ? labels.collapse : labels.expand}
					className={styles.handle()}
					onPointerDown={(event) => {
						handle.current = { y: event.clientY, fired: false };
						event.currentTarget.setPointerCapture(event.pointerId);
					}}
					onPointerMove={(event) => {
						const state = handle.current;
						if (!state || state.fired) return;
						const dy = event.clientY - state.y;
						if (
							(dy > HANDLE_DRAG_PX && !expanded) ||
							(dy < -HANDLE_DRAG_PX && expanded)
						) {
							state.fired = true;
							handleFired.current = true;
							setExpanded(!expanded);
						}
					}}
					onPointerUp={() => {
						handle.current = null;
					}}
					onClick={() => {
						if (handleFired.current) {
							handleFired.current = false;
							return;
						}
						setExpanded(!expanded);
					}}
				/>
			</div>
		</div>
	);
}
