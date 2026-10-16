import { defineComponent } from "@baby-ui/registry-schema";

export const emailReceipt = defineComponent({
	slug: "email-receipt",
	name: "Receipt",
	description:
		"A payment receipt with status, reference details, line items, total and a billing contact.",
	category: "emails",
	status: "beta",
	variants: {
		surface: ["card", "plain"],
	},
	props: [
		{
			name: "productName",
			type: "string",
			description: "Shown in the header, heading and preview line.",
			control: {
				kind: "text",
			},
			required: true,
			default: "Acme",
		},
		{
			name: "receiptNumber",
			type: "string",
			description: "Reference shown in the details and the preview line.",
			control: {
				kind: "none",
			},
			required: true,
		},
		{
			name: "date",
			type: "string",
			description: "Pre-formatted payment date, so the email never guesses a locale.",
			control: {
				kind: "none",
			},
			required: true,
		},
		{
			name: "items",
			type: "{ label: string; value: string }[]",
			description: "What was charged; amounts pre-formatted with currency.",
			control: {
				kind: "none",
			},
			required: true,
		},
		{
			name: "total",
			type: "string",
			description: "Pre-formatted grand total.",
			control: {
				kind: "none",
			},
			required: true,
		},
		{
			name: "paymentMethod",
			type: "string",
			description: 'E.g. "Visa ending 4242"; never the full card number.',
			control: {
				kind: "none",
			},
			required: true,
		},
		{
			name: "adjustments",
			type: "{ label: string; value: string }[]",
			description: "Rows between items and total: subtotal, discount, tax.",
			control: {
				kind: "none",
			},
		},
		{
			name: "billingLines",
			type: "string[]",
			description: "Billing name and address, one line each.",
			control: {
				kind: "none",
			},
		},
		{
			name: "invoiceUrl",
			type: "string",
			description: "Link to a PDF invoice or billing page.",
			control: {
				kind: "none",
			},
		},
		{
			name: "billingEmail",
			type: "string",
			description: "Address for questions about the charge.",
			control: {
				kind: "none",
			},
		},
		{
			name: "labels",
			type: "Partial<EmailReceiptLabels>",
			description: "Rename or translate the status and field labels.",
			control: {
				kind: "none",
			},
		},
		{
			name: "heading, intro, actionLabel, helpLabel",
			type: "string",
			description: "Copy overrides for translation or tone.",
			control: {
				kind: "none",
			},
		},
		{
			name: "companyLines",
			type: "string[]",
			description: "Sender name and postal address, one line each, in the footer.",
			control: {
				kind: "none",
			},
			required: true,
		},
		{
			name: "logoUrl",
			type: "string",
			description:
				"Absolute PNG URL of a square mark, set beside the product name in the header and footer.",
			control: {
				kind: "none",
			},
		},
		{
			name: "footerLinks",
			type: "{ label: string; href: string }[]",
			description: "Footer links such as notification settings or the privacy policy.",
			control: {
				kind: "none",
			},
		},
		{
			name: "reason",
			type: "string",
			description: "Footer line saying why the email arrived.",
			control: {
				kind: "none",
			},
		},
		{
			name: "preview",
			type: "string",
			description: "Inbox preview line; the default is built from the other props.",
			control: {
				kind: "none",
			},
		},
		{
			name: "surface",
			type: '"card" | "plain"',
			description: "A bordered card on a quiet page, or content straight on the page.",
			control: {
				kind: "select",
				options: ["card", "plain"],
			},
			default: "card",
		},
	],
	a11y: {
		keyboard: [],
		notes: [
			"Every amount and date is a pre-formatted string: the template never formats currency or dates itself.",
			"The status badge reads Paid in words; its colour only reinforces it.",
			"Ships a plain-text part next to the HTML; send both.",
		],
	},
	impl: {
		react: {
			entry: "EmailReceipt",
		},
		svelte: {
			entry: "EmailReceipt",
		},
	},
	keywords: ["email", "receipt", "invoice", "payment", "billing"],
});
