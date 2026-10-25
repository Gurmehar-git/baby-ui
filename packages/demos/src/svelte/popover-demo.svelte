<script lang="ts">
import {
	Button,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Switch,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof PopoverContent>>(props));

let autoDeploy = $state(true);
let comments = $state(false);

// Switch renders its own label; reversing the row puts the text first without a second one.
const ROW = "flex w-full flex-row-reverse items-center justify-between gap-4";
</script>

<Popover>
	<PopoverTrigger
		class="inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 font-medium text-foreground text-sm"
	>
		Deploy settings
	</PopoverTrigger>
	<PopoverContent
		size={p.size}
		side={p.side ?? "bottom"}
		sideOffset={Number(props.sideOffset ?? 4)}
		align={p.align ?? "center"}
	>
		<div class="flex flex-col gap-3">
			<Label>Preview branches</Label>
			<Switch bind:checked={autoDeploy} size="sm" label="Auto deploy" class={ROW} />
			<Switch bind:checked={comments} size="sm" label="Comment on PRs" class={ROW} />
			<Button size="sm" class="mt-1 w-full">Save</Button>
		</div>
	</PopoverContent>
</Popover>
