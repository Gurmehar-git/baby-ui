<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { getLicenseKey } from "./context";

let { class: classProp, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
const ctx = getLicenseKey();
</script>

<div {...rest} class={cn(ctx.styles.heading(), classProp)}>{@render children?.()}</div>
