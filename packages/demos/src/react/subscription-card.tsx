"use client";

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
} from "@baby-ui/react";
import { useEffect, useState } from "react";
import {
	daysFrom,
	SUBSCRIPTION_SCENARIOS,
	type SubscriptionScenario,
} from "../data/subscription-card";

type Props = Record<string, unknown>;

export function SubscriptionCardDemo({ props }: { props: Props }) {
	const [now] = useState(() => new Date());
	const preset =
		SUBSCRIPTION_SCENARIOS[(props.plan as SubscriptionScenario) ?? "team"] ??
		SUBSCRIPTION_SCENARIOS.team;
	const [plan, setPlan] = useState<SubscriptionPlan>(preset.plan);
	const [pending, setPending] = useState<SubscriptionPending | null>(null);

	useEffect(() => {
		setPlan(preset.plan);
		setPending(null);
	}, [preset]);

	// Stands in for the provider round trip; a real parent awaits its API or redirects.
	const run = (action: SubscriptionPending, then?: () => void) => {
		setPending(action);
		setTimeout(() => {
			setPending(null);
			then?.();
		}, 1200);
	};

	const renewsAt =
		preset.renewsIn === undefined ? undefined : daysFrom(now, preset.renewsIn);
	const endsAt =
		preset.endsIn !== undefined
			? daysFrom(now, preset.endsIn)
			: plan.status === "canceled"
				? renewsAt
				: undefined;

	const variant = (props.variant as SubscriptionCardVariant) ?? "card";

	return (
		<div className="w-full max-w-md">
			<SubscriptionCard
				plan={plan}
				now={now}
				renewsAt={renewsAt}
				endsAt={endsAt}
				trialEndsAt={
					preset.trialEndsIn === undefined ? undefined : daysFrom(now, preset.trialEndsIn)
				}
				pending={pending}
				variant={variant}
			>
				<SubscriptionCardHeader>
					<SubscriptionCardTitle />
					<SubscriptionCardPrice />
				</SubscriptionCardHeader>
				<SubscriptionCardSchedule />
				<SubscriptionCardAlert
					onUpdatePayment={() =>
						run("payment", () => setPlan((p) => ({ ...p, status: "active" })))
					}
				/>
				{preset.seats && variant === "card" ? (
					<SubscriptionCardSeats used={preset.seats.used} total={preset.seats.total} />
				) : null}
				<SubscriptionCardFooter>
					<SubscriptionCardManage onClick={() => run("manage")} />
					<SubscriptionCardChangePlan onClick={() => run("change")} />
					<SubscriptionCardResume
						onClick={() =>
							run("resume", () => setPlan((p) => ({ ...p, status: "active" })))
						}
					/>
					<SubscriptionCardCancel
						onClick={() =>
							run("cancel", () => setPlan((p) => ({ ...p, status: "canceled" })))
						}
					/>
				</SubscriptionCardFooter>
			</SubscriptionCard>
		</div>
	);
}
