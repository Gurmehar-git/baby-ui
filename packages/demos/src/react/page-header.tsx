"use client";

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
} from "@baby-ui/react";
import { type ComponentProps, Fragment, useState } from "react";
import { PAGE_HEADER, PAGE_PANELS } from "../data/page-header";
import { controlProps } from "../data/preview-props";

export function PageHeaderDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof PageHeader>>(props);
	const [issues, setIssues] = useState(9);
	const { breadcrumbs, avatars, status, tabs } = PAGE_HEADER;
	return (
		<div className="h-120 w-full overflow-y-auto rounded-xl border border-border">
			<PageHeader variant={p.variant}>
				<Tabs variant="underline" defaultValue={tabs[0]?.value}>
					<PageHeaderBar>
						<PageHeaderBreadcrumbs>
							<Breadcrumb>
								<BreadcrumbList>
									{breadcrumbs.map((crumb, index) => (
										<Fragment key={crumb.label}>
											{index > 0 ? <BreadcrumbSeparator /> : null}
											<BreadcrumbItem>
												{crumb.href ? (
													<BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
												) : (
													<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
												)}
											</BreadcrumbItem>
										</Fragment>
									))}
								</BreadcrumbList>
							</Breadcrumb>
						</PageHeaderBreadcrumbs>
						<PageHeaderRow>
							<PageHeaderHeading>
								<PageHeaderTitle>{PAGE_HEADER.title}</PageHeaderTitle>
								<Badge variant={status.variant} size="sm">
									{status.label}
								</Badge>
							</PageHeaderHeading>
							<PageHeaderActions>
								<AvatarGroup>
									{avatars.slice(0, 4).map((face) => (
										<Avatar key={face.src} size="sm" className="size-7">
											<AvatarImage src={face.src} alt="" />
											<AvatarFallback />
										</Avatar>
									))}
									<AvatarGroupCount size="sm" className="size-7">
										+{avatars.length - 4}
									</AvatarGroupCount>
								</AvatarGroup>
								<Button size="sm" onClick={() => setIssues((n) => n + 1)}>
									New issue
								</Button>
							</PageHeaderActions>
						</PageHeaderRow>
						<PageHeaderDescription>{PAGE_HEADER.description}</PageHeaderDescription>
						<PageHeaderTabs>
							{tabs.map((tab) => (
								<TabsTrigger key={tab.value} value={tab.value}>
									{tab.label}
									{tab.count !== undefined ? (
										<PageHeaderTabCount
											value={tab.value === "issues" ? issues : tab.count}
										/>
									) : null}
								</TabsTrigger>
							))}
						</PageHeaderTabs>
					</PageHeaderBar>
					<PageHeaderContent>
						{PAGE_PANELS.map((panel) => (
							<TabsContent key={panel.value} value={panel.value}>
								{panel.lines.map((line) => (
									<p
										key={line}
										className="border-border border-b py-4 text-muted-foreground text-sm"
									>
										{line}
									</p>
								))}
							</TabsContent>
						))}
					</PageHeaderContent>
				</Tabs>
			</PageHeader>
		</div>
	);
}
