<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { notificationStackState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const ctx = notificationStackState("NotificationStackActions");
</script>

<div data-slot="notification-stack-actions" {...rest} class={cn(ctx.styles.actions(), classProp)}>
	{@render children?.()}
</div>
