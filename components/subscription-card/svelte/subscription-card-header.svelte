<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { subscriptionCardState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();

const ctx = subscriptionCardState("SubscriptionCardHeader");
</script>

<!-- Groups the title and the price. -->
<div data-slot="subscription-card-header" class={cn(ctx.styles.header(), classProp)} {...rest}>
	{@render children?.()}
</div>
