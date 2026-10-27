<script lang="ts">
import type { ComponentProps, Snippet } from "svelte";
import type { HTMLAnchorAttributes } from "svelte/elements";
import ContextMenuItem from "../../context-menu/svelte/context-menu-item.svelte";
import { cn } from "../../lib/cn";
import { assetMenu } from "../variants";
import { getAssetMenu } from "./context";

let {
	children,
	href,
	class: classProp,
	...rest
}: Omit<ComponentProps<typeof ContextMenuItem>, "children"> &
	Omit<HTMLAnchorAttributes, "children" | "class"> & {
		children: Snippet;
		href: string;
		class?: string;
	} = $props();
const context = getAssetMenu();
const s = $derived(assetMenu({ variant: context.variant }));
</script>

<ContextMenuItem>
	{#snippet child({ props })}
		<a
			{...props}
			{...rest}
			{href}
			data-slot="asset-menu-link-item"
			class={cn(String(props.class ?? ""), s.item(), classProp)}
		>
			{@render children()}
		</a>
	{/snippet}
</ContextMenuItem>
