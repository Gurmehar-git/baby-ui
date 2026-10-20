<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import Tabs from "../../tabs/svelte/tabs.svelte";
import TabsContent from "../../tabs/svelte/tabs-content.svelte";
import TabsList from "../../tabs/svelte/tabs-list.svelte";
import TabsTrigger from "../../tabs/svelte/tabs-trigger.svelte";
import { comparisonValue } from "../pricing-comparison-core";
import { pricingComparisonState } from "./context";
import Mark from "./pricing-comparison-mark.svelte";

let {
	class: classProp,
	...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "children"> = $props();

const ctx = pricingComparisonState("PricingComparisonMobile");
const s = $derived(ctx.styles);
</script>

<!-- One plan at a time below a 42rem container, picked from underline tabs. -->
{#if ctx.plans.length > 0}
	<div data-slot="pricing-comparison-mobile" class={cn(s.mobile(), classProp)} {...rest}>
		<Tabs variant="underline" size="sm" bind:value={() => ctx.mobilePlan?.id ?? "", ctx.setActivePlan}>
			<TabsList aria-label={ctx.labels.choosePlan}>
				{#each ctx.plans as plan (plan.id)}
					<TabsTrigger value={plan.id}>{plan.name}</TabsTrigger>
				{/each}
			</TabsList>
			{#each ctx.plans as plan (plan.id)}
				<TabsContent value={plan.id}>
					{#each ctx.groups as group, g (group.label)}
						{@const shown = ctx.groupShown(group)}
						<div class={s.collapse()} data-state={shown ? "open" : "closed"} inert={!shown || undefined}>
							<div class={s.collapseInner()}>
								<h3 class={s.mobileGroupLabel()} id="{ctx.id}-m{plan.id}-g{g}">{group.label}</h3>
								<ul aria-labelledby="{ctx.id}-m{plan.id}-g{g}">
									{#each group.rows as row (row.feature)}
										{@const visible = ctx.rowShown(row)}
										<li class={s.collapse()} data-state={visible ? "open" : "closed"} inert={!visible || undefined}>
											<div class={s.collapseInner()}>
												<div class={s.mobileRow()}>
													<span>
														<span class={s.feature()}>{row.feature}</span>
														{#if row.hint}<span class={s.hint()}>{row.hint}</span>{/if}
													</span>
													<span class={s.mobileValue()}><Mark value={comparisonValue(row, plan.id)} /></span>
												</div>
											</div>
										</li>
									{/each}
								</ul>
							</div>
						</div>
					{/each}
				</TabsContent>
			{/each}
		</Tabs>
	</div>
{/if}
