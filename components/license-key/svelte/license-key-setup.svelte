<script lang="ts">
import type { HTMLOlAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { getLicenseKey } from "./context";

let { class: classProp, children, ...rest }: HTMLOlAttributes = $props();
const ctx = getLicenseKey();
</script>

<!-- Numbered setup steps; each LicenseKeyStep takes the next number on its own. -->
<ol {...rest} class={cn(ctx.styles.setup(), classProp)}>{@render children?.()}</ol>
