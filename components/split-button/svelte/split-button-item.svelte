<script lang="ts">
import type { ComponentProps } from "svelte";
import DropdownMenuItem from "../../dropdown-menu/svelte/dropdown-menu-item.svelte";
import { cn } from "../../lib/cn";
import { splitButtonState } from "./context";

let { class: classProp, ...rest }: ComponentProps<typeof DropdownMenuItem> = $props();
const group = splitButtonState();
</script>

<DropdownMenuItem {...rest} class={cn(group.styles.item(), classProp)} />
