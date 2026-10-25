<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { emailDraftState } from "./context";

let {
	label = "To",
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { label?: string; children?: Snippet } = $props();
const ctx = emailDraftState("EmailDraftTo");
</script>

<!-- "To" and the recipient: put a Select or a plain name inside. -->
<div data-slot="email-draft-to" {...rest} class={cn(ctx.styles.to(), classProp)}>
	<span class={ctx.styles.toLabel()}>{label}</span>
	{@render children?.()}
</div>
