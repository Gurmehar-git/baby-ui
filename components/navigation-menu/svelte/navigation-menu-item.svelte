<script lang="ts">
import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
import { cn } from "../../lib/svelte/cn";
import { navigationMenu } from "./variants";

let {
	ref = $bindable(null),
	class: classProp,
	...rest
}: NavigationMenuPrimitive.ItemProps = $props();
</script>

<NavigationMenuPrimitive.Item
	bind:ref
	data-slot="navigation-menu-item"
	class={cn(navigationMenu().item(), classProp)}
	{...rest}
/>
