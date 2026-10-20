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
} from "@baby-ui/react";
import { useState } from "react";

type Subscription = {
	plan: SubscriptionPlan;
	renewsAt: string;
	seats: SubscriptionSeats;
};

export function Billing({ subscription }: { subscription: Subscription }) {
	const [pending, setPending] = useState<SubscriptionPending | null>(null);

	async function cancel() {
		setPending("cancel");
		await fetch("/api/billing/cancel", { method: "POST" });
		setPending(null);
	}

	return (
		<SubscriptionCard
			plan={subscription.plan}
			renewsAt={subscription.renewsAt}
			now={new Date()}
			pending={pending}
		>
			<SubscriptionCardHeader>
				<SubscriptionCardTitle />
				<SubscriptionCardPrice />
			</SubscriptionCardHeader>
			<SubscriptionCardSchedule />
			<SubscriptionCardSeats
				used={subscription.seats.used}
				total={subscription.seats.total}
			/>
			<SubscriptionCardFooter>
				<SubscriptionCardManage
					onClick={() => window.location.assign("/api/billing/portal")}
				/>
				<SubscriptionCardChangePlan onClick={() => window.location.assign("/pricing")} />
				<SubscriptionCardCancel onClick={cancel} />
			</SubscriptionCardFooter>
		</SubscriptionCard>
	);
}
