<script lang="ts">
import { Command as CommandPrimitive } from "bits-ui";
import { cn } from "../../lib/svelte/cn";
import { getCommand } from "./context";

let { class: classProp, ...rest }: CommandPrimitive.SeparatorProps = $props();
const command = getCommand();
</script>

<CommandPrimitive.Separator
	data-slot="command-separator"
	class={cn(command.styles.separator(), classProp)}
	{...rest}
/>
