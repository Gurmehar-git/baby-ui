<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import {
	availableActions,
	SUBSCRIPTION_LABELS,
	type SubscriptionLabels,
	type SubscriptionPending,
	type SubscriptionPlan,
	scheduleLine,
} from "../subscription-core";
import { type SubscriptionCardVariant, subscriptionCard } from "../variants";
import { setSubscriptionCard } from "./context";

type DateInput = string | number | Date;

type Props = Omit<HTMLAttributes<HTMLElement>, "title" | "children"> & {
	plan: SubscriptionPlan;
	/** Next charge, for active recurring plans. */
	renewsAt?: DateInput;
	/** Access end, for canceled plans. */
	endsAt?: DateInput;
	trialEndsAt?: DateInput;
	/** The time relative dates are measured from; pass your own clock, the card keeps none. */
	now: DateInput;
	/** The action waiting on you; its button shows a loading state until you clear it. */
	pending?: SubscriptionPending | null;
	variant?: SubscriptionCardVariant;
	locale?: string;
	labels?: Partial<SubscriptionLabels>;
	children?: Snippet;
};

let {
	plan,
	renewsAt,
	endsAt,
	trialEndsAt,
	now,
	pending = null,
	variant = "card",
	locale,
	labels: labelOverrides,
	class: classProp,
	children,
	...rest
}: Props = $props();

const id = $props.id();
const labels = $derived({ ...SUBSCRIPTION_LABELS, ...labelOverrides });
const styles = $derived(subscriptionCard({ variant }));

setSubscriptionCard({
	id,
	get plan() {
		return plan;
	},
	get renewsAt() {
		return renewsAt;
	},
	get actions() {
		return availableActions({ plan, endsAt, now });
	},
	get schedule() {
		return scheduleLine({ plan, renewsAt, endsAt, trialEndsAt, now, locale, labels });
	},
	get pending() {
		return pending;
	},
	get locale() {
		return locale;
	},
	get labels() {
		return labels;
	},
	get styles() {
		return styles;
	},
});
</script>

<!-- The root: the plan, its dates and the pending action. Compose the header, schedule and actions inside. -->
<section
	data-slot="subscription-card"
	aria-labelledby={`${id}-name`}
	aria-busy={pending !== null || undefined}
	class={cn(styles.root(), classProp)}
	{...rest}
>
	{@render children?.()}
</section>
