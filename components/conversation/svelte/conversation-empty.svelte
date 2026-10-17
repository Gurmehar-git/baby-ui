<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";

let {
	icon,
	title = "Start a conversation",
	description = "Ask a question or share what you're working on.",
	action,
	children,
	class: classProp,
}: {
	icon?: Snippet;
	title?: string;
	description?: string;
	action?: Snippet;
	children?: Snippet;
	class?: string;
} = $props();
</script>

<div
	data-slot="conversation-empty"
	class={cn("grid min-h-48 w-full place-items-center px-6 py-10 text-center", classProp)}
>
	{#if children}
		{@render children()}
	{:else}
		<div class="flex max-w-sm flex-col items-center">
			<div class="mb-4 flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
				{#if icon}
					{@render icon()}
				{:else}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true" class="size-[18px]">
						<path
							d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.9-.95L3 20l1.05-3.55A8.4 8.4 0 0 1 3.5 12 8.5 8.5 0 0 1 12 3.5a8.5 8.5 0 0 1 9 8Z"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{/if}
			</div>
			{#if title}
				<p class="font-medium text-foreground">{title}</p>
			{/if}
			{#if description}
				<p class="mt-1 max-w-xs text-muted-foreground text-sm leading-relaxed">{description}</p>
			{/if}
			{#if action}
				<div class="mt-4">{@render action()}</div>
			{/if}
		</div>
	{/if}
</div>
