<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import Button from "../../button/svelte/button.svelte";
import Card from "../../card/svelte/card.svelte";
import { cn } from "../../lib/cn";
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";
import {
	digitDelay,
	PRICING_02_LABELS,
	type Pricing02Labels,
	type Pricing02Period,
	type Pricing02Plan,
} from "../types";
import { type Pricing02Variant, pricing02 } from "../variants";

type Props = Omit<HTMLAttributes<HTMLElement>, "title"> & {
	plans: Pricing02Plan[];
	/** Billing periods; the toggle shows when there are two or more. */
	periods: Pricing02Period[];
	/** Bindable. */
	period?: string;
	onPeriodChange?: (period: string) => void;
	/** Called by a plan's button when the plan has no `href`. */
	onSelect?: (planId: string, period: string) => void;
	eyebrow?: string;
	/** Line breaks in the string are kept. */
	title?: string;
	description?: string;
	/** Small print under the plans. */
	footnotes?: string[];
	variant?: Pricing02Variant;
	labels?: Partial<Pricing02Labels>;
};

let {
	plans,
	periods,
	period = $bindable(),
	onPeriodChange,
	onSelect,
	eyebrow,
	title,
	description,
	footnotes,
	variant = "soft",
	labels,
	class: classProp,
	...rest
}: Props = $props();

const ARROW = ["M5 12l14 0", "M13 18l6 -6", "M13 6l6 6"];

const currentIndex = $derived(
	Math.max(
		0,
		periods.findIndex((p) => p.value === period),
	),
);
const current = $derived(periods[currentIndex]);
const l = $derived({ ...PRICING_02_LABELS, ...labels });
const s = $derived(pricing02({ variant }));

// Digits only roll once the period has changed, never on first paint.
let initial: string | undefined;
let seen = false;
let changed = false;
const moved = $derived.by(() => {
	const value = current?.value;
	if (!seen) {
		seen = true;
		initial = value;
	} else if (value !== initial) changed = true;
	return changed;
});

function setPeriod(next: string) {
	if (!next) return;
	period = next;
	onPeriodChange?.(next);
}
</script>

{#snippet arrow()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class={s.arrow()}
	>
		{#each ARROW as d (d)}<path {d} />{/each}
	</svg>
{/snippet}

<section data-slot="pricing-02" class={cn(s.root(), classProp)} {...rest}>
	<div class={s.inner()}>
		<div class={s.header()}>
			<div class={s.heading()}>
				{#if eyebrow}<p class={s.eyebrow()}>{eyebrow}</p>{/if}
				{#if title}<h2 class={s.title()}>{title}</h2>{/if}
			</div>
			<div class={s.aside()}>
				{#if description}<p class={s.description()}>{description}</p>{/if}
				{#if periods.length > 1}
					<ToggleGroup
						type="single"
						size="sm"
						bind:value={() => current?.value ?? "", (v) => setPeriod(v as string)}
						label={l.period}
					>
						{#each periods as p (p.value)}
							<ToggleGroupItem value={p.value}>{p.label}</ToggleGroupItem>
						{/each}
					</ToggleGroup>
				{/if}
			</div>
		</div>

		<div class={s.plans()}>
			{#each plans as plan (plan.id)}
				{@const f = pricing02({ variant, featured: plan.featured ?? false })}
				{@const price = current ? (plan.prices[current.value] ?? "") : ""}
				{@const chars = [...price]}
				{@const label = plan.cta ?? `${l.choose} ${plan.name}`}
				{@const buttonVariant = plan.featured ? "default" : "outline"}
				<Card class={s.plan()}>
					<div aria-hidden="true" class={s.glow()}></div>
					<div class={f.panel()}>
						<p class={s.name()}>{plan.name}</p>
						{#if plan.description}<p class={s.blurb()}>{plan.description}</p>{/if}
						<div class={s.price()}>
							<span class="sr-only">{price}</span>
							<span aria-hidden="true" class={s.amount()} style:--digit-dir={currentIndex > 0 ? 1 : -1}>
								{#key current?.value}
									{#each chars as char, i (i)}
										<span
											data-animate={moved ? "" : undefined}
											class={s.digit()}
											style:--digit-delay={digitDelay(i, chars.length)}>{char}</span
										>
									{/each}
								{/key}
							</span>
							{#if current}<span class={s.cadence()}>{current.cadence}</span>{/if}
						</div>
						{#if plan.href !== undefined}
							<Button href={plan.href} variant={buttonVariant} class={s.cta()}>
								{label}
								{@render arrow()}
							</Button>
						{:else if onSelect}
							<Button
								variant={buttonVariant}
								class={s.cta()}
								onclick={() => onSelect?.(plan.id, current?.value ?? "")}
							>
								{label}
								{@render arrow()}
							</Button>
						{/if}
					</div>
					<div class={s.list()}>
						{#if plan.featuresLabel}<p class={s.listLabel()}>{plan.featuresLabel}</p>{/if}
						<ul class={s.features()}>
							{#each plan.features as feature (feature)}
								<li class={s.feature()}>
									<span class={s.tick()}>
										<svg
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											aria-hidden="true"
											class="size-3"
										>
											<path d="M5 12l5 5l10 -10" />
										</svg>
									</span>
									{feature}
								</li>
							{/each}
						</ul>
					</div>
				</Card>
			{/each}
		</div>

		{#if footnotes?.length}
			<div class={s.footnotes()}>
				{#each footnotes as note (note)}<p>{note}</p>{/each}
			</div>
		{/if}
	</div>
</section>
