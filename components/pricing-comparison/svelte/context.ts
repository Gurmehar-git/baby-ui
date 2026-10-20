import { getContext, hasContext, setContext } from "svelte";
import type {
	ComparisonGroup,
	ComparisonPlan,
	ComparisonRow,
	PricingComparisonLabels,
} from "../pricing-comparison-core";
import type { pricingComparison } from "../variants";

export type PricingComparisonState = {
	id: string;
	plans: ComparisonPlan[];
	groups: ComparisonGroup[];
	labels: PricingComparisonLabels;
	styles: ReturnType<typeof pricingComparison>;
	differencesOnly: boolean;
	setDifferencesOnly: (next: boolean) => void;
	collapsedGroups: string[];
	toggleGroup: (label: string) => void;
	mobilePlan?: ComparisonPlan;
	setActivePlan: (next: string) => void;
	rowShown: (row: ComparisonRow) => boolean;
	groupShown: (group: ComparisonGroup) => boolean;
	nothingDiffers: boolean;
};

const KEY = Symbol("pricing-comparison");

/** The root's state behind getters, so every part reads the latest value. */
export const setPricingComparison = (state: PricingComparisonState) =>
	setContext(KEY, state);
export function pricingComparisonState(part: string): PricingComparisonState {
	if (!hasContext(KEY))
		throw new Error(`${part} must be used inside <PricingComparison>`);
	return getContext<PricingComparisonState>(KEY);
}
