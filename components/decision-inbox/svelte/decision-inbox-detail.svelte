<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { decisionInboxState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();
const ctx = decisionInboxState("DecisionInboxDetail");
</script>

<p data-slot="decision-inbox-detail" {...rest} class={cn(ctx.styles.detail(), classProp)}>
	{@render children?.()}
</p>
