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

const ctx = subscriptionCardState("SubscriptionCardFooter");
</script>

<!-- The action row; hides itself when none of its actions apply. -->
<div data-slot="subscription-card-footer" class={cn(ctx.styles.footer(), classProp)} {...rest}>
	{@render children?.()}
</div>
