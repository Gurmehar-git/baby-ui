<script lang="ts">
import Badge from "../../badge/svelte/badge.svelte";
import { cn } from "../../lib/cn";
import { expiryLabel, isCard } from "../payment-method-core";
import { paymentMethodCardState } from "./context";

let { class: classProp }: { class?: string } = $props();

const ctx = paymentMethodCardState("PaymentMethodCardDetails");
</script>

<!-- Card number and expiry, the wallet account, or the empty-state copy. -->
<div data-slot="payment-method-card-details" class={cn(ctx.styles.details(), classProp)}>
	{#if !ctx.method}
		<p class={ctx.styles.primary()}>{ctx.labels.empty}</p>
		<p class={ctx.styles.secondary()}>{ctx.labels.emptyHint}</p>
	{:else if isCard(ctx.method)}
		{@const method = ctx.method}
		<p class={ctx.styles.primary()}>
			{ctx.labels.cardLine(ctx.labels.brand[method.brand], method.last4)}
			{#if ctx.expiry === "soon"}
				<Badge variant="warning" size="sm">{ctx.labels.soonBadge}</Badge>
			{:else if ctx.expiry === "expired"}
				<Badge variant="destructive" size="sm">{ctx.labels.expiredBadge}</Badge>
			{/if}
		</p>
		<p class={ctx.styles.secondary()}>
			{ctx.expiry === "expired"
				? ctx.labels.expired(expiryLabel(method, ctx.locale))
				: ctx.labels.expires(expiryLabel(method, ctx.locale))}
		</p>
	{:else}
		<p class={ctx.styles.primary()}>{ctx.labels.brand[ctx.method.type]}</p>
		<p class={ctx.styles.secondary()}>{ctx.method.email}</p>
	{/if}
</div>
