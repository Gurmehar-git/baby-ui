<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { emailDraftState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();
const ctx = emailDraftState("EmailDraftDescription");
</script>

<p data-slot="email-draft-description" {...rest} class={cn(ctx.styles.description(), classProp)}>
	{@render children?.()}
</p>
