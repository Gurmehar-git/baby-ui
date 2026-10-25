<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { notificationStackState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();
const ctx = notificationStackState("NotificationStackDescription");
</script>

<p data-slot="notification-stack-description" {...rest} class={cn(ctx.styles.description(), classProp)}>
	{@render children?.()}
</p>
