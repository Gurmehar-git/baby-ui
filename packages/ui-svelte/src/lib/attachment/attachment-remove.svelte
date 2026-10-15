<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
import { cn } from "../lib/cn";
import { attachmentState } from "./context";
import { attachment } from "./variants";

let {
	class: classProp,
	onclick,
	children,
	...rest
}: HTMLButtonAttributes & { children?: Snippet } = $props();

const ctx = attachmentState("AttachmentRemove");
</script>

<!-- The attachment folds shut first, then `onclick` runs. -->
<button
	type="button"
	data-slot="attachment-remove"
	aria-label="{ctx.labels.remove} {ctx.name}"
	disabled={ctx.leaving}
	class={cn(attachment({ variant: ctx.variant }).action(), classProp)}
	onclick={(event) => ctx.leave(() => onclick?.(event))}
	{...rest}
>
	{#if children}
		{@render children()}
	{:else}
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
		</svg>
	{/if}
</button>
