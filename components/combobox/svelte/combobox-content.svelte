<script lang="ts">
import type { ComponentProps } from "svelte";
import Command from "../../command/svelte/command.svelte";
import { cn } from "../../lib/svelte/cn";
import PopoverContent from "../../popover/svelte/popover-content.svelte";
import { type ComboboxSize, combobox } from "./variants";

let {
	children,
	class: classProp,
	size = "default",
	...rest
}: ComponentProps<typeof PopoverContent> & { size?: ComboboxSize } = $props();

const c = $derived(combobox({ size }));
</script>

<PopoverContent {...rest} class={cn(c.content(), classProp)}>
	<Command class={c.list()}>
		{@render children?.()}
	</Command>
</PopoverContent>
