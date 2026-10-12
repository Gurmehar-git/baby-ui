<script lang="ts">
import { Composer, type ComposerAction, type ComposerModel } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Composer>>(props));

let value = $state("");
let sent = $state("");
let model = $state("fast");
let loading = $state(false);

$effect(() => {
	loading = p.loading ?? false;
});
</script>

{#snippet fastIcon()}
	<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
		<path d="M8.5 1 3 9h4l-.5 6L13 7H9z" />
	</svg>
{/snippet}

{#snippet reasoningIcon()}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
		<path d="M12 2.8a5 5 0 0 0-2.8 9.1c.4.3.6.8.6 1.3v.4h4.4v-.4c0-.5.2-1 .6-1.3A5 5 0 0 0 12 2.8Z" />
		<path d="M9.6 16.2h4.8" stroke-linecap="round" />
	</svg>
{/snippet}

{#snippet attachIcon()}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<path d="M17 3a2.8 2.8 0 1 1 4 4L9.5 18.5a3 3 0 0 1-4.24-4.24L15 4.5" />
	</svg>
{/snippet}

{#snippet imageIcon()}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<rect x="3" y="4" width="18" height="16" rx="2" />
		<circle cx="8.5" cy="9.5" r="1.5" />
		<path d="m21 15-5-5-9 9" />
	</svg>
{/snippet}

<div class="flex w-full max-w-sm flex-col gap-2">
	<Composer
		bind:value
		bind:model
		placeholder={p.placeholder || "Send a message…"}
		size={p.size ?? "default"}
		{loading}
		onStop={() => (loading = false)}
		disabled={p.disabled ?? false}
		maxRows={Number(props.maxRows ?? 8)}
		models={[
			{ value: "fast", label: "Fast", icon: fastIcon },
			{ value: "reasoning", label: "Reasoning", icon: reasoningIcon },
		] as ComposerModel[]}
		actions={[
			{ value: "attach", label: "Attach file", description: "Upload a document for context", icon: attachIcon },
			{ value: "image", label: "Add image", description: "Attach a screenshot or photo", icon: imageIcon },
		] as ComposerAction[]}
		onSubmit={(text) => {
			sent = text;
			loading = true;
		}}
	/>
	{#if sent}<p class="text-muted-foreground text-xs">Sent: {sent}</p>{/if}
</div>
