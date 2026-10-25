<script lang="ts">
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof DropdownMenuContent>>(props));

let last = $state("");
</script>

<div class="flex flex-col items-center gap-3">
	<DropdownMenu>
		<DropdownMenuTrigger class="inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 font-medium text-foreground text-sm">Actions</DropdownMenuTrigger>
		<DropdownMenuContent size={p.size} side={p.side ?? "bottom"} align={p.align ?? "start"}>
			<DropdownMenuLabel>This file</DropdownMenuLabel>
			<DropdownMenuItem onclick={() => (last = "rename")}>
				Rename
				<DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
			</DropdownMenuItem>
			<DropdownMenuItem onclick={() => (last = "duplicate")}>
				Duplicate
				<DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
			</DropdownMenuItem>
			<DropdownMenuItem disabled>Archive</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuSub>
				<DropdownMenuSubTrigger>Arrange</DropdownMenuSubTrigger>
				<DropdownMenuSubContent>
					<DropdownMenuItem onclick={() => (last = "bring-to-front")}>Bring to front</DropdownMenuItem>
					<DropdownMenuItem onclick={() => (last = "bring-forward")}>Bring forward</DropdownMenuItem>
					<DropdownMenuItem onclick={() => (last = "send-backward")}>Send backward</DropdownMenuItem>
					<DropdownMenuItem onclick={() => (last = "send-to-back")}>Send to back</DropdownMenuItem>
				</DropdownMenuSubContent>
			</DropdownMenuSub>
			<DropdownMenuSeparator />
			<DropdownMenuItem destructive onclick={() => (last = "delete")}>
				Delete
				<DropdownMenuShortcut>⌫</DropdownMenuShortcut>
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
	{#if last}<p class="text-muted-foreground text-xs">Selected: {last}</p>{/if}
</div>
