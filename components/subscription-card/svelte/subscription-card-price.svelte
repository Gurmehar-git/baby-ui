<script lang="ts">
import { cn } from "../../lib/cn";
import { formatMoney, intervalLabel } from "../subscription-core";
import { subscriptionCardState } from "./context";

let { class: classProp }: { class?: string } = $props();

const ctx = subscriptionCardState("SubscriptionCardPrice");
</script>

<!-- The amount and its interval. -->
<p data-slot="subscription-card-price" class={cn(ctx.styles.price(), classProp)}>
	<span class={ctx.styles.amount()}>
		{formatMoney(ctx.plan.amount, ctx.plan.currency, ctx.locale)}
	</span>
	<span class={ctx.styles.interval()}>{intervalLabel(ctx.plan.interval, ctx.labels)}</span>
</p>
