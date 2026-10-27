<script lang="ts">
import {
	NavigationMenu,
	NavigationMenuBody,
	NavigationMenuContent,
	NavigationMenuFooter,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	type NavigationMenuSize,
	NavigationMenuTrigger,
	type NavigationMenuVariant,
	navigationMenuTriggerStyle,
} from "@baby-ui/svelte";
import {
	NAV_MENU_FRAMED_SAMPLE,
	NAV_MENU_LINKS,
	NAV_MENU_SAMPLE,
} from "../data/navigation-menu";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(
	controlProps<{ size?: NavigationMenuSize; variant?: NavigationMenuVariant }>(props),
);

const size = $derived(p.size ?? "default");
const variant = $derived(p.variant ?? "default");
</script>

<div class="flex min-h-72 w-full justify-center pt-2">
	<NavigationMenu {variant}>
		<NavigationMenuList>
			{#each NAV_MENU_SAMPLE as group (group.label)}
				<NavigationMenuItem value={group.label}>
					<NavigationMenuTrigger {size}>{group.label}</NavigationMenuTrigger>
					<NavigationMenuContent>
						{#if variant === "framed" && group.label === "Product"}
							<NavigationMenuBody>
								<div class="grid w-[42rem] grid-cols-2 gap-5 p-3">
									{#each NAV_MENU_FRAMED_SAMPLE as section (section.heading)}
										<div>
											<p class="px-2 pb-1.5 text-muted-foreground text-xs">{section.heading}</p>
											<ul class="grid gap-0.5">
												{#each section.links as link (link.href)}
													<li>
														<NavigationMenuLink href={link.href}>
															<span class="flex items-center gap-2 font-medium text-foreground">
																{link.title}
																<span class="rounded-full bg-muted px-1.5 font-normal text-muted-foreground text-xs tabular-nums">{link.meta}</span>
															</span>
															<span class="text-muted-foreground text-xs">{link.description}</span>
														</NavigationMenuLink>
													</li>
												{/each}
											</ul>
										</div>
									{/each}
								</div>
							</NavigationMenuBody>
							<NavigationMenuFooter>
								<span class="text-muted-foreground">Fresh pieces every week</span>
								<a href="#new" class="font-medium text-foreground hover:underline">See what's new</a>
							</NavigationMenuFooter>
						{:else}
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
						{/if}
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
