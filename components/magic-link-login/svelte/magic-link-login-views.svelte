<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { magicLinkLoginState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();

const ctx = magicLinkLoginState("MagicLinkLoginViews");
</script>

<!-- Stacks the form and sent views in one grid cell, so swapping them never changes the height. -->
<div class={cn(ctx.styles.views(), classProp)} {...rest}>{@render children?.()}</div>
