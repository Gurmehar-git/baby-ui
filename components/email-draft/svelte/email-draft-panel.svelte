<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { emailDraftState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const ctx = emailDraftState("EmailDraftPanel");
</script>

<!-- The raised surface under the header that holds the email, the receipt and the footer. -->
<div data-slot="email-draft-panel" {...rest} class={cn(ctx.styles.panel(), classProp)}>
	{@render children?.()}
</div>
