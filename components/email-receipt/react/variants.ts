import { tv } from "tailwind-variants";

export const emailReceipt = tv({
	slots: {
		summary: "mt-10",
		details: "mt-8",
	},
});

/** Default copy for the receipt's labels; pass `labels` to translate or rename any of them. */
export const EMAIL_RECEIPT_LABELS = {
	status: "Paid",
	receipt: "Receipt number",
	date: "Date paid",
	paymentMethod: "Payment method",
	items: "Summary",
	total: "Total",
	billedTo: "Billed to",
};

export type EmailReceiptLabels = typeof EMAIL_RECEIPT_LABELS;
