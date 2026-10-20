<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { getLicenseKey } from "./context";

let { class: classProp, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
const ctx = getLicenseKey();
</script>

<div {...rest} data-slot="license-key-header" class={cn(ctx.styles.header(), classProp)}>
	{@render children?.()}
</div>
