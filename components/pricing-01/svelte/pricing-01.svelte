<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import type { Pricing01Period } from "../types";
import { type Pricing01Variant, pricing01 } from "../variants";
import { setPricing01 } from "./context";

let {
	periods,
	period = $bindable(),
	onPeriodChange,
	variant = "default",
	class: className,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & {
	/** Billing periods; Pricing01Periods shows a toggle when there are two or more. */
	periods: Pricing01Period[];
	/** Bindable. */
	period?: string;
	onPeriodChange?: (period: string) => void;
	variant?: Pricing01Variant;
	children?: Snippet;
} = $props();

const styles = $derived(pricing01({ variant }));
const current = $derived(periods.find((p) => p.value === period) ?? periods[0]);

setPricing01({
	get variant() {
		return variant;
	},
	get periods() {
		return periods;
	},
	get current() {
		return current;
	},
	get styles() {
		return styles;
	},
	setPeriod(next) {
		if (typeof next !== "string" || !next) return;
		period = next;
		onPeriodChange?.(next);
	},
});
</script>

<!-- Pricing01Header, then Pricing01Plans of Pricing01Plan cards whose price follows the period. -->
<section data-slot="pricing-01" {...rest} class={cn(styles.root(), className)}>
	<div class={styles.inner()}>{@render children?.()}</div>
</section>
