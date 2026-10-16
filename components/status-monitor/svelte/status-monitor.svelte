<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import Tooltip from "../../tooltip/svelte/tooltip.svelte";
import TooltipContent from "../../tooltip/svelte/tooltip-content.svelte";
import TooltipProvider from "../../tooltip/svelte/tooltip-provider.svelte";
import TooltipTrigger from "../../tooltip/svelte/tooltip-trigger.svelte";
import {
	BAR_WIDTH,
	formatTimestamp,
	nextIndex,
	STATUS_ICON,
	STATUS_MONITOR_LABELS,
	type StatusMonitorItem,
	type StatusMonitorLabels,
	type StatusMonitorUnit,
	slotsForWidth,
	timelineWidth,
	uptimePercent,
	visibleItems,
} from "./timeline";
import { type StatusMonitorSize, statusMonitor, statusTone } from "./variants";

type Props = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
	/** One entry per period, oldest first; the newest 90 are kept. */
	statuses: StatusMonitorItem[];
	unit?: StatusMonitorUnit;
	title?: string;
	showUptime?: boolean;
	size?: StatusMonitorSize;
	labels?: Partial<StatusMonitorLabels>;
	/** Formats Date timestamps; the runtime's locale when omitted. */
	locale?: string;
};

let {
	statuses,
	unit = "days",
	title,
	showUptime = true,
	size = "default",
	labels,
	locale,
	class: classProp,
	...rest
}: Props = $props();

let root: HTMLDivElement | undefined = $state();
let bars: HTMLDivElement | undefined = $state();
let slots = $state(30);
let focusIndex = $state<number | null>(null);

const l = $derived({ ...STATUS_MONITOR_LABELS, ...labels });
const s = $derived(statusMonitor({ size }));
const items = $derived(visibleItems(statuses, slots));
const uptime = $derived(uptimePercent(statuses));
const active = $derived(Math.min(focusIndex ?? items.length - 1, items.length - 1));
const heading = $derived(title ?? l.title);

$effect(() => {
	if (!root) return;
	const el = root;
	const measure = () => (slots = slotsForWidth(el.getBoundingClientRect().width));
	measure();
	const observer = new ResizeObserver(measure);
	observer.observe(el);
	return () => observer.disconnect();
});

function onkeydown(event: KeyboardEvent) {
	const next = nextIndex(event.key, active, items.length);
	if (next === null) return;
	event.preventDefault();
	focusIndex = next;
	bars?.querySelectorAll<HTMLElement>("[data-bar]")[next]?.focus();
}
</script>

<div bind:this={root} data-slot="status-monitor" class={cn(s.root(), classProp)} {...rest}>
	<div class={s.inner()} style:width="{timelineWidth(slots)}px">
		<div class={s.header()}>
			<span class={s.title()}>{heading}</span>
			{#if showUptime}
				<span class={s.uptime()}>{uptime}% {l.uptime}</span>
			{/if}
		</div>
		<TooltipProvider>
			<div
				bind:this={bars}
				role="toolbar"
				tabindex={-1}
				aria-label={heading}
				{onkeydown}
				class={s.bars()}
				style:grid-template-columns="repeat({slots}, {BAR_WIDTH}px)"
			>
				{#each items as item, i (i)}
					{@const tone = statusTone({ status: item.status })}
					{@const when = formatTimestamp(item.timestamp, locale)}
					{@const name = l[item.status]}
					<Tooltip delay={150}>
						<TooltipTrigger
							data-bar=""
							tabindex={i === active ? 0 : -1}
							aria-label={when ? `${when}: ${name}` : name}
							onfocus={() => (focusIndex = i)}
							class={cn(s.bar(), tone.bar())}
						/>
						<TooltipContent side="bottom" sideOffset={8}>
							<div class={s.tip()}>
								<div class={cn(s.tipHead(), tone.text())}>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										aria-hidden="true"
										class="size-4 shrink-0"
									>
										{#each STATUS_ICON[item.status] as d (d)}<path {d} />{/each}
									</svg>
									{name}
								</div>
								{#if when}<div class={s.tipMeta()}>{when}</div>{/if}
								<div class={s.tipInfo()}>{item.info ?? l[`${item.status}Info`]}</div>
							</div>
						</TooltipContent>
					</Tooltip>
				{/each}
			</div>
		</TooltipProvider>
		<div class={s.footer()}>
			<span>{slots} {l[unit]} {l.ago}</span>
			<span>{l.current}</span>
		</div>
	</div>
</div>
