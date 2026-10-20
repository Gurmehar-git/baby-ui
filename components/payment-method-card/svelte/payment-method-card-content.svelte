<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { paymentMethodCardState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();

const ctx = paymentMethodCardState("PaymentMethodCardContent");
</script>

<!-- The row holding the mark, the details and the action. -->
<div data-slot="payment-method-card-content" class={cn(ctx.styles.content(), classProp)} {...rest}>
	{@render children?.()}
</div>
