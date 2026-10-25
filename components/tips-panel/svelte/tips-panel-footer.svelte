<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { tipsPanelState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & { children?: Snippet } = $props();
const ctx = tipsPanelState("TipsPanelFooter");
</script>

<footer data-slot="tips-panel-footer" {...rest} class={cn(ctx.styles.footer(), classProp)}>
	{@render children?.()}
</footer>
