<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { getLicenseKey } from "./context";

let { class: classProp, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
const ctx = getLicenseKey();
</script>

<!-- The panel around the key. -->
<div {...rest} data-slot="license-key-pass" class={cn(ctx.styles.pass(), classProp)}>
	{@render children?.()}
</div>
