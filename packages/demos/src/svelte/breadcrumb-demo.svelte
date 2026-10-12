<script lang="ts">
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Breadcrumb>>(props));

const collapsed = $derived(props.collapsed !== false);
// The levels the ellipsis folds away; each stays one click from the menu.
const HIDDEN = [
	{ href: "/components", label: "Components" },
	{ href: "/components/base", label: "Base" },
];
</script>

<Breadcrumb variant={p.variant ?? "default"} size={p.size ?? "default"}>
	<BreadcrumbList>
		<BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
		<BreadcrumbSeparator />
		{#if collapsed}
			<BreadcrumbItem>
				<DropdownMenu>
					<DropdownMenuTrigger aria-label="Show more levels">
						<BreadcrumbEllipsis />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						{#each HIDDEN as level (level.href)}
							<DropdownMenuItem>
								{#snippet child({ props: itemProps })}
									<a href={level.href} {...itemProps}>{level.label}</a>
								{/snippet}
							</DropdownMenuItem>
						{/each}
					</DropdownMenuContent>
				</DropdownMenu>
			</BreadcrumbItem>
		{:else}
			{#each HIDDEN as level (level.href)}
				<BreadcrumbItem><BreadcrumbLink href={level.href}>{level.label}</BreadcrumbLink></BreadcrumbItem>
				<BreadcrumbSeparator />
			{/each}
		{/if}
		{#if collapsed}<BreadcrumbSeparator />{/if}
		<BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
	</BreadcrumbList>
</Breadcrumb>
