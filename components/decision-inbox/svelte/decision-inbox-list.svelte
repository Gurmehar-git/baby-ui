<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { decisionInboxState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const ctx = decisionInboxState("DecisionInboxList");
</script>

<div data-slot="decision-inbox-list" {...rest} class={cn(ctx.styles.list(), classProp)}>
	{@render children?.()}
</div>
