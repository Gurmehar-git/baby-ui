<script lang="ts">
import {
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
	PageHeaderRow,
	PageHeaderTabCount,
	PageHeaderTabs,
	PageHeaderTitle,
	Tabs,
	TabsContent,
	TabsTrigger,
} from "@baby-ui/svelte";
</script>

<PageHeader variant="sticky">
	<Tabs variant="underline" value="plan">
		<PageHeaderBar>
			<PageHeaderBreadcrumbs>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Billing</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</PageHeaderBreadcrumbs>
			<PageHeaderRow>
				<PageHeaderTitle>Billing</PageHeaderTitle>
				<PageHeaderActions>
					<Button size="sm">Upgrade</Button>
				</PageHeaderActions>
			</PageHeaderRow>
			<PageHeaderTabs>
				<TabsTrigger value="plan">Plan</TabsTrigger>
				<TabsTrigger value="invoices">
					Invoices
					<PageHeaderTabCount value={12} />
				</TabsTrigger>
			</PageHeaderTabs>
		</PageHeaderBar>
		<PageHeaderContent>
			<TabsContent value="plan">Plan details</TabsContent>
			<TabsContent value="invoices">Invoice list</TabsContent>
		</PageHeaderContent>
	</Tabs>
</PageHeader>
