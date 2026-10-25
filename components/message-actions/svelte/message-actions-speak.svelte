<script lang="ts">
import { cn } from "../../lib/cn";
import { MESSAGE_ICONS } from "../icons";
import { messageActionsState } from "./context";

let {
	pressed = $bindable(false),
	onPressedChange,
	label = "Read aloud",
	stopLabel = "Stop reading",
	class: classProp,
}: {
	/** Playing. Drive it from your speech player. Bindable. */
	pressed?: boolean;
	onPressedChange?: (pressed: boolean) => void;
	label?: string;
	stopLabel?: string;
	class?: string;
} = $props();
const ctx = messageActionsState("MessageActionsSpeak");
</script>

<!-- Reads the message aloud; the speaker becomes an equalizer while it plays. -->
<button
	type="button"
	data-slot="message-actions-speak"
	aria-label={pressed ? stopLabel : label}
	aria-pressed={pressed}
	class={cn(ctx.styles.button(), classProp)}
	onclick={() => {
		pressed = !pressed;
		onPressedChange?.(pressed);
	}}
>
	{#if pressed}
		<span aria-hidden="true" data-motion="explanatory" class={ctx.styles.equalizer()}>
			<span class={ctx.styles.speakBar()}></span>
			<span class={ctx.styles.speakBar()}></span>
			<span class={ctx.styles.speakBar()}></span>
		</span>
	{:else}
		<svg viewBox="0 0 24 24" aria-hidden="true" class={ctx.styles.icon()}><path d={MESSAGE_ICONS.speaker} /></svg>
	{/if}
</button>
