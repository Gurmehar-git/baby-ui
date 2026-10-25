<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { decisionInboxItemState, decisionInboxState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const ctx = decisionInboxState("DecisionInboxBody");
const item = decisionInboxItemState("DecisionInboxBody");
</script>

<!-- Detail and actions; folds open on grid rows when the row expands. -->
<div data-slot="decision-inbox-body" data-open={!item.collapsed || undefined} inert={item.collapsed} class={cn(ctx.styles.body(), classProp)}>
	<div class={ctx.styles.bodyClip()}>{@render children?.()}</div>
</div>
