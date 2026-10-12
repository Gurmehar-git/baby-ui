<script lang="ts">
import { cn } from "../lib/cn";
import RollingDigits from "../rolling-digits/rolling-digits.svelte";
import Sparkline from "../sparkline/sparkline.svelte";
import {
	distributionBars,
	type Stat,
	type StatBar,
	statFormat,
	uptimeBars,
	WORLD,
	worldDots,
} from "./stats";
import { type StatsBandVariant, statsBand } from "./variants";

let {
	stats,
	variant = "plain",
	title,
	description,
	locale,
	class: className,
}: {
	/** Three or four read best. */
	stats: Stat[];
	/** `plain` floats the stats on whitespace; `divided` sets them in a hairline grid. */
	variant?: StatsBandVariant;
	title?: string;
	description?: string;
	locale?: string;
	class?: string;
} = $props();

const uid = $props.id();
const s = $derived(statsBand({ variant }));
let root = $state<HTMLElement | null>(null);
let seen = $state(false);
$effect(() => {
	if (!root) return;
	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry?.isIntersecting) return;
			seen = true;
			observer.disconnect();
		},
		{ threshold: 0.3 },
	);
	observer.observe(root);
	return () => observer.disconnect();
});
const withVisuals = $derived(stats.some((stat) => stat.visual));
</script>

{#snippet bars(list: StatBar[], dense: boolean)}
	<div data-dense={dense} class={s.bars()}>
		{#each list as bar, index (index)}
			<span data-ink={bar.ink} class={s.bar()} style:--h={bar.height} style:--j={index / list.length}></span>
		{/each}
	</div>
{/snippet}

<section
	bind:this={root}
	data-slot="stats-band"
	data-variant={variant}
	data-seen={seen}
	aria-labelledby={title ? `${uid}-title` : undefined}
	aria-label={title ? undefined : "Key numbers"}
	class={cn(s.root(), className)}
>
	<div class={s.inner()}>
		{#if title || description}
			<header class={s.header()}>
				{#if title}<h2 id="{uid}-title" class={s.title()}>{title}</h2>{/if}
				{#if description}<p class={s.description()}>{description}</p>{/if}
			</header>
		{/if}
		<dl class={s.stats()} style:--count={Math.min(stats.length, 4)}>
			{#each stats as stat, index (stat.label)}
				{@const fmt = statFormat(stat, locale)}
				{@const suffix = `${fmt.unit}${stat.suffix ?? ""}`}
				<!-- Focus is how keyboard users reveal the context line. -->
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<div
					data-context={Boolean(stat.context && stat.detail)}
					tabindex={stat.context ? 0 : undefined}
					class={s.stat()}
					style:--i={index}
				>
					<dt class={s.label()}>{stat.label}</dt>
					<dd class={s.figure()}>
						{#if stat.prefix}<span class={s.affix()}>{stat.prefix}</span>{/if}
						<RollingDigits variant="count" value={stat.value} format={fmt.format} />
						{#if suffix}<span class={s.affix()}>{suffix}</span>{/if}
					</dd>
					{#if stat.detail || stat.context}
						<dd class={s.caption()}>
							{#if stat.detail}<span class={s.detail()}>{stat.detail}</span>{/if}
							{#if stat.context}<span class={s.context()}>{stat.context}</span>{/if}
						</dd>
					{/if}
					{#if withVisuals}
						<dd aria-hidden="true" class={s.visual()}>
							{#if stat.visual?.kind === "trend"}
								<Sparkline data={stat.visual.values} label={stat.label} interactive={false} height={40} />
							{:else if stat.visual?.kind === "uptime"}
								{@render bars(uptimeBars(stat.visual.days), true)}
							{:else if stat.visual?.kind === "distribution"}
								{@render bars(distributionBars(stat.visual.bins, stat.visual.max, stat.visual.marker), false)}
							{:else if stat.visual?.kind === "map"}
								<svg aria-hidden="true" viewBox="0 0 {WORLD.columns} {WORLD.rows}" class={s.map()}>
									{#each worldDots(stat.visual.points) as dot (dot.key)}
										<circle cx={dot.x} cy={dot.y} r={dot.lit ? 0.5 : 0.3} class={dot.lit ? s.lit() : s.land()} />
									{/each}
								</svg>
							{/if}
						</dd>
					{/if}
				</div>
			{/each}
		</dl>
	</div>
</section>
