<script lang="ts">
import { tick, untrack } from "svelte";
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

let {
	selected = $bindable(),
	defaultSelected,
	onSelect,
	expanded = $bindable(),
	defaultExpanded = false,
	onExpandedChange,
	month = $bindable(),
	defaultMonth,
	onMonthChange,
	weekStartsOn = 0,
	locale = "en-US",
	today: todayProp,
	labels: labelsProp,
	variant = "card",
	class: classProp,
}: {
	/** Bindable selected day; `null` clears it. */
	selected?: Date | null;
	/** Defaults to today. */
	defaultSelected?: Date | null;
	onSelect?: (date: Date) => void;
	/** Bindable: month grid instead of a week strip. */
	expanded?: boolean;
	defaultExpanded?: boolean;
	onExpandedChange?: (expanded: boolean) => void;
	/** Bindable: any day inside the week or month on screen. */
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
	class?: string;
} = $props();

type Period = { id: number; key: string; anchor: Date; expanded: boolean };
type Label = { id: number; text: string };

const labels = $derived({ ...WEEK_CALENDAR_LABELS, ...labelsProp });
const today = $derived(startOfDay(todayProp ?? new Date()));
// svelte-ignore state_referenced_locally -- one-time seeds, like React's useState(initialValue)
let selectedState = $state<Date | null>(
	defaultSelected !== undefined ? defaultSelected : today,
);
const current = $derived(selected !== undefined ? selected : selectedState);
// svelte-ignore state_referenced_locally
let expandedState = $state(defaultExpanded);
const isExpanded = $derived(expanded ?? expandedState);
// svelte-ignore state_referenced_locally
let anchorState = $state(startOfDay(defaultMonth ?? current ?? today));
const anchor = $derived(month ? startOfDay(month) : anchorState);
const styles = $derived(weekCalendar({ variant }));

const format = $derived({
	weekday: new Intl.DateTimeFormat(locale, { weekday: "narrow" }),
	month: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
	range: new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }),
	full: new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
	day: new Intl.DateTimeFormat(locale, { day: "numeric" }),
});

const weekStart = $derived(startOfWeek(anchor, weekStartsOn));
const periodKey = $derived(
	isExpanded ? `m${anchor.getFullYear()}-${anchor.getMonth()}` : `w${dayKey(weekStart)}`,
);
// svelte-ignore state_referenced_locally
let period = $state<Period>({ id: 0, key: periodKey, anchor, expanded: isExpanded });
let leaving = $state<Period[]>([]);

$effect.pre(() => {
	const key = periodKey;
	const a = anchor;
	const e = isExpanded;
	untrack(() => {
		if (period.key === key && sameDay(period.anchor, a) && period.expanded === e) return;
		// A toggle morphs the rows in place; moving to another week or month dissolves.
		if (period.expanded === e && period.key !== key) {
			leaving = [...leaving, period];
			period = { id: period.id + 1, key, anchor: a, expanded: e };
		} else {
			period = { ...period, key, anchor: a, expanded: e };
		}
	});
});

const title = $derived(
	isExpanded
		? format.month.format(anchor)
		: format.range.formatRange(weekStart, addDays(weekStart, 6)),
);
// svelte-ignore state_referenced_locally
let label = $state<Label>({ id: 0, text: title });
let leavingLabels = $state<Label[]>([]);

$effect.pre(() => {
	const text = title;
	untrack(() => {
		if (label.text === text) return;
		leavingLabels = [...leavingLabels, label];
		label = { id: label.id + 1, text };
	});
});

// svelte-ignore state_referenced_locally
let focusDay = $state<Date>(current ?? anchor);
let root = $state<HTMLDivElement | null>(null);

function setAnchor(next: Date) {
	const day = startOfDay(next);
	if (month === undefined) anchorState = day;
	else month = day;
	onMonthChange?.(day);
}

function setExpanded(next: boolean) {
	if (expanded === undefined) expandedState = next;
	else expanded = next;
	onExpandedChange?.(next);
}

const visible = (date: Date) =>
	isExpanded
		? sameMonth(date, anchor)
		: sameDay(startOfWeek(date, weekStartsOn), weekStart);

function step(direction: 1 | -1) {
	setAnchor(isExpanded ? addMonths(anchor, direction) : addDays(anchor, direction * 7));
}

function select(date: Date) {
	const day = startOfDay(date);
	if (selected === undefined) selectedState = day;
	else selected = day;
	onSelect?.(day);
	focusDay = day;
	if (!visible(day) || isExpanded) setAnchor(day);
}

async function onDayKey(event: KeyboardEvent, date: Date) {
	const target = arrowTarget(date, event.key);
	if (!target) return;
	event.preventDefault();
	focusDay = target;
	if (!visible(target)) setAnchor(target);
	await tick();
	root
		?.querySelector<HTMLButtonElement>(
			`[data-period="${period.id}"] [data-day="${dayKey(target)}"]`,
		)
		?.focus();
}

let dragX = $state(0);
let drag: { x: number; lastX: number; lastT: number; vx: number; moved: boolean } | null =
	null;
let suppressClick = false;

function onPointerDown(event: PointerEvent) {
	if (isExpanded || (event.pointerType === "mouse" && event.button !== 0)) return;
	drag = {
		x: event.clientX,
		lastX: event.clientX,
		lastT: performance.now(),
		vx: 0,
		moved: false,
	};
}

function onPointerMove(event: PointerEvent) {
	if (!drag) return;
	const dx = event.clientX - drag.x;
	if (!drag.moved && Math.abs(dx) < 4) return;
	if (!drag.moved)
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	drag.moved = true;
	const now = performance.now();
	drag.vx = ((event.clientX - drag.lastX) / Math.max(1, now - drag.lastT)) * 1000;
	drag.lastX = event.clientX;
	drag.lastT = now;
	dragX = dx * SWIPE.elastic;
}

function onPointerEnd(event: PointerEvent) {
	const state = drag;
	drag = null;
	if (!state?.moved) return;
	suppressClick = true;
	setTimeout(() => {
		suppressClick = false;
	}, 0);
	const dx = event.clientX - state.x;
	dragX = 0;
	if (dx <= -SWIPE.distance || state.vx <= -SWIPE.velocity) step(1);
	else if (dx >= SWIPE.distance || state.vx >= SWIPE.velocity) step(-1);
}

const tilt = $derived(Math.max(-1, Math.min(1, dragX / SWIPE.tiltRange)) * SWIPE.tiltDeg);
const onPeriod = $derived(
	isExpanded
		? sameMonth(anchor, today)
		: sameDay(startOfWeek(today, weekStartsOn), weekStart),
);

let handle: { y: number; fired: boolean } | null = null;
let handleFired = false;

function toneOf(date: Date, p: Period): WeekCalendarDayTone {
	if (current && sameDay(date, current)) return "selected";
	if (sameDay(date, today)) return "today";
	return p.expanded && !sameMonth(date, p.anchor) ? "outside" : "default";
}
</script>

{#snippet body(p: Period, exiting: boolean)}
	{@const weeks = monthWeeks(p.anchor, weekStartsOn)}
	{@const pStart = startOfWeek(p.anchor, weekStartsOn)}
	{@const anchorRow = Math.max(0, weeks.findIndex((w) => w[0] && sameDay(w[0], pStart)))}
	{@const focusable = weeks.flat().some((d) => sameDay(d, focusDay)) ? focusDay : p.anchor}
	<div
		data-period={p.id}
		aria-hidden={exiting || undefined}
		inert={exiting}
		class={cn(styles.body(), exiting ? "week-calendar-out" : p.id > 0 && "week-calendar-in")}
		onanimationend={(event) => {
			if (exiting && event.target === event.currentTarget)
				leaving = leaving.filter((l) => l.id !== p.id);
		}}
	>
		{#each weeks as week, i (week[0] ? dayKey(week[0]) : i)}
			{@const collapsed = !p.expanded && i !== anchorRow}
			{@const col = current ? week.findIndex((d) => sameDay(d, current)) : -1}
			<div
				data-collapsed={collapsed || undefined}
				inert={collapsed}
				class={styles.row()}
				style:--row-delay="{Math.abs(i - anchorRow) * ROW_STAGGER_MS}ms"
			>
				<div class={styles.rowClip()}>
					<div class={styles.cells()}>
						{#if col >= 0}
							<span aria-hidden="true" class={styles.pill()} style:--col={col}></span>
						{/if}
						{#each week as date (dayKey(date))}
							{@const isSelected = current ? sameDay(date, current) : false}
							{@const isToday = sameDay(date, today)}
							<button
								type="button"
								data-day={dayKey(date)}
								data-selected={isSelected || undefined}
								aria-pressed={isSelected}
								aria-current={isToday ? "date" : undefined}
								aria-label={format.full.format(date)}
								tabindex={sameDay(date, focusable) ? 0 : -1}
								class={styles.day()}
								onclick={() => {
									if (!suppressClick) select(date);
								}}
								onkeydown={(event) => onDayKey(event, date)}
							>
								<span class={weekCalendar({ tone: toneOf(date, p) }).dayFace()}
									>{format.day.format(date)}</span
								>
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
{/snippet}

<div
	bind:this={root}
	data-slot="week-calendar"
	data-expanded={isExpanded || undefined}
	class={cn(styles.root(), classProp)}
>
	<span aria-live="polite" class={styles.srOnly()}
		>{current ? labels.selected(format.full.format(current)) : labels.none}</span
	>
	<div class={styles.header()}>
		<div class={styles.titleGroup()}>
			<div class={styles.titleClip()}>
				{#each leavingLabels as l (l.id)}
					<p
						aria-hidden="true"
						class={cn(styles.title(), "week-calendar-label-out")}
						onanimationend={() => (leavingLabels = leavingLabels.filter((c) => c.id !== l.id))}
					>
						{l.text}
					</p>
				{/each}
				{#key label.id}
					<p class={cn(styles.title(), label.id > 0 && "week-calendar-label-in")}>{label.text}</p>
				{/key}
			</div>
			<button
				type="button"
				data-hidden={onPeriod || undefined}
				inert={onPeriod}
				class={styles.today()}
				onclick={() => setAnchor(today)}>{labels.today}</button
			>
		</div>
		<div class={styles.nav()}>
			<button
				type="button"
				aria-label={isExpanded ? labels.previousMonth : labels.previousWeek}
				class={styles.navButton()}
				onclick={() => step(-1)}
			>
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5">
					<path
						d="m10 4-4 4 4 4"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
			<button
				type="button"
				aria-label={isExpanded ? labels.nextMonth : labels.nextWeek}
				class={styles.navButton()}
				onclick={() => step(1)}
			>
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-3.5">
					<path
						d="m6 4 4 4-4 4"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</div>
	</div>
	<div aria-hidden="true" class={styles.weekdays()}>
		{#each { length: 7 }, i (i)}
			<span class={styles.weekday()}>{format.weekday.format(addDays(weekStart, i))}</span>
		{/each}
	</div>
	<div
		role="presentation"
		data-dragging={dragX !== 0 || undefined}
		class={styles.viewport()}
		style:translate="{dragX}px 0"
		style:rotate="{tilt}deg"
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerEnd}
		onpointercancel={onPointerEnd}
	>
		<div class={styles.stage()}>
			{#each leaving as p (p.id)}
				{@render body(p, true)}
			{/each}
			{#key period.id}
				{@render body(period, false)}
			{/key}
		</div>
	</div>
	<div class={styles.handleBar()}>
		<button
			type="button"
			aria-expanded={isExpanded}
			aria-label={isExpanded ? labels.collapse : labels.expand}
			class={styles.handle()}
			onpointerdown={(event) => {
				handle = { y: event.clientY, fired: false };
				event.currentTarget.setPointerCapture(event.pointerId);
			}}
			onpointermove={(event) => {
				if (!handle || handle.fired) return;
				const dy = event.clientY - handle.y;
				if ((dy > HANDLE_DRAG_PX && !isExpanded) || (dy < -HANDLE_DRAG_PX && isExpanded)) {
					handle.fired = true;
					handleFired = true;
					setExpanded(!isExpanded);
				}
			}}
			onpointerup={() => (handle = null)}
			onclick={() => {
				if (handleFired) {
					handleFired = false;
					return;
				}
				setExpanded(!isExpanded);
			}}
		></button>
	</div>
</div>
