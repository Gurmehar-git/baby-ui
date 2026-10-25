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
const ctx = emailDraftState("EmailDraftAmount");
</script>

<span data-slot="email-draft-amount" {...rest} class={cn(ctx.styles.amount(), classProp)}>
	{@render children?.()}
</span>
