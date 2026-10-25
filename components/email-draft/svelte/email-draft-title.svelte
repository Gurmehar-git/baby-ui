<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { emailDraftState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLHeadingElement> & { children?: Snippet } = $props();
const ctx = emailDraftState("EmailDraftTitle");
</script>

<h3 data-slot="email-draft-title" {...rest} class={cn(ctx.styles.title(), classProp)}>
	{@render children?.()}
</h3>
