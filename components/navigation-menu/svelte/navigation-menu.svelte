<script lang="ts">
import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
import { cn } from "../../lib/cn";
import { navigationMenu } from "../variants";
import NavigationMenuViewport from "./navigation-menu-viewport.svelte";

let {
	ref = $bindable(null),
	value = $bindable(""),
	viewport = true,
	class: classProp,
	children,
	...rest
}: NavigationMenuPrimitive.RootProps & {
	/** Render the shared panel that slides between triggers. */
	viewport?: boolean;
} = $props();
</script>

<NavigationMenuPrimitive.Root
	bind:ref
	bind:value
	data-slot="navigation-menu"
	data-viewport={viewport}
	class={cn(navigationMenu().root(), classProp)}
	{...rest}
>
	{@render children?.()}
	{#if viewport}
		<NavigationMenuViewport />
	{/if}
</NavigationMenuPrimitive.Root>
