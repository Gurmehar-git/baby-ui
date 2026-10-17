<script lang="ts">
import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
import { cn } from "../../lib/cn";
import { navigationMenu } from "../variants";

let {
	ref = $bindable(null),
	class: classProp,
	...rest
}: NavigationMenuPrimitive.ViewportProps = $props();
</script>

<!-- shadcn-svelte's geometry: bits-ui measures the content without its p-2, hence the 1rem. -->
<div class="absolute start-0 top-full isolate z-50 flex justify-center">
	<NavigationMenuPrimitive.Viewport
		bind:ref
		data-slot="navigation-menu-viewport"
		class={cn(
			"nav-menu-viewport relative mt-1.5 w-full origin-top",
			navigationMenu().viewport(),
			"h-[calc(var(--bits-navigation-menu-viewport-height)+1rem)] md:w-[calc(var(--bits-navigation-menu-viewport-width)+1rem)]",
			classProp,
		)}
		{...rest}
	/>
</div>
