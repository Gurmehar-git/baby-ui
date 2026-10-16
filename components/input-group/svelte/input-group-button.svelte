<script lang="ts">
import type { ComponentProps } from "svelte";
import Button from "../../button/svelte/button.svelte";
import type { ButtonSize } from "../../button/svelte/variants";
import { cn } from "../../lib/svelte/cn";
import { inputGroup } from "./variants";

let {
	ref = $bindable(null),
	class: classProp,
	type = "button",
	variant = "ghost",
	size = "xs",
	children,
	...rest
}: Omit<ComponentProps<typeof Button>, "size" | "href"> & {
	size?: Extract<ButtonSize, "xs" | "sm" | "icon-xs" | "icon-sm">;
} = $props();
</script>

<Button
	bind:ref
	{type}
	data-size={size}
	{variant}
	{size}
	class={cn(inputGroup().button(), classProp)}
	{...rest}
>
	{@render children?.()}
</Button>
