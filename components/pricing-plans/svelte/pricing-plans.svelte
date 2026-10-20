<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import {
	availableCycles,
	describePlanPrice,
	formatPlanMoney,
	PRICING_PLANS_LABELS,
	type PricingCycle,
	type PricingPlanOption,
	type PricingPlansLabels,
} from "../pricing-plans-core";
import {
	type PricingPlansLayout,
	type PricingPlansSize,
	pricingPlans,
} from "../variants";
import { setPricingPlans } from "./context";

type Props = Omit<HTMLAttributes<HTMLElement>, "title" | "children"> & {
	plans: PricingPlanOption[];
	/** Bindable. Falls back to the first cycle any plan is priced on. */
	cycle?: PricingCycle;
	onCycleChange?: (cycle: PricingCycle) => void;
	/** Called by a plan's action; redirect to hosted checkout from here. */
	onSelect?: (planId: string, cycle: PricingCycle) => void;
	/** The plan whose checkout is opening; its action spins and the others disable. */
	loadingPlanId?: string | null;
	currency?: string;
	locale?: string;
	layout?: PricingPlansLayout;
	size?: PricingPlansSize;
	labels?: Partial<PricingPlansLabels>;
	children?: Snippet;
};

let {
	plans,
	cycle = $bindable(),
	onCycleChange,
	onSelect,
	loadingPlanId = null,
	currency = "USD",
	locale,
	layout = "cards",
	size = "default",
	labels: labelsProp,
	class: classProp,
	children,
	...rest
}: Props = $props();

const id = $props.id();
const labels = $derived({ ...PRICING_PLANS_LABELS, ...labelsProp });
const cycles = $derived(availableCycles(plans));
const active = $derived<PricingCycle>(
	cycle && cycles.includes(cycle) ? cycle : (cycles[0] ?? "monthly"),
);
// Empty until the first change, so the summary is announced on a cycle switch, not on load.
let announcement = $state("");
let settled = false;
$effect(() => {
	const text = plans
		.map((plan) => describePlanPrice(plan, active, labels, currency, locale))
		.join(". ");
	if (settled) announcement = text;
	settled = true;
});

setPricingPlans({
	id,
	get plans() {
		return plans;
	},
	get cycles() {
		return cycles;
	},
	get active() {
		return active;
	},
	setCycle: (next) => {
		if (next === active) return;
		cycle = next;
		onCycleChange?.(next);
	},
	money: (cents) => formatPlanMoney(cents, currency, locale),
	get labels() {
		return labels;
	},
	get layout() {
		return layout;
	},
	get size() {
		return size;
	},
	get currency() {
		return currency;
	},
	get locale() {
		return locale;
	},
	get onSelect() {
		return onSelect;
	},
	get loadingPlanId() {
		return loadingPlanId;
	},
});
</script>

<section
	data-slot="pricing-plans"
	data-layout={layout}
	class={cn(pricingPlans({ layout, size }).root(), classProp)}
	{...rest}
>
	{@render children?.()}
	<p class="sr-only" aria-live="polite">{announcement}</p>
</section>
