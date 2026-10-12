<script lang="ts">
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { NAV_MENU_LINKS, NAV_MENU_SAMPLE } from "../data/navigation-menu";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof NavigationMenuTrigger>>(props));

const size = $derived(p.size ?? "default");
</script>

<div class="flex min-h-72 w-full justify-center pt-2">
	<NavigationMenu>
		<NavigationMenuList>
			{#each NAV_MENU_SAMPLE as group (group.label)}
				<NavigationMenuItem value={group.label}>
					<NavigationMenuTrigger {size}>{group.label}</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul class="grid w-80 gap-1">
							{#each group.links as link (link.href)}
								<li>
									<NavigationMenuLink href={link.href}>
										<span class="font-medium text-foreground">{link.title}</span>
										<span class="text-muted-foreground text-xs">{link.description}</span>
									</NavigationMenuLink>
								</li>
							{/each}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			{/each}
			{#each NAV_MENU_LINKS as link (link.href)}
				<NavigationMenuItem>
					<NavigationMenuLink href={link.href} class={navigationMenuTriggerStyle({ size })}>
						{link.label}
					</NavigationMenuLink>
				</NavigationMenuItem>
			{/each}
		</NavigationMenuList>
	</NavigationMenu>
</div>
