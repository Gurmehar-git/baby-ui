<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import Tooltip from "../../tooltip/svelte/tooltip.svelte";
import TooltipContent from "../../tooltip/svelte/tooltip-content.svelte";
import TooltipProvider from "../../tooltip/svelte/tooltip-provider.svelte";
import TooltipTrigger from "../../tooltip/svelte/tooltip-trigger.svelte";
import {
	buildGrid,
	GITHUB_CALENDAR_LABELS,
	type GithubCalendarDay,
	type GithubCalendarLabels,
	type GithubCalendarLevel,
	type GithubCalendarWeekStart,
	moveIndex,
} from "../calendar";
import {
	type GithubCalendarShape,
	type GithubCalendarSize,
	type GithubCalendarTone,
	type GithubCalendarVariant,
	githubCalendar,
	TONE_FILL,
	WEEK_TRACK,
} from "../variants";

type Props = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
	/** One entry per day; gaps between the first and last day render as 0. */
	days: GithubCalendarDay[];
	variant?: GithubCalendarVariant;
	shape?: GithubCalendarShape;
	size?: GithubCalendarSize;
	tone?: GithubCalendarTone;
	title?: string;
	showTotal?: boolean;
	showLegend?: boolean;
	weekStart?: GithubCalendarWeekStart;
	/** Upper bounds of levels 1 to 3; quarters of the busiest day when omitted. */
	thresholds?: number[];
	/** Selected day as `YYYY-MM-DD`; bindable. */
	value?: string | null;
	onValueChange?: (value: string | null) => void;
	labels?: Partial<GithubCalendarLabels>;
	locale?: string;
};

let {
	days,
	variant = "default",
	shape = "rounded",
	size = "default",
	tone = "scale",
	title,
	showTotal = true,
	showLegend = true,
	weekStart = "sunday",
	thresholds,
	value = $bindable(null),
	onValueChange,
	labels,
	locale,
	class: classProp,
	...rest
}: Props = $props();

const LEVELS: GithubCalendarLevel[] = [0, 1, 2, 3, 4];

let scroller: HTMLDivElement | undefined = $state();

const l = $derived({ ...GITHUB_CALENDAR_LABELS, ...labels });
const s = $derived(githubCalendar({ variant, shape, size, tone }));
const fills = $derived(TONE_FILL[tone]);
const grid = $derived(buildGrid(days, weekStart, thresholds));
const formats = $derived({
	month: new Intl.DateTimeFormat(locale, { month: "short" }),
	weekday: new Intl.DateTimeFormat(locale, { weekday: "short" }),
	day: new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
	number: new Intl.NumberFormat(locale),
});
const selected = $derived(grid.cells.findIndex((c) => c.key === value));
const tabStop = $derived(selected >= 0 ? selected : grid.cells.length - 1);

$effect(() => {
	if (scroller) scroller.scrollLeft = scroller.scrollWidth;
});

function noun(count: number) {
	return count === 1 ? l.contribution : l.contributions;
}

function select(next: string | null) {
	value = next;
	onValueChange?.(next);
}

function onkeydown(event: KeyboardEvent) {
	const next = moveIndex(event.key, tabStop, grid.cells.length);
	if (next === null) return;
	event.preventDefault();
	const cell = grid.cells[next];
	if (!cell) return;
	select(cell.key);
	scroller?.querySelectorAll<HTMLElement>("[data-day]")[next]?.focus();
}
</script>

<div data-slot="github-calendar" class={cn(s.root(), classProp)} {...rest}>
	{#if title || showTotal}
		<div class={s.header()}>
			{#if title}<span class={s.title()}>{title}</span>{:else}<span></span>{/if}
			{#if showTotal}
				<span class={s.total()}>{formats.number.format(grid.total)} {l.total}</span>
			{/if}
		</div>
	{/if}
	<div bind:this={scroller} class={s.scroller()}>
		<TooltipProvider>
			<div
				role="toolbar"
				tabindex={-1}
				aria-label={l.grid}
				{onkeydown}
				class={s.grid()}
				style:grid-template-columns="auto repeat({grid.weeks}, {WEEK_TRACK[size]})"
				style:grid-template-rows="auto repeat(7, auto)"
			>
				{#each grid.months as m (m.col)}
					<span
						aria-hidden="true"
						class={s.month()}
						style:grid-column={m.col + 2}
						style:grid-row={1}
					>
						{formats.month.format(m.date)}
					</span>
				{/each}
				{#each grid.weekdays as d, row (d.getTime())}
					{#if row % 2 === 1}
						<span
							aria-hidden="true"
							class={s.weekday()}
							style:grid-column={1}
							style:grid-row={row + 2}
						>
							{formats.weekday.format(d)}
						</span>
					{/if}
				{/each}
				{#each grid.cells as cell, i (cell.key)}
					<Tooltip delay={100}>
						<TooltipTrigger
							data-day=""
							data-level={cell.level}
							data-active={i === selected ? "" : undefined}
							tabindex={i === tabStop ? 0 : -1}
							aria-label="{formats.number.format(cell.count)} {noun(cell.count)} {l.on} {formats.day.format(cell.date)}"
							aria-pressed={i === selected}
							onclick={() => select(i === selected ? null : cell.key)}
							class={s.cell()}
							style="--cell: {fills[cell.level]}; --col: {cell.col}; grid-column: {cell.col + 2}; grid-row: {cell.row + 2}"
						/>
						<TooltipContent>
							<span class={s.tip()}>
								<span class={s.tipCount()}>{formats.number.format(cell.count)}</span>
								<span class={s.tipText()}>
									{noun(cell.count)} {l.on} {formats.day.format(cell.date)}
								</span>
							</span>
						</TooltipContent>
					</Tooltip>
				{/each}
			</div>
		</TooltipProvider>
	</div>
	{#if showLegend}
		<div class={s.legend()} aria-hidden="true">
			<span class="mr-1">{l.less}</span>
			{#each LEVELS as level (level)}
				<span class={s.swatch()} style:--cell={fills[level]}></span>
			{/each}
			<span class="ml-1">{l.more}</span>
		</div>
	{/if}
</div>
