<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import { propertyPanel } from "./variants";

let { class: classProp, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<!-- Right-aligned on the label's line: a button, a count, a switch. -->
<div
	data-slot="property-panel-group-action"
	class={cn(propertyPanel().action(), classProp)}
	{...rest}
>
	{@render children?.()}
</div>
