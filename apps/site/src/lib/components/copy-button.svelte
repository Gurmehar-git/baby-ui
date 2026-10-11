<script lang="ts">
import { IconCheck, IconCopy } from "@baby-ui/icons";
import { type TrackEvent, track } from "#lib/analytics.js";

let {
	text,
	iconOnly = false,
	analytics = { event: "code_copied" },
	class: classProp,
}: {
	text: string;
	iconOnly?: boolean;
	analytics?: TrackEvent;
	class?: string;
} = $props();

let copied = $state(false);
let timer: ReturnType<typeof setTimeout>;

async function copy() {
	await navigator.clipboard.writeText(text);
	// The first line names the command or the import, enough to tell copies apart.
	const snippet = text.split("\n", 1)[0].slice(0, 120);
	track(analytics.event, { snippet, ...analytics.props });
	copied = true;
	clearTimeout(timer);
	timer = setTimeout(() => (copied = false), 1600);
}
</script>

<button
	type="button"
	onclick={copy}
	aria-label={copied ? "Copied" : "Copy to clipboard"}
	class={[
		"inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-border bg-card font-medium text-[11px] text-muted-foreground transition-[color,transform,scale,translate] duration-100 ease-[var(--ease-ui-out)] hover:text-foreground active:scale-[var(--press-scale)] active:duration-[var(--duration-press)]",
		iconOnly ? "w-7 justify-center pointer-coarse:size-10" : "px-2 pointer-coarse:h-10",
		classProp,
	]}
>
	{#if copied}
		<IconCheck size={13} />
		{#if !iconOnly}Copied{/if}
	{:else}
		<IconCopy size={13} />
		{#if !iconOnly}Copy{/if}
	{/if}
</button>
