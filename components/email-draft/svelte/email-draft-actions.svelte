<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { emailDraftState, isFolded } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const ctx = emailDraftState("EmailDraftActions");
const gone = $derived(isFolded(ctx.status));
</script>

<!-- Discard and Send; fold away once the email is out. -->
<div data-slot="email-draft-actions" data-folded={gone || undefined} inert={gone} class={cn(ctx.styles.actions(), classProp)}>
	<div class={ctx.styles.actionsClip()}>
		<div class={ctx.styles.actionsBody()}>{@render children?.()}</div>
	</div>
</div>
