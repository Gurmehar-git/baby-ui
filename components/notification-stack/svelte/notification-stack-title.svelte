<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { notificationStackItemState, notificationStackState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLHeadingElement> & { children?: Snippet } = $props();
const ctx = notificationStackState("NotificationStackTitle");
const item = notificationStackItemState("NotificationStackTitle");
</script>

<h3 data-slot="notification-stack-title" id={item.titleId} {...rest} class={cn(ctx.styles.title(), classProp)}>
	{@render children?.()}
</h3>
