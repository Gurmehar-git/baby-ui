<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type EmailDraftStatus, type EmailDraftVariant, emailDraft } from "../variants";
import { setEmailDraft } from "./context";

let {
	status = "draft",
	onSend,
	onDiscard,
	onUndo,
	variant = "tray",
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & {
	/** Where the draft is. Set it from your send flow: `sending`, then `sent`. */
	status?: EmailDraftStatus;
	onSend?: () => void;
	onDiscard?: () => void;
	onUndo?: () => void;
	variant?: EmailDraftVariant;
	children?: Snippet;
} = $props();

const styles = $derived(emailDraft({ variant }));
let editing = $state(false);
const pendingFocus: { current: "receipt" | "send" | null } = { current: null };

setEmailDraft({
	get status() {
		return status;
	},
	get editing() {
		return editing;
	},
	get styles() {
		return styles;
	},
	pendingFocus,
	setEditing(next) {
		editing = next;
	},
	send() {
		if (status !== "draft") return;
		editing = false;
		pendingFocus.current = "receipt";
		onSend?.();
	},
	discard() {
		editing = false;
		pendingFocus.current = "receipt";
		onDiscard?.();
	},
	undo() {
		pendingFocus.current = "send";
		onUndo?.();
	},
});
</script>

<!-- The root: an agent-written email waiting for review, with its status and decisions. -->
<article data-slot="email-draft" data-variant={variant} data-status={status} {...rest} class={cn(styles.root(), classProp)}>
	{@render children?.()}
</article>
