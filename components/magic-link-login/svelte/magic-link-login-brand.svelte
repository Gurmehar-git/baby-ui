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

const ctx = magicLinkLoginState("MagicLinkLoginBrand");
</script>

<!-- Your logo or name above the views. -->
<div class={cn(ctx.styles.brand(), classProp)} {...rest}>{@render children?.()}</div>
