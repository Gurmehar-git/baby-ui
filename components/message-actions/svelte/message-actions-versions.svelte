<script lang="ts">
import { cn } from "../../lib/cn";
import { MESSAGE_ICONS } from "../icons";
import { messageActionsState } from "./context";

let {
	value = $bindable(0),
	count,
	onValueChange,
	label = (index: number, total: number) => `Version ${index + 1} of ${total}`,
	class: classProp,
}: {
	/** The shown version, from 0. Bindable. */
	value?: number;
	count: number;
	onValueChange?: (value: number) => void;
	label?: (index: number, total: number) => string;
	class?: string;
} = $props();
const ctx = messageActionsState("MessageActionsVersions");

function go(next: number) {
	value = next;
	onValueChange?.(next);
	ctx.announce(label(next, count));
}
</script>

<!-- Steps between versions of the message; folds open once there are two. -->
<div data-slot="message-actions-versions" data-shown={count > 1 || undefined} class={cn(ctx.styles.versions(), classProp)}>
	<div class={ctx.styles.versionsClip()} inert={count < 2}>
		<button type="button" aria-label="Previous version" disabled={value <= 0} class={ctx.styles.button()} onclick={() => go(value - 1)}>
			<svg viewBox="0 0 24 24" aria-hidden="true" class={ctx.styles.icon()}><path d={MESSAGE_ICONS.prev} /></svg>
		</button>
		<span class={ctx.styles.versionLabel()}>
			<span aria-hidden="true">{value + 1} / {count}</span>
			<span class="sr-only">{label(value, count)}</span>
		</span>
		<button type="button" aria-label="Next version" disabled={value >= count - 1} class={ctx.styles.button()} onclick={() => go(value + 1)}>
			<svg viewBox="0 0 24 24" aria-hidden="true" class={ctx.styles.icon()}><path d={MESSAGE_ICONS.next} /></svg>
		</button>
	</div>
</div>
