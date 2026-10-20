<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import {
	type ComparisonGroup,
	type ComparisonPlan,
	groupDiffers,
	PRICING_COMPARISON_LABELS,
	type PricingComparisonLabels,
	rowDiffers,
} from "../pricing-comparison-core";
import { type PricingComparisonDensity, pricingComparison } from "../variants";
import { setPricingComparison } from "./context";

type Props = Omit<HTMLAttributes<HTMLElement>, "title" | "children"> & {
	plans: ComparisonPlan[];
	groups: ComparisonGroup[];
	/** Bindable. Collapses rows that read the same on every plan. */
	differencesOnly?: boolean;
	onDifferencesOnlyChange?: (differencesOnly: boolean) => void;
	/** Bindable. Labels of the collapsed groups. */
	collapsedGroups?: string[];
	onCollapsedGroupsChange?: (collapsedGroups: string[]) => void;
	/** Bindable. The plan shown on narrow containers; defaults to the highlighted plan. */
	activePlanId?: string;
	onActivePlanChange?: (planId: string) => void;
	density?: PricingComparisonDensity;
	labels?: Partial<PricingComparisonLabels>;
	children?: Snippet;
};

let {
	plans,
	groups,
	differencesOnly = $bindable(false),
	onDifferencesOnlyChange,
	collapsedGroups = $bindable([]),
	onCollapsedGroupsChange,
	activePlanId = $bindable(),
	onActivePlanChange,
	density = "comfortable",
	labels: labelsProp,
	class: classProp,
	children,
	...rest
}: Props = $props();

const id = $props.id();
const styles = $derived(pricingComparison({ density }));
const planIds = $derived(plans.map((plan) => plan.id));
const mobilePlan = $derived(
	plans.find((plan) => plan.id === activePlanId) ??
		plans.find((plan) => plan.highlighted) ??
		plans[0],
);

setPricingComparison({
	id,
	get plans() {
		return plans;
	},
	get groups() {
		return groups;
	},
	get labels() {
		return { ...PRICING_COMPARISON_LABELS, ...labelsProp };
	},
	get styles() {
		return styles;
	},
	get differencesOnly() {
		return differencesOnly;
	},
	setDifferencesOnly: (next) => {
		differencesOnly = next;
		onDifferencesOnlyChange?.(next);
	},
	get collapsedGroups() {
		return collapsedGroups;
	},
	toggleGroup: (label) => {
		const next = collapsedGroups.includes(label)
			? collapsedGroups.filter((item) => item !== label)
			: [...collapsedGroups, label];
		collapsedGroups = next;
		onCollapsedGroupsChange?.(next);
	},
	get mobilePlan() {
		return mobilePlan;
	},
	setActivePlan: (next) => {
		if (!next || next === mobilePlan?.id) return;
		activePlanId = next;
		onActivePlanChange?.(next);
	},
	rowShown: (row) => !differencesOnly || rowDiffers(row, planIds),
	groupShown: (group) => !differencesOnly || groupDiffers(group, planIds),
	get nothingDiffers() {
		return differencesOnly && !groups.some((group) => groupDiffers(group, planIds));
	},
});
</script>

<!-- The root: the matrix data and its filters. Compose the toolbar, table, mobile view and empty note inside. -->
<section data-slot="pricing-comparison" class={cn(styles.root(), classProp)} {...rest}>
	{@render children?.()}
</section>
