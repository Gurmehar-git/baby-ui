<script lang="ts">
import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
import { cn } from "../../lib/cn";
import { navigationMenu } from "../variants";

let {
	ref = $bindable(null),
	class: classProp,
	...rest
}: NavigationMenuPrimitive.ContentProps = $props();
</script>

<!-- Absolute from md up, so the outgoing and incoming panels overlap while they cross-slide. -->
<NavigationMenuPrimitive.Content
	bind:ref
	data-slot="navigation-menu-content"
	class={cn(
		"nav-menu-content top-0 left-0 w-full md:absolute md:w-auto",
		navigationMenu().content(),
		classProp,
	)}
	{...rest}
/>
