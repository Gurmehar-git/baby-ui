<script lang="ts">
import { cn } from "../../lib/cn";
import { notificationStackItemState, notificationStackState } from "./context";

let {
	label = "Dismiss",
	class: classProp,
}: {
	/** Prefixed to the notice's title for screen readers. */
	label?: string;
	class?: string;
} = $props();
const ctx = notificationStackState("NotificationStackDismiss");
const item = notificationStackItemState("NotificationStackDismiss");
</script>

<!-- Dismisses its notice; the next one moves to the front. -->
<button
	type="button"
	data-slot="notification-stack-dismiss"
	aria-label={label}
	aria-describedby={item.titleId}
	class={cn(ctx.styles.dismiss(), classProp)}
	onclick={(event) => ctx.dismiss(item.value, event.currentTarget)}
>
	<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true">
		<path d="m4 4 8 8M12 4l-8 8" />
	</svg>
</button>
