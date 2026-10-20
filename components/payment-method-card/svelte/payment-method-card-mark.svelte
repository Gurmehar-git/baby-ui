<script lang="ts">
import { cn } from "../../lib/cn";
import { BRAND_MARK, isCard } from "../payment-method-core";
import { paymentMethodCardState } from "./context";

let { class: classProp }: { class?: string } = $props();

const ctx = paymentMethodCardState("PaymentMethodCardMark");
</script>

<!-- The brand chip; renders nothing when no method is on file. -->
{#if ctx.method}
	<span aria-hidden="true" class={cn(ctx.styles.mark(), classProp)}>
		{BRAND_MARK[isCard(ctx.method) ? ctx.method.brand : ctx.method.type]}
	</span>
{/if}
