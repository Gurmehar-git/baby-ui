import {
	type PaymentMethod,
	PaymentMethodCard,
	PaymentMethodCardAction,
	PaymentMethodCardContent,
	PaymentMethodCardDetails,
	PaymentMethodCardError,
	PaymentMethodCardMark,
	PaymentMethodCardTitle,
	type PaymentMethodStatus,
} from "@baby-ui/react";
import { useState } from "react";

export function BillingMethod({ method }: { method: PaymentMethod | null }) {
	const [status, setStatus] = useState<PaymentMethodStatus>("idle");

	async function update() {
		setStatus("redirecting");
		const res = await fetch("/api/billing/portal", { method: "POST" });
		if (!res.ok) return setStatus("error");
		window.location.assign((await res.json()).url);
	}

	return (
		<PaymentMethodCard method={method} now={new Date()} status={status}>
			<PaymentMethodCardTitle />
			<PaymentMethodCardContent>
				<PaymentMethodCardMark />
				<PaymentMethodCardDetails />
				<PaymentMethodCardAction onClick={update} />
			</PaymentMethodCardContent>
			<PaymentMethodCardError />
		</PaymentMethodCard>
	);
}
