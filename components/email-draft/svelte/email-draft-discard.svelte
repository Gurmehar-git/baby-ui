<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { emailDraftState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const ctx = emailDraftState("EmailDraftDiscard");
</script>

<Button data-slot="email-draft-discard" variant="outline" size="sm" disabled={ctx.status === "sending"} class={classProp} onclick={() => ctx.discard()}>
	{#if children}{@render children()}{:else}Discard{/if}
</Button>
