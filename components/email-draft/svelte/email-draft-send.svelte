<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { emailDraftState } from "./context";

let {
	loadingLabel = "Sending",
	class: classProp,
	children,
}: { loadingLabel?: string; class?: string; children?: Snippet } = $props();
const ctx = emailDraftState("EmailDraftSend");
let ref = $state<HTMLElement | null>(null);

$effect(() => {
	if (ctx.status !== "draft" || ctx.pendingFocus.current !== "send") return;
	ctx.pendingFocus.current = null;
	ref?.focus();
});
</script>

<Button bind:ref data-slot="email-draft-send" size="sm" loading={ctx.status === "sending"} {loadingLabel} class={classProp} onclick={() => ctx.send()}>
	{#if children}{@render children()}{:else}Send email{/if}
</Button>
