<script lang="ts">
import { Button, Shortcut } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Shortcut>>(props));

const variant = $derived(p.variant ?? "default");
const size = $derived(p.size ?? "default");
const joined = $derived(p.joined ?? false);
const combo = $derived(p.shortcut || "cmd+n");

const ROWS: [string, string][] = [
	["Search", "cmd+k"],
	["Toggle sidebar", "cmd+b"],
	["Settings", "cmd+,"],
];

let log = $state<string[]>([]);
function note(action: string) {
	log = [action, ...log].slice(0, 3);
}
</script>

<div class="flex w-full max-w-80 flex-col gap-3 text-sm">
	<div class="flex items-center gap-2">
		<Button variant="outline" size="sm" onclick={() => note("New file")}>
			New file
			<Shortcut shortcut={combo} {variant} {size} {joined} />
		</Button>
		<Button size="sm" onclick={() => note("Sent")}>
			Send
			<Shortcut shortcut="cmd+enter" />
		</Button>
	</div>
	<div class="divide-y divide-border rounded-xl border border-border">
		{#each ROWS as [label, keys] (keys)}
			<button
				type="button"
				onclick={() => note(label)}
				class="flex w-full items-center justify-between px-3 py-2 text-left text-foreground transition-colors hover:bg-foreground/[0.04]"
			>
				{label}
				<Shortcut shortcut={keys} variant="ghost" />
			</button>
		{/each}
	</div>
	<p class="min-h-4 text-muted-foreground text-xs">
		{log.length ? `Fired: ${log.join(", ")}` : "Press a shortcut or click a row"}
	</p>
</div>
