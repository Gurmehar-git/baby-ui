<script lang="ts">
import type { ComponentProps, Snippet } from "svelte";
import ContextMenuItem from "../../context-menu/svelte/context-menu-item.svelte";
import { cn } from "../../lib/cn";
import { assetMenu } from "../variants";
import { getAssetMenu } from "./context";

let {
	children,
	value,
	onCopy,
	onclick,
	class: classProp,
	...rest
}: Omit<ComponentProps<typeof ContextMenuItem>, "children" | "onclick"> & {
	children: Snippet;
	value: string;
	onCopy?: (success: boolean) => void;
	onclick?: (event: MouseEvent & { currentTarget: HTMLElement }) => void;
} = $props();
const context = getAssetMenu();
const s = $derived(assetMenu({ variant: context.variant }));

async function copy(event: MouseEvent & { currentTarget: HTMLElement }) {
	onclick?.(event);
	if (event.defaultPrevented) return;
	try {
		await navigator.clipboard.writeText(value);
		onCopy?.(true);
	} catch {
		onCopy?.(false);
	}
}
</script>

<ContextMenuItem
	data-slot="asset-menu-copy-item"
	class={cn(s.item(), classProp)}
	onclick={copy}
	{...rest}
>
	{@render children()}
</ContextMenuItem>
