<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { maxAnnualSavePercent } from "../pricing-plans-core";
import { pricingPlans } from "../variants";
import { pricingPlansState } from "./context";

let {
	class: classProp,
	...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "children"> = $props();

const ctx = pricingPlansState("PricingPlansCycle");
const s = $derived(pricingPlans({ layout: ctx.layout, size: ctx.size }));
const saveUpTo = $derived(maxAnnualSavePercent(ctx.plans));
const index = $derived(Math.max(0, ctx.cycles.indexOf(ctx.active)));
</script>

<!-- The billing cycle switch, with the best annual saving beside it; hidden with one cycle. -->
{#if ctx.cycles.length > 1}
	<div data-slot="pricing-plans-cycle" class={cn(s.bar(), classProp)} {...rest}>
		<fieldset class={s.cycles()}>
			<legend class="sr-only">{ctx.labels.cycle}</legend>
			<span
				aria-hidden="true"
				class={s.thumb()}
				style:width="calc((100% - 4px) / {ctx.cycles.length})"
				style:translate="{index * 100}% 0"
			></span>
			{#each ctx.cycles as option (option)}
				<label class={s.cycle()}>
					<input
						type="radio"
						class="sr-only"
						name="{ctx.id}-cycle"
						value={option}
						checked={option === ctx.active}
						onchange={() => ctx.setCycle(option)}
					/>
					{ctx.labels[option]}
				</label>
			{/each}
		</fieldset>
		{#if saveUpTo > 0 && ctx.cycles.includes("annual")}
			<span class={s.saveNote()}>{ctx.labels.saveUpTo.replace("{percent}", String(saveUpTo))}</span>
		{/if}
	</div>
{/if}
