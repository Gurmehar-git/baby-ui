<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import {
	type MessageActionsVariant,
	type MessageFeedback,
	messageActions,
} from "../variants";
import { setMessageActions } from "./context";

let {
	feedback = $bindable(null),
	onFeedbackChange,
	variant = "quiet",
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	/** The vote on this message. Bindable. */
	feedback?: MessageFeedback | null;
	onFeedbackChange?: (feedback: MessageFeedback | null) => void;
	variant?: MessageActionsVariant;
	children?: Snippet;
} = $props();

const styles = $derived(messageActions({ variant }));
let status = $state("");

setMessageActions({
	get feedback() {
		return feedback;
	},
	get styles() {
		return styles;
	},
	setFeedback(next) {
		feedback = next;
		onFeedbackChange?.(next);
	},
	announce(message) {
		// A trailing space makes a repeated message count as a change, so it is read again.
		status = status === message ? `${message} ` : message;
	},
});
</script>

<!-- The root: the vote on the message, and a polite status line for what the actions did. -->
<div data-slot="message-actions" data-variant={variant} {...rest} class={cn(styles.root(), classProp)}>
	{@render children?.()}
	<span role="status" class="sr-only">{status}</span>
</div>
