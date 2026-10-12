"use client";

import { Button, PageHeader, TabsContent } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { PAGE_HEADER, PAGE_PANELS } from "../data/page-header";
import { controlProps } from "../data/preview-props";

export function PageHeaderDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof PageHeader>>(props);
	const [issues, setIssues] = useState(9);
	const tabs = PAGE_HEADER.tabs.map((tab) =>
		tab.value === "issues" ? { ...tab, count: issues } : tab,
	);
	return (
		<div className="h-120 w-full overflow-y-auto rounded-xl border border-border">
			<PageHeader
				{...PAGE_HEADER}
				tabs={tabs}
				variant={p.variant}
				actions={
					<Button size="sm" onClick={() => setIssues((n) => n + 1)}>
						New issue
					</Button>
				}
			>
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
			</PageHeader>
		</div>
	);
}
