<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import { planPriceLabel } from "../pricing-plans-core";
import { pricingPlans } from "../variants";
import { pricingPlanState, pricingPlansState } from "./context";

let {
	class: classProp,
	...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "children"> = $props();

const ctx = pricingPlansState("PricingPlanPrice");
const item = pricingPlanState("PricingPlanPrice");
const s = $derived(pricingPlans({ layout: ctx.layout, size: ctx.size }));
const l = $derived(ctx.labels);
</script>

<!-- The price for the active cycle, rolling digit by digit on a switch, with its billing note. -->
<div data-slot="pricing-plan-price" class={classProp} {...rest}>
	{#if item.price || item.custom}
		<span class="sr-only">{planPriceLabel(item.plan, ctx.active, l, ctx.currency, ctx.locale)}</span>
	{/if}
	<div class={s.price()} aria-hidden="true">
		{#if item.price}
			<RollingDigits value={item.price.cents} format={ctx.money} startOnView={false} class={s.amount()} />
			<span class={s.cadence()}>{ctx.active === "lifetime" ? l.oneTime : l.perMonth}</span>
		{:else}
			<span class={s.amount()}>{item.custom ? l.custom : " "}</span>
		{/if}
	</div>
	<p class={s.note()}>
		{#if item.custom}
			{l.customNote}
		{:else if !item.price}
			{l.unavailable}
		{:else if item.price.billedCents !== undefined}
			<span>{ctx.money(item.price.billedCents)} {l.billedYearly}</span>
			{#if item.price.savePercent}<span class={s.save()}>{l.save} {item.price.savePercent}%</span>{/if}
		{:else if ctx.active === "lifetime"}
			{l.includesUpdates}
		{/if}
	</p>
	{#if item.plan.seats}<p class={s.note()}>{item.plan.seats}</p>{/if}
</div>
