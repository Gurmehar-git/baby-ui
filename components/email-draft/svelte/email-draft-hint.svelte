<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { emailDraftState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLSpanElement> & { children?: Snippet } = $props();
const ctx = emailDraftState("EmailDraftHint");
</script>

<!-- A quiet shortcut hint; hidden when the card is narrow. -->
<span data-slot="email-draft-hint" {...rest} class={cn(ctx.styles.hint(), classProp)}>
	{#if children}{@render children()}{:else}⌘ Enter to send{/if}
</span>
