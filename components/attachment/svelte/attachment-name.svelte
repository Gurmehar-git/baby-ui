<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import { attachmentState } from "./context";
import { attachment } from "./variants";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLSpanElement> & { children?: Snippet } = $props();

const ctx = attachmentState("AttachmentName");
</script>

<!-- Defaults to the root's `name`. -->
<span
	data-slot="attachment-name"
	title={ctx.name}
	class={cn(attachment({ variant: ctx.variant }).name(), classProp)}
	{...rest}
>
	{#if children}{@render children()}{:else}{ctx.name}{/if}
</span>
