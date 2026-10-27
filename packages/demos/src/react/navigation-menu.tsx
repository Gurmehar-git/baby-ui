"use client";

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
} from "@baby-ui/react";
import {
	NAV_MENU_FRAMED_SAMPLE,
	NAV_MENU_LINKS,
	NAV_MENU_SAMPLE,
} from "../data/navigation-menu";
import { controlProps } from "../data/preview-props";

export function NavigationMenuDemo({ props = {} }: { props?: Record<string, unknown> }) {
	const p = controlProps<{
		size?: NavigationMenuSize;
		variant?: NavigationMenuVariant;
	}>(props);
	const size = p.size ?? "default";
	const variant = p.variant ?? "default";
	return (
		<div className="flex min-h-72 w-full justify-center pt-2">
			<NavigationMenu variant={variant}>
				<NavigationMenuList>
					{NAV_MENU_SAMPLE.map((group) => (
						<NavigationMenuItem key={group.label} value={group.label}>
							<NavigationMenuTrigger size={size}>{group.label}</NavigationMenuTrigger>
							<NavigationMenuContent>
								{variant === "framed" && group.label === "Product" ? (
									<>
										<NavigationMenuBody>
											<div className="grid w-[42rem] grid-cols-2 gap-5 p-3">
												{NAV_MENU_FRAMED_SAMPLE.map((section) => (
													<div key={section.heading}>
														<p className="px-2 pb-1.5 text-muted-foreground text-xs">
															{section.heading}
														</p>
														<ul className="grid gap-0.5">
															{section.links.map((link) => (
																<li key={link.href}>
																	<NavigationMenuLink href={link.href}>
																		<span className="flex items-center gap-2 font-medium text-foreground">
																			{link.title}
																			<span className="rounded-full bg-muted px-1.5 font-normal text-muted-foreground text-xs tabular-nums">
																				{link.meta}
																			</span>
																		</span>
																		<span className="text-muted-foreground text-xs">
																			{link.description}
																		</span>
																	</NavigationMenuLink>
																</li>
															))}
														</ul>
													</div>
												))}
											</div>
										</NavigationMenuBody>
										<NavigationMenuFooter>
											<span className="text-muted-foreground">
												Fresh pieces every week
											</span>
											<a
												href="#new"
												className="font-medium text-foreground hover:underline"
											>
												See what's new
											</a>
										</NavigationMenuFooter>
									</>
								) : (
									<ul className="grid w-80 gap-1">
										{group.links.map((link) => (
											<li key={link.href}>
												<NavigationMenuLink href={link.href}>
													<span className="font-medium text-foreground">
														{link.title}
													</span>
													<span className="text-muted-foreground text-xs">
														{link.description}
													</span>
												</NavigationMenuLink>
											</li>
										))}
									</ul>
								)}
							</NavigationMenuContent>
						</NavigationMenuItem>
					))}
					{NAV_MENU_LINKS.map((link) => (
						<NavigationMenuItem key={link.href}>
							<NavigationMenuLink
								href={link.href}
								className={navigationMenuTriggerStyle({ size })}
							>
								{link.label}
							</NavigationMenuLink>
						</NavigationMenuItem>
					))}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
