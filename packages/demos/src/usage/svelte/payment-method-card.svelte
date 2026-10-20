<script lang="ts">
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
} from "@baby-ui/svelte";

let { method }: { method: PaymentMethod | null } = $props();
let status = $state<PaymentMethodStatus>("idle");

async function update() {
	status = "redirecting";
	const res = await fetch("/api/billing/portal", { method: "POST" });
	if (!res.ok) {
		status = "error";
		return;
	}
	window.location.href = (await res.json()).url;
}
</script>

<PaymentMethodCard {method} now={new Date()} {status}>
	<PaymentMethodCardTitle />
	<PaymentMethodCardContent>
		<PaymentMethodCardMark />
		<PaymentMethodCardDetails />
		<PaymentMethodCardAction onclick={update} />
	</PaymentMethodCardContent>
	<PaymentMethodCardError />
</PaymentMethodCard>
