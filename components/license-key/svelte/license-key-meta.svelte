<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { getLicenseKey } from "./context";

let { class: classProp, children, ...rest }: HTMLAttributes<HTMLDListElement> = $props();
const ctx = getLicenseKey();
</script>

<dl {...rest} class={cn(ctx.styles.meta(), classProp)}>{@render children?.()}</dl>
