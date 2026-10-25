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
const ctx = emailDraftState("EmailDraftFields");
</script>

<!-- The row with the recipient and the attachment. -->
<div data-slot="email-draft-fields" {...rest} class={cn(ctx.styles.fields(), classProp)}>
	{@render children?.()}
</div>
