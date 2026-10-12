"use client";

import { Button, PageHeader, TabsContent } from "@baby-ui/react";

export function Example() {
	return (
		<PageHeader
			variant="sticky"
			title="Billing"
			breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Billing" }]}
			actions={<Button size="sm">Upgrade</Button>}
			tabs={[
				{ value: "plan", label: "Plan" },
				{ value: "invoices", label: "Invoices", count: 12 },
			]}
		>
			<TabsContent value="plan">Plan details</TabsContent>
			<TabsContent value="invoices">Invoice list</TabsContent>
		</PageHeader>
	);
}
