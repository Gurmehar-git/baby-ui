<script lang="ts">
import type { ComponentProps } from "svelte";
import { cn } from "../lib/cn";
import PopoverTrigger from "../popover/popover-trigger.svelte";
import { type ComboboxSize, combobox } from "./variants";

let {
	children,
	class: classProp,
	size = "default",
	...rest
}: ComponentProps<typeof PopoverTrigger> & { size?: ComboboxSize } = $props();
</script>

<PopoverTrigger
	{...rest}
	role="combobox"
	class={cn(combobox({ size }).trigger(), classProp)}
>
	{@render children?.()}
</PopoverTrigger>
