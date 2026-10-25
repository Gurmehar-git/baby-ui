<script lang="ts">
import { cn } from "../../lib/cn";
import { MESSAGE_ICONS } from "../icons";
import { messageActionsState } from "./context";

let {
	label = "Regenerate",
	loading = false,
	onclick,
	class: classProp,
}: {
	label?: string;
	/** A new version is being written. */
	loading?: boolean;
	onclick?: () => void;
	class?: string;
} = $props();
const ctx = messageActionsState("MessageActionsRegenerate");
let turns = $state(0);
</script>

<!-- Asks for a new version. The arrow turns once per press, and keeps turning while `loading`. -->
<button
	type="button"
	data-slot="message-actions-regenerate"
	aria-label={label}
	aria-busy={loading || undefined}
	class={cn(ctx.styles.button(), classProp)}
	onclick={() => {
		turns += 1;
		onclick?.();
	}}
>
	<span
		data-motion={loading ? "explanatory" : undefined}
		class={cn("grid place-items-center", loading ? "animate-spin" : ctx.styles.spin())}
		style:rotate={loading ? undefined : `${turns * 360}deg`}
	>
		<svg viewBox="0 0 24 24" aria-hidden="true" class={ctx.styles.icon()}><path d={MESSAGE_ICONS.redo} /></svg>
	</span>
</button>
