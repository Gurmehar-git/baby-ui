<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { attachment } from "../variants";
import { attachmentState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLSpanElement> & {
	/** Shown once ready, e.g. "248 KB"; uploading and failed states write their own text. */
	children?: Snippet;
} = $props();

const ctx = attachmentState("AttachmentMeta");
const s = $derived(attachment({ variant: ctx.variant, status: ctx.status }));
</script>

<span data-slot="attachment-meta" class={cn(s.meta(), classProp)} {...rest}>
	{#if ctx.status === "uploading"}
		{ctx.labels.uploading} {Math.round(ctx.progress)}%
	{:else if ctx.status === "error"}
		{ctx.labels.error}
	{:else if children}
		{@render children()}
	{:else}
		{ctx.labels.ready}
	{/if}
</span>
