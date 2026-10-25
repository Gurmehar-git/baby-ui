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
const ctx = emailDraftState("EmailDraftOptions");
</script>

<!-- The row under the text: tones, the edit button and the hint. -->
<div data-slot="email-draft-options" {...rest} class={cn(ctx.styles.options(), classProp)}>
	{@render children?.()}
</div>
