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

const ctx = magicLinkLoginState("MagicLinkLoginLegal");
</script>

<!-- Terms and privacy copy under the form; links get an underline that firms on hover. -->
<div class={cn(ctx.styles.legal(), classProp)} {...rest}>{@render children?.()}</div>
