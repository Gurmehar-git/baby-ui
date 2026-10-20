"use client";

import {
	PaymentMethodCard,
	PaymentMethodCardAction,
	PaymentMethodCardContent,
	PaymentMethodCardDetails,
	PaymentMethodCardError,
	PaymentMethodCardMark,
	PaymentMethodCardTitle,
	type PaymentMethodCardVariant,
	type PaymentMethodStatus,
} from "@baby-ui/react";
import { useEffect, useState } from "react";
import {
	type PaymentMethodSample,
	paymentMethodSample,
} from "../data/payment-method-card";

type Props = Record<string, unknown>;

export function PaymentMethodCardDemo({ props }: { props: Props }) {
	const [now] = useState(() => new Date());
	const [status, setStatus] = useState<PaymentMethodStatus>("idle");

	useEffect(() => {
		const next = props.status;
		if (next === "idle" || next === "redirecting" || next === "error") setStatus(next);
	}, [props.status]);

	// A real parent redirects to the provider's portal here.
	const update = () => {
		setStatus("redirecting");
		setTimeout(() => setStatus("idle"), 1500);
	};

	const variant = (props.variant as PaymentMethodCardVariant) ?? "card";

	return (
		<div className="w-full max-w-md">
			<PaymentMethodCard
				method={paymentMethodSample((props.method as PaymentMethodSample) ?? "visa", now)}
				now={now}
				status={status}
				variant={variant}
			>
				{variant === "card" ? <PaymentMethodCardTitle /> : null}
				<PaymentMethodCardContent>
					<PaymentMethodCardMark />
					<PaymentMethodCardDetails />
					<PaymentMethodCardAction onClick={update} />
				</PaymentMethodCardContent>
				<PaymentMethodCardError />
			</PaymentMethodCard>
		</div>
	);
}
