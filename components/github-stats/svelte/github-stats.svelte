<script lang="ts">
import Avatar from "../../avatar/svelte/avatar.svelte";
import AvatarFallback from "../../avatar/svelte/avatar-fallback.svelte";
import AvatarImage from "../../avatar/svelte/avatar-image.svelte";
import Badge from "../../badge/svelte/badge.svelte";
import { Bar, BarChart, BarTooltip, BarXAxis, BarYAxis } from "../../bar-chart/svelte";
import { ChartContainer, ChartTooltipContent } from "../../chart/svelte";
import Empty from "../../empty/svelte/empty.svelte";
import EmptyDescription from "../../empty/svelte/empty-description.svelte";
import EmptyHeader from "../../empty/svelte/empty-header.svelte";
import EmptyTitle from "../../empty/svelte/empty-title.svelte";
import GithubCalendar from "../../github-calendar/svelte/github-calendar.svelte";
import { cn } from "../../lib/svelte/cn";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import Select from "../../select/svelte/select.svelte";
import SelectContent from "../../select/svelte/select-content.svelte";
import SelectItem from "../../select/svelte/select-item.svelte";
import SelectTrigger from "../../select/svelte/select-trigger.svelte";
import SelectValue from "../../select/svelte/select-value.svelte";
import Tabs from "../../tabs/svelte/tabs.svelte";
import TabsContent from "../../tabs/svelte/tabs-content.svelte";
import TabsList from "../../tabs/svelte/tabs-list.svelte";
import TabsTrigger from "../../tabs/svelte/tabs-trigger.svelte";
import {
	contributionInsights,
	contributionYears,
	formatChange,
	formatCount,
	formatDay,
	formatPercent,
	GITHUB_COUNT_KEYS,
	GITHUB_STATS_LABELS,
	type GithubStatsData,
	type GithubStatsLabels,
	type GithubStatsView,
	initials,
	mixShares,
	sameDaysChange,
	weeklyContributions,
	yearTotal,
} from "./core";
import {
	GITHUB_MIX_FILL,
	GITHUB_STATS_LAYOUT,
	type GithubStatsVariant,
	githubStats,
} from "./variants";

let {
	data,
	variant = "default",
	year = $bindable(),
	onYearChange,
	view = $bindable("days"),
	onViewChange,
	locale,
	labels: labelsProp,
	class: classProp,
}: {
	data: GithubStatsData;
	variant?: GithubStatsVariant;
	/** Bindable year (`"2026"`); the newest with data when unset. */
	year?: string;
	onYearChange?: (year: string) => void;
	view?: GithubStatsView;
	onViewChange?: (view: GithubStatsView) => void;
	locale?: string;
	labels?: Partial<GithubStatsLabels>;
	class?: string;
} = $props();

const REPO_LIMIT = 5;

const labels = $derived({ ...GITHUB_STATS_LABELS, ...labelsProp });
const styles = $derived(githubStats({ variant }));
const layout = $derived(GITHUB_STATS_LAYOUT[variant]);
const years = $derived(contributionYears(data.contributions));
const activeYear = $derived(year ?? years[0] ?? "");
const days = $derived(data.contributions[activeYear] ?? []);
const total = $derived(yearTotal(days));
const facts = $derived(contributionInsights(days));
const change = $derived(sameDaysChange(data.contributions, activeYear));
const yearItems = $derived(years.map((y) => ({ value: y, label: y })));
const repositories = $derived(data.repositories ?? []);
const hiddenRepos = $derived(repositories.length - REPO_LIMIT);
const shares = $derived(data.mix ? mixShares(data.mix) : []);
const weekRows = $derived(
	weeklyContributions(days).map((week) => ({
		label: formatDay(week.date, locale),
		count: week.count,
	})),
);
const trendVariant = $derived(
	!change || change.ratio === null || change.ratio === 0
		? "secondary"
		: change.ratio > 0
			? "success"
			: "destructive",
);
const trendPath = $derived(
	trendVariant === "success"
		? "M6 9.5v-7M3 5.5l3-3 3 3"
		: trendVariant === "destructive"
			? "M6 2.5v7M3 6.5l3 3 3-3"
			: "M2.5 6h7",
);

function setYear(next: string) {
	year = next;
	onYearChange?.(next);
}

function setView(next: string) {
	if (next !== "days" && next !== "weeks") return;
	view = next;
	onViewChange?.(next);
}

const countFormat = (value: number) => formatCount(Math.round(value), locale);
</script>

<!-- A year on GitHub: the total and its trend, the facts behind it, the calendar, and where it went. -->
<div data-slot="github-stats" data-variant={variant} class={cn(styles.root(), classProp)}>
	{#if years.length === 0}
		<Empty variant="outline" size="sm" role="status">
			<EmptyHeader>
				<EmptyTitle>{labels.emptyTitle}</EmptyTitle>
				<EmptyDescription>{labels.emptyDescription}</EmptyDescription>
			</EmptyHeader>
		</Empty>
	{:else}
		<Tabs bind:value={() => view, setView} variant="segment" size="sm">
			<header class={styles.head()}>
				<div class="min-w-0">
					<p class={styles.eyebrow()}>{labels.eyebrow}</p>
					<p class={styles.hero()}>
						{#if layout.animate}
							<RollingDigits variant="count" value={total} format={countFormat} durationMs={900} size="default" class={cn("font-bold text-foreground", styles.heroValue())} />
						{:else}
							<span class={styles.heroValue()}>{formatCount(total, locale)}</span>
						{/if}
						<span class={styles.heroUnit()}>{labels.totalIn(activeYear)}</span>
					</p>
					{#if change}
						<p class={styles.trendRow()}>
							<Badge size="sm" variant={trendVariant} class={styles.trend()}>
								<svg
									viewBox="0 0 12 12"
									fill="none"
									stroke="currentColor"
									stroke-width="1.75"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d={trendPath} />
								</svg>
								{change.ratio === null ? labels.newLabel : formatChange(change.ratio, locale)}
							</Badge>
							<span class={styles.compare()}>{labels.compare(change.previousYear)}</span>
						</p>
					{/if}
				</div>
				<div class={styles.controls()}>
					<TabsList aria-label={labels.view}>
						<TabsTrigger value="days">{labels.days}</TabsTrigger>
						<TabsTrigger value="weeks">{labels.weeks}</TabsTrigger>
					</TabsList>
					{#if years.length > 1}
						<Select bind:value={() => activeYear, setYear} items={yearItems}>
							<SelectTrigger aria-label={labels.year} class={styles.yearTrigger()}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{#each years as y (y)}
									<SelectItem value={y} label={y} class="font-mono text-xs">{y}</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					{/if}
				</div>
			</header>

			<dl class={styles.insights()}>
				<div class={styles.insight()}>
					<dt class={styles.insightLabel()}>{labels.longestStreak}</dt>
					<dd class={styles.insightValue()}>{labels.dayCount(facts.longestStreak)}</dd>
				</div>
				<div class={styles.insight()}>
					<dt class={styles.insightLabel()}>{labels.currentStreak}</dt>
					<dd class={styles.insightValue()}>{labels.dayCount(facts.currentStreak)}</dd>
				</div>
				<div class={styles.insight()}>
					<dt class={styles.insightLabel()}>{labels.bestDay}</dt>
					<dd class={styles.insightValue()}>
						{#if facts.best}
							{formatCount(facts.best.count, locale)}
							<span class={styles.insightNote()}>{formatDay(facts.best.date, locale)}</span>
						{:else}
							–
						{/if}
					</dd>
				</div>
				<div class={styles.insight()}>
					<dt class={styles.insightLabel()}>{labels.activeDays}</dt>
					<dd class={styles.insightValue()}>
						{formatCount(facts.activeDays, locale)}
						<span class={styles.insightNote()}>/ {days.length}</span>
					</dd>
				</div>
			</dl>

			<div class={styles.calendar()}>
				<TabsContent value="days" class={styles.panel()}>
					{#key activeYear}
						<GithubCalendar
							{days}
							size={layout.calendar}
							tone="success"
							showTotal={false}
							{locale}
						/>
					{/key}
				</TabsContent>
				<TabsContent value="weeks" class={styles.panel()}>
					{#if view === "weeks"}
					<ChartContainer
						config={{ count: { label: labels.contributions, color: "var(--success)" } }}
						title="{labels.contributions}: {labels.weeks.toLowerCase()}"
						{locale}
						aspect="wide"
					>
						<BarChart data={weekRows} xKey="label">
							<Bar dataKey="count" />
							<BarXAxis maxLabels={8} />
							<BarYAxis tickFormatter={(value) => formatCount(value, locale)} />
							<BarTooltip>
								{#snippet content()}
									<ChartTooltipContent>
										{#snippet formatter({ value })}
											{formatCount(value, locale)}
										{/snippet}
										{#snippet labelFormatter({ label })}
											{labels.weekOf} {label}
										{/snippet}
									</ChartTooltipContent>
								{/snippet}
							</BarTooltip>
						</BarChart>
					</ChartContainer>
					{/if}
				</TabsContent>
			</div>
		</Tabs>

		<dl class={styles.counts()}>
			{#each GITHUB_COUNT_KEYS as key (key)}
				<div class={styles.count()}>
					<dt class={styles.countLabel()}>{labels[key]}</dt>
					<dd class="order-first">
						{#if layout.animate}
							<RollingDigits
								variant="count"
								value={data.counts[key]}
								format={countFormat}
								durationMs={1200}
								size="default"
								class={cn("font-bold text-foreground", styles.countValue())}
							/>
						{:else}
							<span class={styles.countValue()}>{formatCount(data.counts[key], locale)}</span>
						{/if}
					</dd>
				</div>
			{/each}
		</dl>

		{#if layout.footer && (data.mix || repositories.length)}
			<div class={styles.footer()}>
				{#if data.mix}
					<!-- One bar of the whole, in a fixed order and shade per kind, with every share written out. -->
					<section class={styles.mix()}>
						<h3 class={styles.sectionTitle()}>{labels.mixTitle}</h3>
						<div class={styles.mixBar()} aria-hidden="true">
							{#each shares as { key, share } (key)}
								{#if share > 0}
									<span
										class={styles.mixSegment()}
										style:flex-grow={share}
										style:background={GITHUB_MIX_FILL[key]}
									></span>
								{/if}
							{/each}
						</div>
						<ul class={styles.mixLegend()}>
							{#each shares as { key, share } (key)}
								<li class={styles.mixItem()}>
									<span
										aria-hidden="true"
										class={styles.mixSwatch()}
										style:background={GITHUB_MIX_FILL[key]}
									></span>
									<span class={styles.mixLabel()}>{labels[key]}</span>
									<span class={styles.mixValue()}>{formatPercent(share, locale)}</span>
								</li>
							{/each}
						</ul>
					</section>
				{:else}
					<span></span>
				{/if}
				{#if repositories.length}
					<section class={styles.where()}>
						<h3 class={styles.sectionTitle()}>{labels.contributedTo}</h3>
						<ul class={styles.repoList()}>
							{#each repositories.slice(0, REPO_LIMIT) as repo (repo.url)}
								<li class="min-w-0">
									<a href={repo.url} target="_blank" rel="noopener noreferrer" class={styles.repo()}>
										<span class={styles.repoOwner()}>{repo.owner}/</span>
										<span class={styles.repoName()}>{repo.name}</span>
									</a>
								</li>
							{/each}
						</ul>
						{#if hiddenRepos > 0}
							{#if data.profileUrl}
								<a href={data.profileUrl} target="_blank" rel="noopener noreferrer" class={styles.more()}>
									{labels.more(hiddenRepos)}
								</a>
							{:else}
								<p class={styles.more()}>{labels.more(hiddenRepos)}</p>
							{/if}
						{/if}
						{#if data.organizations?.length}
							<p class={styles.orgs()}>
								{labels.alongside}
								{#each data.organizations as org (org.url)}
									<a href={org.url} target="_blank" rel="noopener noreferrer" class={styles.org()}>
										<Avatar size="sm" shape="square" class={styles.orgAvatar()}>
											<AvatarImage src={org.avatarUrl} alt="" />
											<AvatarFallback>{initials(org.name)}</AvatarFallback>
										</Avatar>
										{org.name}
									</a>
								{/each}
							</p>
						{/if}
					</section>
				{/if}
			</div>
		{/if}
	{/if}
</div>
