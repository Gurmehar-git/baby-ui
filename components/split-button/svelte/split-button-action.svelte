<script lang="ts">
import type { ComponentProps } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { splitButtonState } from "./context";

let { class: classProp, ...rest }: ComponentProps<typeof Button> = $props();
const group = splitButtonState();
</script>

<!-- The primary action; takes the group's variant, size and disabled state. -->
<Button
	data-slot="split-button-action"
	variant={group.variant}
	size={group.size}
	disabled={group.disabled}
	{...rest}
	class={cn(group.styles.main(), classProp)}
/>
