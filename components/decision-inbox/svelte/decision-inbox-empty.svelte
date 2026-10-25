<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { decisionInboxState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const ctx = decisionInboxState("DecisionInboxEmpty");
const shown = $derived(ctx.items.every((i) => ctx.answers[i] !== undefined));
</script>

<!-- Shown once every decision is answered, after the last one folds away. -->
<p data-slot="decision-inbox-empty" data-shown={shown || undefined} aria-hidden={!shown} class={cn(ctx.styles.empty(), classProp)}>
	<span class={ctx.styles.emptyClip()}><span class={ctx.styles.emptyText()}>{@render children?.()}</span></span>
</p>
