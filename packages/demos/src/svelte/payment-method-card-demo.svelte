<script lang="ts">
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
} from "@baby-ui/svelte";
import {
	type PaymentMethodSample,
	paymentMethodSample,
} from "../data/payment-method-card";

let { props = {} }: { props?: Record<string, unknown> } = $props();

const now = new Date();
let status = $state<PaymentMethodStatus>("idle");

$effect(() => {
	const next = props.status;
	if (next === "idle" || next === "redirecting" || next === "error") status = next;
});

// A real parent redirects to the provider's portal here.
function update() {
	status = "redirecting";
	setTimeout(() => (status = "idle"), 1500);
}

const variant = $derived((props.variant as PaymentMethodCardVariant) ?? "card");
</script>

<div class="w-full max-w-md">
	<PaymentMethodCard
		method={paymentMethodSample((props.method as PaymentMethodSample) ?? "visa", now)}
		{now}
		{status}
		{variant}
	>
		{#if variant === "card"}<PaymentMethodCardTitle />{/if}
		<PaymentMethodCardContent>
			<PaymentMethodCardMark />
			<PaymentMethodCardDetails />
			<PaymentMethodCardAction onclick={update} />
		</PaymentMethodCardContent>
		<PaymentMethodCardError />
	</PaymentMethodCard>
</div>
