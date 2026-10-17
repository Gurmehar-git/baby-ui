<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import Badge from "../../badge/svelte/badge.svelte";
import Button from "../../button/svelte/button.svelte";
import Card from "../../card/svelte/card.svelte";
import CardAction from "../../card/svelte/card-action.svelte";
import CardContent from "../../card/svelte/card-content.svelte";
import CardFooter from "../../card/svelte/card-footer.svelte";
import CardHeader from "../../card/svelte/card-header.svelte";
import { cn } from "../../lib/cn";
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";
import {
	PRICING_01_LABELS,
	type Pricing01Labels,
	type Pricing01Period,
	type Pricing01Plan,
} from "../types";
import { type Pricing01Variant, pricing01 } from "../variants";

type Props = Omit<HTMLAttributes<HTMLElement>, "title"> & {
	plans: Pricing01Plan[];
	/** Billing periods; the toggle shows when there are two or more. */
	periods: Pricing01Period[];
	/** Bindable. */
	period?: string;
	onPeriodChange?: (period: string) => void;
	/** Called by a plan's button when the plan has no `href`. */
	onSelect?: (planId: string, period: string) => void;
	eyebrow?: string;
	title?: string;
	description?: string;
	variant?: Pricing01Variant;
	labels?: Partial<Pricing01Labels>;
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
	variant = "default",
	labels,
	class: classProp,
	...rest
}: Props = $props();

const current = $derived(periods.find((p) => p.value === period) ?? periods[0]);
const l = $derived({ ...PRICING_01_LABELS, ...labels });
const s = $derived(pricing01({ variant }));

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
		<path d="M17 7l-10 10" />
		<path d="M8 7l9 0l0 9" />
	</svg>
{/snippet}

<section data-slot="pricing-01" class={cn(s.root(), classProp)} {...rest}>
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
				{@const f = pricing01({ variant, featured: plan.featured ?? false })}
				{@const label = plan.cta ?? `${l.choose} ${plan.name}`}
				<div data-featured={plan.featured || undefined} class={s.item()}>
					{#if plan.note}
						<p aria-hidden="true" class={s.note()}>{plan.note}</p>
					{/if}
					<Card {variant} class={f.card()}>
						<CardHeader>
							<p class={s.name()}>{plan.name}</p>
							{#if plan.badge}
								<CardAction>
									<Badge variant={plan.featured ? "default" : "outline"} size="sm">
										{plan.badge}
									</Badge>
								</CardAction>
							{/if}
							<div class={s.price()}>
								<span class={s.amount()}>{current ? plan.prices[current.value] : ""}</span>
								{#if current}<span class={s.cadence()}>{current.cadence}</span>{/if}
							</div>
						</CardHeader>
						<CardContent class={s.body()}>
							{#if plan.description}<p class={s.blurb()}>{plan.description}</p>{/if}
							<ul class={s.features()}>
								{#each plan.features as feature (feature)}
									<li class={s.feature()}>
										<svg
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											aria-hidden="true"
											class={s.check()}
										>
											<path d="M5 12l5 5l10 -10" />
										</svg>
										<span>{feature}</span>
									</li>
								{/each}
							</ul>
						</CardContent>
						{#if plan.href !== undefined}
							<CardFooter>
								<Button
									href={plan.href}
									variant={plan.featured ? "default" : "dark"}
									class={s.cta()}
								>
									{label}
									{@render arrow()}
								</Button>
							</CardFooter>
						{:else if onSelect}
							<CardFooter>
								<Button
									variant={plan.featured ? "default" : "dark"}
									class={s.cta()}
									onclick={() => onSelect?.(plan.id, current?.value ?? "")}
								>
									{label}
									{@render arrow()}
								</Button>
							</CardFooter>
						{/if}
					</Card>
				</div>
			{/each}
		</div>
	</div>
</section>
