<script lang="ts">
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
	Badge,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Button,
	PageHeader,
	PageHeaderActions,
	PageHeaderBar,
	PageHeaderBreadcrumbs,
	PageHeaderContent,
	PageHeaderDescription,
	PageHeaderHeading,
	PageHeaderRow,
	PageHeaderTabCount,
	PageHeaderTabs,
	PageHeaderTitle,
	Tabs,
	TabsContent,
	TabsTrigger,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { PAGE_HEADER, PAGE_PANELS } from "../data/page-header";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof PageHeader>>(props));
let issues = $state(9);
const { breadcrumbs, avatars, status, tabs } = PAGE_HEADER;
</script>

<div class="h-120 w-full overflow-y-auto rounded-xl border border-border">
	<PageHeader variant={p.variant}>
		<Tabs variant="underline" value={tabs[0]?.value}>
			<PageHeaderBar>
				<PageHeaderBreadcrumbs>
					<Breadcrumb>
						<BreadcrumbList>
							{#each breadcrumbs as crumb, index (crumb.label)}
								{#if index > 0}<BreadcrumbSeparator />{/if}
								<BreadcrumbItem>
									{#if crumb.href}
										<BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
									{:else}
										<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
									{/if}
								</BreadcrumbItem>
							{/each}
						</BreadcrumbList>
					</Breadcrumb>
				</PageHeaderBreadcrumbs>
				<PageHeaderRow>
					<PageHeaderHeading>
						<PageHeaderTitle>{PAGE_HEADER.title}</PageHeaderTitle>
						<Badge variant={status.variant} size="sm">{status.label}</Badge>
					</PageHeaderHeading>
					<PageHeaderActions>
						<AvatarGroup>
							{#each avatars.slice(0, 4) as face (face.src)}
								<Avatar size="sm" class="size-7">
									<AvatarImage src={face.src} alt="" />
									<AvatarFallback />
								</Avatar>
							{/each}
							<AvatarGroupCount size="sm" class="size-7">+{avatars.length - 4}</AvatarGroupCount>
						</AvatarGroup>
						<Button size="sm" onclick={() => (issues += 1)}>New issue</Button>
					</PageHeaderActions>
				</PageHeaderRow>
				<PageHeaderDescription>{PAGE_HEADER.description}</PageHeaderDescription>
				<PageHeaderTabs>
					{#each tabs as tab (tab.value)}
						<TabsTrigger value={tab.value}>
							{tab.label}
							{#if tab.count !== undefined}
								<PageHeaderTabCount value={tab.value === "issues" ? issues : tab.count} />
							{/if}
						</TabsTrigger>
					{/each}
				</PageHeaderTabs>
			</PageHeaderBar>
			<PageHeaderContent>
				{#each PAGE_PANELS as panel (panel.value)}
					<TabsContent value={panel.value}>
						{#each panel.lines as line (line)}
							<p class="border-border border-b py-4 text-muted-foreground text-sm">{line}</p>
						{/each}
					</TabsContent>
				{/each}
			</PageHeaderContent>
		</Tabs>
	</PageHeader>
</div>
