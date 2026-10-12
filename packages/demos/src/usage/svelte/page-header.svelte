<script lang="ts">
import { Button, PageHeader, TabsContent } from "@baby-ui/svelte";
</script>

<PageHeader
	variant="sticky"
	title="Billing"
	breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Billing" }]}
	tabs={[
		{ value: "plan", label: "Plan" },
		{ value: "invoices", label: "Invoices", count: 12 },
	]}
>
	{#snippet actions()}
		<Button size="sm">Upgrade</Button>
	{/snippet}
	<TabsContent value="plan">Plan details</TabsContent>
	<TabsContent value="invoices">Invoice list</TabsContent>
</PageHeader>
