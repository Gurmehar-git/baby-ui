<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
import { cn } from "../lib/cn";
import { attachmentState } from "./context";
import { attachment } from "./variants";

let {
	class: classProp,
	children,
	...rest
}: HTMLButtonAttributes & { children?: Snippet } = $props();

const ctx = attachmentState("AttachmentRetry");
</script>

<!-- Renders nothing unless the status is `error`. -->
{#if ctx.status === "error"}
	<button
		type="button"
		data-slot="attachment-retry"
		aria-label="{ctx.labels.retry} {ctx.name}"
		class={cn(attachment({ variant: ctx.variant }).action(), classProp)}
		{...rest}
	>
		{#if children}
			{@render children()}
		{:else}
			<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<path
					d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3h-3"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{/if}
	</button>
{/if}
