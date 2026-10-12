<script lang="ts">
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof ResizablePanelGroup>>(props));
let sizes = $state<number[]>([22, 48, 30]);
const pane = "grid h-full content-start gap-1 p-4 text-sm";
</script>

<div class="grid w-full max-w-3xl gap-2">
	<div class="h-72">
		<ResizablePanelGroup aria-label="Mail" variant={p.variant ?? "bordered"} onLayoutChange={(next) => (sizes = next)}>
			<ResizablePanel id="folders" label="Folders" defaultSize={22} minSize={140} collapsible>
				<div class={pane}>
					<strong>Folders</strong>
					<span class="text-muted-foreground">Inbox, Sent, Archive</span>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel id="messages" label="Messages" defaultSize={48} minSize={200}>
				<div class={pane}>
					<strong>Messages</strong>
					<span class="text-muted-foreground">Drag a divider, flick it to an edge, or focus it and use the arrow keys.</span>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel id="preview" label="Preview" defaultSize={30} minSize={160} collapsible>
				<div class={pane}>
					<strong>Preview</strong>
					<span class="text-muted-foreground">Double-click a divider to reset.</span>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	</div>
	<p class="text-muted-foreground text-xs tabular-nums">{sizes.map((size) => `${Math.round(size)}%`).join(" · ")}</p>
</div>
