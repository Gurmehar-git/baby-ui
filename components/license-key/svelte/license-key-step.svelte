<script lang="ts">
import type { HTMLLiAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { getLicenseKey } from "./context";

let {
	title,
	class: classProp,
	children,
	...rest
}: Omit<HTMLLiAttributes, "title"> & { title: string } = $props();
const ctx = getLicenseKey();
</script>

<li {...rest} class={cn(ctx.styles.step(), classProp)}>
	<span aria-hidden="true" class={ctx.styles.stepNumber()}></span>
	<div class={ctx.styles.stepBody()}>
		<p class={ctx.styles.stepTitle()}>{title}</p>
		{@render children?.()}
	</div>
</li>
