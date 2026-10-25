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
const ctx = notificationStackState("NotificationStackHeader");
</script>

<div data-slot="notification-stack-header" {...rest} class={cn(ctx.styles.header(), classProp)}>
	{@render children?.()}
</div>
