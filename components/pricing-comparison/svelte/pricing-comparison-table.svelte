<script lang="ts">
import type { HTMLTableAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { comparisonValue } from "../pricing-comparison-core";
import { pricingComparisonState } from "./context";
import Mark from "./pricing-comparison-mark.svelte";

let { class: classProp, ...rest }: Omit<HTMLTableAttributes, "children"> = $props();

const ctx = pricingComparisonState("PricingComparisonTable");
const s = $derived(ctx.styles);
const rowId = (g: number, r: number) => `${ctx.id}-g${g}-r${r}`;
</script>

<!-- The full matrix from a 42rem container up; groups fold by grid rows. -->
<table data-slot="pricing-comparison-table" class={cn(s.table(), classProp)} {...rest}>
	<caption class="sr-only">{ctx.labels.caption}</caption>
	<colgroup>
		<col class="w-[34%]" />
		{#each ctx.plans as plan (plan.id)}<col />{/each}
	</colgroup>
	<thead class={s.head()}>
		<tr>
			<th scope="col" class={s.corner()}>{ctx.labels.feature}</th>
			{#each ctx.plans as plan (plan.id)}
				<th scope="col" class={cn(s.planHead(), plan.highlighted && [s.highlight(), s.highlightTop()])}>{plan.name}</th>
			{/each}
		</tr>
	</thead>
	{#each ctx.groups as group, g (group.label)}
		{@const open = !ctx.collapsedGroups.includes(group.label)}
		{@const shown = ctx.groupShown(group)}
		<tbody data-slot="pricing-comparison-group">
			<tr aria-hidden={!shown || undefined} inert={!shown || undefined}>
				<th scope="rowgroup" class="p-0 text-left font-normal">
					<div class={s.collapse()} data-state={shown ? "open" : "closed"}>
						<div class={s.collapseInner()}>
							<div class={cn(s.cell(), g === 0 && "border-t-0")}>
								<button
									type="button"
									class={s.groupButton()}
									aria-expanded={open}
									aria-controls={group.rows.map((_, r) => rowId(g, r)).join(" ")}
									onclick={() => ctx.toggleGroup(group.label)}
								>
									<svg class={s.chevron()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M9 6l6 6l-6 6" />
									</svg>
									{group.label}
								</button>
							</div>
						</div>
					</div>
				</th>
				{#each ctx.plans as plan (plan.id)}
					<td class={cn("p-0", plan.highlighted && s.highlight())}>
						<div class={s.collapse()} data-state={shown ? "open" : "closed"}>
							<div class={s.collapseInner()}>
								<div class={cn(s.cell(), g === 0 && "border-t-0", "h-full")}>&nbsp;</div>
							</div>
						</div>
					</td>
				{/each}
			</tr>
			{#each group.rows as row, r (row.feature)}
				{@const visible = shown && open && ctx.rowShown(row)}
				<tr id={rowId(g, r)} aria-hidden={!visible || undefined} inert={!visible || undefined}>
					<th scope="row" class="p-0 text-left font-normal">
						<div class={s.collapse()} data-state={visible ? "open" : "closed"}>
							<div class={s.collapseInner()}>
								<div class={s.cell()}>
									<span class={s.feature()}>{row.feature}</span>
									{#if row.hint}<span class={s.hint()}>{row.hint}</span>{/if}
								</div>
							</div>
						</div>
					</th>
					{#each ctx.plans as plan (plan.id)}
						<td class={cn("p-0", plan.highlighted && s.highlight())}>
							<div class={s.collapse()} data-state={visible ? "open" : "closed"}>
								<div class={s.collapseInner()}>
									<div class={cn(s.cell(), s.value())}><Mark value={comparisonValue(row, plan.id)} /></div>
								</div>
							</div>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	{/each}
	<tfoot aria-hidden="true">
		<tr>
			<td class="h-3 p-0"></td>
			{#each ctx.plans as plan (plan.id)}
				<td class={cn("h-3 p-0", plan.highlighted && [s.highlight(), s.highlightEnd()])}></td>
			{/each}
		</tr>
	</tfoot>
</table>
