import { defineComponent } from "@baby-ui/registry-schema";

export const invoiceList = defineComponent({
	slug: "invoice-list",
	name: "Invoice List",
	description:
		"Billing history from parts: a captioned table on wide containers and stacked cards on narrow ones, status badges, receipt and invoice downloads, skeletons and an empty state.",
	category: "blocks",
	status: "beta",
	props: [
		{
			name: "density",
			type: '"comfortable" | "compact"',
			description: "Row height for the table and the cards.",
			default: "comfortable",
			control: { kind: "select", options: ["comfortable", "compact"] },
		},
		{
			name: "loading",
			type: "boolean",
			description:
				"Marks the list busy and announces it. Render InvoiceListRowSkeleton and InvoiceListCardSkeleton in place of rows.",
			default: "false",
			control: { kind: "boolean" },
		},
		{
			name: "locale",
			type: "string",
			description: "BCP 47 locale for money and dates; defaults to the browser's.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<InvoiceListLabels>",
			description:
				"Override the caption, column names, status names and empty state copy.",
			control: { kind: "none" },
		},
		{
			name: "children",
			type: "Snippet | ReactNode",
			description:
				"The parts: InvoiceListTable with InvoiceListRow, InvoiceListCards with InvoiceListCard, their skeletons, InvoiceListEmpty and InvoiceListFooter. Status and Downloads also work alone.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Rows appear at full height with no transition.",
		behaviour: [
			"Rows open from zero height with a fade as they mount, so a loaded page grows the list instead of popping it.",
			"Below a 36rem container the table hides and the cards show the same data and links.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Tab"], action: "Reaches every receipt and invoice link" }],
		notes: [
			"A real table with a caption and column headers scoped to their columns.",
			"Status is a text badge, never colour alone.",
			"Download links open in a new tab with rel noopener and name the invoice number, e.g. Download receipt for BUI-0006.",
			"While loading, the region is aria-busy and a status message announces it.",
		],
	},
	impl: {
		react: { entry: "InvoiceList" },
		svelte: { entry: "InvoiceList" },
	},
	keywords: [
		"invoice",
		"billing history",
		"receipts",
		"table",
		"payments",
		"saas",
		"dashboard",
	],
});
