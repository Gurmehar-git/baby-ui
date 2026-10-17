<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import type { Pricing02Period } from "../types";
import { type Pricing02Variant, pricing02 } from "../variants";
import { setPricing02 } from "./context";

let {
	periods,
	period = $bindable(),
	onPeriodChange,
	variant = "soft",
	class: className,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & {
	/** Billing periods; Pricing02Periods shows a toggle when there are two or more. */
	periods: Pricing02Period[];
	/** Bindable. */
	period?: string;
	onPeriodChange?: (period: string) => void;
	variant?: Pricing02Variant;
	children?: Snippet;
} = $props();

const currentIndex = $derived(
	Math.max(
		0,
		periods.findIndex((p) => p.value === period),
	),
);
const current = $derived(periods[currentIndex]);
const styles = $derived(pricing02({ variant }));

// Digits only roll once the period has changed, never on first paint.
let initial: string | undefined;
let seen = false;
let changed = false;
const moved = $derived.by(() => {
	const value = current?.value;
	if (!seen) {
		seen = true;
		initial = value;
	} else if (value !== initial) changed = true;
	return changed;
});

setPricing02({
	get variant() {
		return variant;
	},
	get periods() {
		return periods;
	},
	get current() {
		return current;
	},
	get currentIndex() {
		return currentIndex;
	},
	get moved() {
		return moved;
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

<!-- Pricing02Header, Pricing02Plans whose price digits roll on a period change, then Pricing02Footnotes. -->
<section data-slot="pricing-02" {...rest} class={cn(styles.root(), className)}>
	<div class={styles.inner()}>{@render children?.()}</div>
</section>
