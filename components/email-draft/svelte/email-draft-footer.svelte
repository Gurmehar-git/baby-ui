<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { emailDraftState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & { children?: Snippet } = $props();
const ctx = emailDraftState("EmailDraftFooter");
</script>

<!-- The last row: who wrote it, its state, and the decision. -->
<footer data-slot="email-draft-footer" {...rest} class={cn(ctx.styles.footer(), classProp)}>
	{@render children?.()}
</footer>
