<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { getLicenseKey } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLParagraphElement> = $props();
const ctx = getLicenseKey();
</script>

<p {...rest} class={cn(ctx.styles.description(), classProp)}>{@render children?.()}</p>
