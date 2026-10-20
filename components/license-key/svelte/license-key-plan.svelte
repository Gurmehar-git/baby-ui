<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { getLicenseKey } from "./context";

let { class: classProp, children, ...rest }: HTMLAttributes<HTMLSpanElement> = $props();
const ctx = getLicenseKey();
</script>

<!-- The plan, led by a live dot that pings once when it first appears. -->
<span {...rest} class={cn(ctx.styles.plan(), classProp)}>
	<span aria-hidden="true" class={ctx.styles.planDot()}>
		<span class={ctx.styles.planDotCore()}></span>
	</span>
	{@render children?.()}
</span>
