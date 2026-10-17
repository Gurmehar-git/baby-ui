<script lang="ts">
import { cn } from "../../lib/cn";
import { type OgPricingMode, type OgPricingTone, ogPricing } from "../variants";

let {
	plan,
	price,
	features,
	period,
	compareAt,
	popular,
	note,
	brand,
	logo,
	mode = "light",
	tone = "neutral",
	class: className,
}: {
	/** Plan name above the price. */
	plan: string;
	/** Pre-formatted, e.g. "$29". */
	price: string;
	/** Up to four ticks; extras are dropped. */
	features: string[];
	/** e.g. "/month". */
	period?: string;
	/** Old price, struck through beside the period. */
	compareAt?: string;
	/** Label for the most popular treatment; passing it adds the ring, glow and badge. */
	popular?: string;
	note?: string;
	brand?: string;
	logo?: string;
	mode?: OgPricingMode;
	tone?: OgPricingTone;
	class?: string;
} = $props();

const s = $derived(ogPricing({ mode, tone, popular: Boolean(popular) }));
</script>

<div data-slot="og-pricing" class={cn(s.root(), className)}>
	<div class={s.ledger()}></div>
	<div class={s.glow()}></div>
	<div class={s.left()}>
		{#if brand || logo}
			<div class={s.brand()}>
				{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
				{#if brand}<span>{brand}</span>{/if}
			</div>
		{/if}
		<span class={s.plan()}>{plan}</span>
		<div class={s.priceRow()}>
			<span class={s.price()}>{price}</span>
			{#if compareAt || period}
				<div class={s.priceMeta()}>
					{#if compareAt}<span class={s.compare()}>{compareAt}</span>{/if}
					{#if period}<span class={s.period()}>{period}</span>{/if}
				</div>
			{/if}
		</div>
		{#if note}<p class={s.note()}>{note}</p>{/if}
	</div>
	<div class={s.card()}>
		{#if popular}
			<span class={s.popular()}><svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class={s.star()}
					aria-hidden="true"
				>
					<path
						d="M12 17.75l-6.17 3.24 1.18-6.87-5-4.87 6.9-1 3.09-6.25 3.09 6.25 6.9 1-5 4.87 1.18 6.87z"
					/>
				</svg>{popular}</span>
		{/if}
		{#each features.slice(0, 4) as feature (feature)}
			<div class={s.feature()}>
				<span class={s.tick()}>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class={s.check()}
						aria-hidden="true"
					>
						<path d="M5 12l5 5l10-10" />
					</svg>
				</span>
				<span class={s.featureText()}>{feature}</span>
			</div>
		{/each}
	</div>
</div>
