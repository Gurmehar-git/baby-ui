"use client";

import {
	type ComponentProps,
	createContext,
	type KeyboardEvent,
	type RefObject,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	type DayButton,
	DayPicker,
	getDefaultClassNames,
	type Locale,
	type MonthCaptionProps,
	type NavProps,
} from "react-day-picker";
import { type ButtonVariant, button } from "../../button/variants";
import { cn } from "../../lib/cn";
import {
	type CalendarMotion,
	type CalendarView,
	CHOICE_STEP,
	choiceDelay,
	YEAR_PAGE,
	yearPage,
	yearPageStart,
} from "../chooser";
import { type CalendarSize, calendar } from "../variants";

export type CalendarProps = ComponentProps<typeof DayPicker> & {
	/** Variant of the previous/next month buttons. */
	buttonVariant?: ButtonVariant;
	size?: CalendarSize;
};

function Chevron({
	orientation,
	className,
}: {
	orientation?: string;
	className?: string;
}) {
	const d =
		orientation === "left"
			? "m15 6-6 6 6 6"
			: orientation === "right"
				? "m9 6 6 6-6 6"
				: "m6 9 6 6 6-6";
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			className={cn("size-4", className)}
		>
			<path d={d} />
		</svg>
	);
}

type CalendarState = {
	styles: ReturnType<typeof calendar>;
	size: CalendarSize;
	navButton: string;
	captionLayout: NonNullable<CalendarProps["captionLayout"]>;
	localeCode?: string;
	shown: Date;
	view: CalendarView;
	pageStart: number;
	startMonth?: Date;
	endMonth?: Date;
	/** The grid that last closed, so its caption button takes focus back. */
	closedFrom: RefObject<CalendarView | null>;
	goTo: (month: Date, motion: CalendarMotion) => void;
	show: (view: CalendarView, motion: CalendarMotion) => void;
	page: (start: number, motion: CalendarMotion) => void;
};

/** Read by the stable part components below, so react-day-picker never remounts them. */
const CalendarCtx = createContext<CalendarState | null>(null);
const useCalendar = () => {
	const ctx = useContext(CalendarCtx);
	if (!ctx) throw new Error("Calendar parts must be used inside <Calendar>");
	return ctx;
};

// The month each grid shows and its place, so the grid re-keys and replays its entrance.
const MonthKey = createContext({ key: "", index: 0 });

const monthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const monthIndex = (date: Date) => date.getFullYear() * 12 + date.getMonth();

/**
 * A date grid on react-day-picker, as shadcn's: `mode="single" | "multiple" | "range"`. The
 * dropdown caption layouts open month and year grids in place of native selects.
 */
export function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	fixedWeeks = true,
	captionLayout = "label",
	buttonVariant = "ghost",
	size = "default",
	locale,
	formatters,
	components,
	month: monthProp,
	defaultMonth,
	onMonthChange,
	startMonth,
	endMonth,
	...props
}: CalendarProps) {
	const defaults = getDefaultClassNames();
	const styles = calendar({ size });
	const navButton = cn(
		button({ variant: buttonVariant, size: "icon" }),
		styles.navButton(),
	);

	const [ownMonth, setOwnMonth] = useState(() => monthStart(defaultMonth ?? new Date()));
	const shown = monthProp ? monthStart(monthProp) : ownMonth;
	const [view, setView] = useState<CalendarView>("days");
	const [motion, setMotion] = useState<CalendarMotion | null>(null);
	const [pageStart, setPageStart] = useState(() => yearPageStart(shown.getFullYear()));
	const closedFrom = useRef<CalendarView | null>(null);

	const state: CalendarState = {
		styles,
		size,
		navButton,
		captionLayout,
		localeCode: locale?.code,
		shown,
		view,
		pageStart,
		startMonth,
		endMonth,
		goTo: (next, how) => {
			setMotion(how);
			if (monthProp === undefined) setOwnMonth(monthStart(next));
			onMonthChange?.(monthStart(next));
		},
		closedFrom,
		show: (next, how) => {
			setMotion(how);
			closedFrom.current = next === "days" ? view : null;
			if (next === "years") setPageStart(yearPageStart(shown.getFullYear()));
			setView(next);
		},
		page: (start, how) => {
			setMotion(how);
			setPageStart(start);
		},
	};

	const parts = useMemo(() => ({ ...STABLE_PARTS, ...components }), [components]);

	return (
		<CalendarCtx.Provider value={state}>
			<DayPicker
				showOutsideDays={showOutsideDays}
				fixedWeeks={fixedWeeks}
				className={cn(styles.root(), className)}
				captionLayout="label"
				locale={locale}
				month={shown}
				onMonthChange={(next) =>
					state.goTo(next, monthIndex(next) > monthIndex(shown) ? "next" : "prev")
				}
				startMonth={startMonth}
				endMonth={endMonth}
				formatters={formatters}
				data-calendar-motion={motion ?? undefined}
				classNames={{
					root: cn("w-fit", defaults.root),
					months: cn(styles.months(), defaults.months),
					month: cn(styles.month(), defaults.month),
					nav: cn(styles.nav(), defaults.nav),
					button_previous: cn(navButton, defaults.button_previous),
					button_next: cn(navButton, defaults.button_next),
					month_caption: cn(styles.header(), defaults.month_caption),
					caption_label: cn(styles.heading(), defaults.caption_label),
					month_grid: cn(styles.grid(), defaults.month_grid),
					weekdays: cn(styles.gridRow(), defaults.weekdays),
					weekday: cn(styles.headCell(), defaults.weekday),
					week: cn(styles.gridRow(), "mt-2", defaults.week),
					week_number_header: cn(
						"w-(--cell-size) select-none",
						defaults.week_number_header,
					),
					week_number: cn(
						"text-xs text-muted-foreground select-none",
						defaults.week_number,
					),
					day: cn(styles.cell(), styles.rangeCell(), defaults.day),
					outside: defaults.outside,
					disabled: defaults.disabled,
					hidden: cn("invisible", defaults.hidden),
					...classNames,
				}}
				components={parts}
				{...props}
			/>
		</CalendarCtx.Provider>
	);
}

function CalendarRoot({
	className,
	rootRef,
	...rest
}: ComponentProps<"div"> & { rootRef?: React.Ref<HTMLDivElement> }) {
	return <div data-slot="calendar" ref={rootRef} className={className} {...rest} />;
}

function CalendarMonth({
	calendarMonth,
	displayIndex,
	...rest
}: ComponentProps<"div"> & { calendarMonth: { date: Date }; displayIndex: number }) {
	return (
		<MonthKey.Provider
			value={{ key: calendarMonth.date.toISOString(), index: displayIndex }}
		>
			<div {...rest} />
		</MonthKey.Provider>
	);
}

function CalendarCaption({ calendarMonth, displayIndex, ...rest }: MonthCaptionProps) {
	const { styles, captionLayout, localeCode, view, show, closedFrom } = useCalendar();
	const monthRef = useRef<HTMLButtonElement>(null);
	const yearRef = useRef<HTMLButtonElement>(null);
	const date = calendarMonth.date;

	// A closed grid takes the focused cell with it, so focus returns to the button that opened it.
	useEffect(() => {
		const from = closedFrom.current;
		if (view !== "days" || !from || document.activeElement !== document.body) return;
		(from === "years" ? yearRef : monthRef).current?.focus();
	}, [view, closedFrom]);
	const monthName = new Intl.DateTimeFormat(localeCode, { month: "long" }).format(date);
	const year = date.getFullYear();
	const chooses = captionLayout !== "label" && displayIndex === 0;
	const monthButton = chooses && captionLayout !== "dropdown-years";
	const yearButton = chooses && captionLayout !== "dropdown-months";

	if (!chooses) {
		return (
			<div {...rest}>
				<span key={date.toISOString()} className={styles.heading()}>
					{new Intl.DateTimeFormat(localeCode, { month: "long", year: "numeric" }).format(
						date,
					)}
				</span>
			</div>
		);
	}

	return (
		<div {...rest}>
			{monthButton ? (
				<button
					ref={monthRef}
					type="button"
					aria-expanded={view === "months"}
					onClick={() =>
						show(
							view === "months" ? "days" : "months",
							view === "months" ? "zoom-in" : "zoom-out",
						)
					}
					className={styles.captionButton()}
				>
					<span key={date.getMonth()} className={styles.captionText()}>
						{monthName}
					</span>
					<Chevron />
				</button>
			) : (
				<span className={styles.heading()}>{monthName}</span>
			)}
			{yearButton ? (
				<button
					ref={yearRef}
					type="button"
					aria-expanded={view === "years"}
					onClick={() =>
						show(
							view === "years" ? "days" : "years",
							view === "years" ? "zoom-in" : "zoom-out",
						)
					}
					className={cn(styles.captionButton(), styles.captionYear())}
				>
					<span key={year} className={styles.captionText()}>
						{year}
					</span>
					<Chevron />
				</button>
			) : (
				<span className={styles.heading()}>{year}</span>
			)}
		</div>
	);
}

/** Pages months on the day grid, years on the month grid and twelve years on the year grid. */
function CalendarNav({
	onPreviousClick,
	onNextClick,
	previousMonth,
	nextMonth,
	className,
}: NavProps) {
	const { navButton, view, shown, pageStart, startMonth, endMonth, goTo, page } =
		useCalendar();
	const year = shown.getFullYear();
	const minYear = startMonth?.getFullYear() ?? Number.NEGATIVE_INFINITY;
	const maxYear = endMonth?.getFullYear() ?? Number.POSITIVE_INFINITY;

	const prev =
		view === "days"
			? { label: "Previous month", disabled: !previousMonth, run: onPreviousClick }
			: view === "months"
				? {
						label: "Previous year",
						disabled: year - 1 < minYear,
						run: () => goTo(new Date(year - 1, shown.getMonth(), 1), "prev"),
					}
				: {
						label: "Previous years",
						disabled: pageStart - 1 < minYear,
						run: () => page(pageStart - YEAR_PAGE, "prev"),
					};
	const next =
		view === "days"
			? { label: "Next month", disabled: !nextMonth, run: onNextClick }
			: view === "months"
				? {
						label: "Next year",
						disabled: year + 1 > maxYear,
						run: () => goTo(new Date(year + 1, shown.getMonth(), 1), "next"),
					}
				: {
						label: "Next years",
						disabled: pageStart + YEAR_PAGE > maxYear,
						run: () => page(pageStart + YEAR_PAGE, "next"),
					};

	return (
		<nav aria-label="Calendar navigation" className={className}>
			<button
				type="button"
				aria-label={prev.label}
				disabled={prev.disabled}
				onClick={prev.run}
				className={navButton}
			>
				<Chevron orientation="left" />
			</button>
			<button
				type="button"
				aria-label={next.label}
				disabled={next.disabled}
				onClick={next.run}
				className={navButton}
			>
				<Chevron orientation="right" />
			</button>
		</nav>
	);
}

function CalendarMonthGrid({ className, ...props }: ComponentProps<"table">) {
	const { styles, view } = useCalendar();
	const { key, index } = useContext(MonthKey);
	const days = view === "days";
	// The grid keeps its footprint under the chooser; re-keyed so it zooms back in on return.
	return (
		<div className={styles.stage()}>
			<table
				key={`${key}-${days}`}
				inert={!days}
				className={cn(className, !days && styles.hiddenGrid())}
				{...props}
			/>
			{!days && index === 0 && <CalendarChooser />}
		</div>
	);
}

/** The month or year grid: arrows move between cells, Escape goes back to the days. */
function CalendarChooser() {
	const { styles, view, shown, pageStart, localeCode, startMonth, endMonth, goTo, show } =
		useCalendar();
	const root = useRef<HTMLFieldSetElement>(null);
	const today = new Date();
	const year = shown.getFullYear();
	const first = startMonth ? monthIndex(startMonth) : Number.NEGATIVE_INFINITY;
	const last = endMonth ? monthIndex(endMonth) : Number.POSITIVE_INFINITY;
	const monthFormat = new Intl.DateTimeFormat(localeCode, { month: "short" });

	const cells =
		view === "months"
			? Array.from({ length: 12 }, (_, m) => ({
					key: `m${m}`,
					label: monthFormat.format(new Date(year, m, 1)),
					selected: m === shown.getMonth(),
					current: m === today.getMonth() && year === today.getFullYear(),
					disabled: year * 12 + m < first || year * 12 + m > last,
					pick: () => {
						goTo(new Date(year, m, 1), "zoom-in");
						show("days", "zoom-in");
					},
				}))
			: yearPage(pageStart).map((y) => ({
					key: `y${y}`,
					label: String(y),
					selected: y === year,
					current: y === today.getFullYear(),
					disabled: y * 12 + 11 < first || y * 12 > last,
					pick: () => {
						goTo(new Date(y, shown.getMonth(), 1), "zoom-in");
						show("months", "zoom-in");
					},
				}));

	// Focus lands on the chosen cell when the view opens; paging leaves it on the nav.
	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: view.
	useEffect(() => {
		const node = root.current;
		const target =
			node?.querySelector<HTMLElement>("[data-selected]") ??
			node?.querySelector<HTMLElement>("[data-current]") ??
			node?.querySelector<HTMLElement>("button:not(:disabled)");
		target?.focus();
	}, [view]);

	function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
		if (event.key === "Escape") {
			event.stopPropagation();
			show("days", "zoom-in");
			return;
		}
		const step = CHOICE_STEP[event.key];
		if (step === undefined) return;
		event.preventDefault();
		const buttons = [
			...(root.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ??
				[]),
		];
		const at = buttons.indexOf(event.currentTarget);
		buttons[Math.min(buttons.length - 1, Math.max(0, at + step))]?.focus();
	}

	return (
		<fieldset
			ref={root}
			key={view === "months" ? `months-${year}` : `years-${pageStart}`}
			aria-label={view === "months" ? `Months of ${year}` : "Years"}
			className={styles.choices()}
		>
			{cells.map((cell, i) => (
				<button
					key={cell.key}
					type="button"
					disabled={cell.disabled}
					aria-pressed={cell.selected}
					data-selected={cell.selected || undefined}
					data-current={(!cell.selected && cell.current) || undefined}
					onClick={cell.pick}
					onKeyDown={onKeyDown}
					className={styles.choice()}
					style={{ animationDelay: choiceDelay(i) }}
				>
					{cell.label}
				</button>
			))}
		</fieldset>
	);
}

function CalendarDayButtonPart(props: ComponentProps<typeof DayButton>) {
	const { size } = useCalendar();
	return <CalendarDayButton size={size} {...props} />;
}

function CalendarWeekNumber({ children, ...rest }: ComponentProps<"td">) {
	return (
		<td {...rest}>
			<div className="flex size-(--cell-size) items-center justify-center text-center">
				{children}
			</div>
		</td>
	);
}

const STABLE_PARTS = {
	Root: CalendarRoot,
	Chevron,
	Month: CalendarMonth,
	MonthCaption: CalendarCaption,
	Nav: CalendarNav,
	MonthGrid: CalendarMonthGrid,
	DayButton: CalendarDayButtonPart,
	WeekNumber: CalendarWeekNumber,
};

/** One day. Carries the same data attributes as bits-ui's day, so both ports share classes. */
export function CalendarDayButton({
	className,
	day,
	modifiers,
	size = "default",
	locale,
	...props
}: ComponentProps<typeof DayButton> & { size?: CalendarSize; locale?: Partial<Locale> }) {
	const s = calendar({ size });
	const ref = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);

	return (
		<button
			ref={ref}
			type="button"
			data-slot="calendar-day"
			data-day={day.date.toLocaleDateString(locale?.code)}
			data-selected={modifiers.selected || undefined}
			data-today={modifiers.today || undefined}
			data-outside-month={modifiers.outside || undefined}
			data-disabled={modifiers.disabled || undefined}
			data-range-start={modifiers.range_start || undefined}
			data-range-end={modifiers.range_end || undefined}
			data-range-middle={modifiers.range_middle || undefined}
			data-highlighted={modifiers.highlighted || undefined}
			className={cn(s.day(), s.rangeDay(), className)}
			{...props}
		/>
	);
}
