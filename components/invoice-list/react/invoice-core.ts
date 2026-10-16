export type InvoiceStatus = "paid" | "open" | "void" | "refunded" | "failed";

export interface Invoice {
	id: string;
	/** Human-facing number, e.g. "INV-0012". */
	number: string;
	date: string | number | Date;
	description: string;
	/** In the currency's minor unit. */
	amount: number;
	/** ISO 4217 code, e.g. "USD". */
	currency: string;
	status: InvoiceStatus;
	receiptUrl?: string;
	invoiceUrl?: string;
}

export type InvoiceBadgeTone =
	| "success"
	| "info"
	| "secondary"
	| "warning"
	| "destructive";

export const INVOICE_STATUS_TONE: Record<InvoiceStatus, InvoiceBadgeTone> = {
	paid: "success",
	open: "info",
	void: "secondary",
	refunded: "warning",
	failed: "destructive",
};

export interface InvoiceListLabels {
	caption: string;
	status: Record<InvoiceStatus, string>;
	columns: {
		date: string;
		number: string;
		description: string;
		amount: string;
		status: string;
		actions: string;
	};
	receipt: string;
	invoice: string;
	downloadReceipt: (number: string) => string;
	downloadInvoice: (number: string) => string;
	empty: string;
	emptyHint: string;
	loadMore: string;
	loading: string;
}

export const INVOICE_LIST_LABELS: InvoiceListLabels = {
	caption: "Billing history",
	status: {
		paid: "Paid",
		open: "Open",
		void: "Void",
		refunded: "Refunded",
		failed: "Failed",
	},
	columns: {
		date: "Date",
		number: "Invoice",
		description: "Description",
		amount: "Amount",
		status: "Status",
		actions: "Downloads",
	},
	receipt: "Receipt",
	invoice: "Invoice",
	downloadReceipt: (number) => `Download receipt for ${number}`,
	downloadInvoice: (number) => `Download invoice ${number}`,
	empty: "No invoices yet",
	emptyHint: "Invoices appear here after your first payment.",
	loadMore: "Load more",
	loading: "Loading invoices",
};

export function formatInvoiceAmount(
	amount: number,
	currency: string,
	locale?: string,
): string {
	return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
		amount / 100,
	);
}

export function formatInvoiceDate(at: string | number | Date, locale?: string): string {
	return new Intl.DateTimeFormat(locale, {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(at instanceof Date ? at : new Date(at));
}

/** Machine-readable value for a `<time datetime>`. */
export function isoDate(at: string | number | Date): string {
	return (at instanceof Date ? at : new Date(at)).toISOString().slice(0, 10);
}
