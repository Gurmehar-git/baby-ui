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

const ctx = magicLinkLoginState("MagicLinkLoginAside");
</script>

<!-- The brand panel beside the form; shown only in the split layout. -->
<div class={cn(ctx.styles.aside(), classProp)} {...rest}>{@render children?.()}</div>
