<script lang="ts">
import {
	SubscriptionCard,
	SubscriptionCardAlert,
	SubscriptionCardCancel,
	SubscriptionCardChangePlan,
	SubscriptionCardFooter,
	SubscriptionCardHeader,
	SubscriptionCardManage,
	SubscriptionCardPrice,
	SubscriptionCardResume,
	SubscriptionCardSchedule,
	SubscriptionCardSeats,
	SubscriptionCardTitle,
	type SubscriptionCardVariant,
	type SubscriptionPending,
	type SubscriptionPlan,
} from "@baby-ui/svelte";
import {
	daysFrom,
	SUBSCRIPTION_SCENARIOS,
	type SubscriptionScenario,
} from "../data/subscription-card";

let { props = {} }: { props?: Record<string, unknown> } = $props();

const now = new Date();
const preset = $derived(
	SUBSCRIPTION_SCENARIOS[(props.plan as SubscriptionScenario) ?? "team"] ??
		SUBSCRIPTION_SCENARIOS.team,
);
let plan = $state<SubscriptionPlan>(SUBSCRIPTION_SCENARIOS.team.plan);
let pending = $state<SubscriptionPending | null>(null);

$effect(() => {
	plan = preset.plan;
	pending = null;
});

// Stands in for the provider round trip; a real parent awaits its API or redirects.
function run(action: SubscriptionPending, then?: () => void) {
	pending = action;
	setTimeout(() => {
		pending = null;
		then?.();
	}, 1200);
}

const renewsAt = $derived(
	preset.renewsIn === undefined ? undefined : daysFrom(now, preset.renewsIn),
);
const endsAt = $derived(
	preset.endsIn !== undefined
		? daysFrom(now, preset.endsIn)
		: plan.status === "canceled"
			? renewsAt
			: undefined,
);
const variant = $derived((props.variant as SubscriptionCardVariant) ?? "card");
</script>

<div class="w-full max-w-md">
	<SubscriptionCard
		{plan}
		{now}
		{renewsAt}
		{endsAt}
		trialEndsAt={preset.trialEndsIn === undefined ? undefined : daysFrom(now, preset.trialEndsIn)}
		{pending}
		{variant}
	>
		<SubscriptionCardHeader>
			<SubscriptionCardTitle />
			<SubscriptionCardPrice />
		</SubscriptionCardHeader>
		<SubscriptionCardSchedule />
		<SubscriptionCardAlert
			onUpdatePayment={() => run("payment", () => (plan = { ...plan, status: "active" }))}
		/>
		{#if preset.seats && variant === "card"}
			<SubscriptionCardSeats used={preset.seats.used} total={preset.seats.total} />
		{/if}
		<SubscriptionCardFooter>
			<SubscriptionCardManage onclick={() => run("manage")} />
			<SubscriptionCardChangePlan onclick={() => run("change")} />
			<SubscriptionCardResume
				onclick={() => run("resume", () => (plan = { ...plan, status: "active" }))}
			/>
			<SubscriptionCardCancel
				onclick={() => run("cancel", () => (plan = { ...plan, status: "canceled" }))}
			/>
		</SubscriptionCardFooter>
	</SubscriptionCard>
</div>
