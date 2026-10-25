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
const ctx = emailDraftState("EmailDraftHeader");
</script>

<!-- The record the email is about: title, a status Badge, amount and description. -->
<header data-slot="email-draft-header" {...rest} class={cn(ctx.styles.header(), classProp)}>
	{@render children?.()}
</header>
