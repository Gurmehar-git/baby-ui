<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { getInvoiceList } from "./context";

let { class: classProp, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
const ctx = getInvoiceList();
</script>

<div {...rest} class={cn(ctx.styles.footer(), classProp)}>{@render children?.()}</div>
