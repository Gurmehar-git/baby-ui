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

const ctx = magicLinkLoginState("MagicLinkLoginPanel");
</script>

<!-- The sign-in column: brand, then the two views. -->
<div class={cn(ctx.styles.panel(), classProp)} {...rest}>{@render children?.()}</div>
