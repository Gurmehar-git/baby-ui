<script lang="ts">
import {
	SubscriptionCard,
	SubscriptionCardCancel,
	SubscriptionCardChangePlan,
	SubscriptionCardFooter,
	SubscriptionCardHeader,
	SubscriptionCardManage,
	SubscriptionCardPrice,
	SubscriptionCardSchedule,
	SubscriptionCardSeats,
	SubscriptionCardTitle,
	type SubscriptionPending,
	type SubscriptionPlan,
	type SubscriptionSeats,
} from "@baby-ui/svelte";

type Subscription = {
	plan: SubscriptionPlan;
	renewsAt: string;
	seats: SubscriptionSeats;
};

let { subscription }: { subscription: Subscription } = $props();
let pending = $state<SubscriptionPending | null>(null);

async function cancel() {
	pending = "cancel";
	await fetch("/api/billing/cancel", { method: "POST" });
	pending = null;
}
</script>

<SubscriptionCard plan={subscription.plan} renewsAt={subscription.renewsAt} now={new Date()} {pending}>
	<SubscriptionCardHeader>
		<SubscriptionCardTitle />
		<SubscriptionCardPrice />
	</SubscriptionCardHeader>
	<SubscriptionCardSchedule />
	<SubscriptionCardSeats used={subscription.seats.used} total={subscription.seats.total} />
	<SubscriptionCardFooter>
		<SubscriptionCardManage onclick={() => (window.location.href = "/api/billing/portal")} />
		<SubscriptionCardChangePlan onclick={() => (window.location.href = "/pricing")} />
		<SubscriptionCardCancel onclick={cancel} />
	</SubscriptionCardFooter>
</SubscriptionCard>
