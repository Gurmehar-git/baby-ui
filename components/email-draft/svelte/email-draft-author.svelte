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
const ctx = emailDraftState("EmailDraftAuthor");
</script>

<span data-slot="email-draft-author" {...rest} class={cn(ctx.styles.author(), classProp)}>
	{@render children?.()}
</span>
