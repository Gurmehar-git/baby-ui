import { createContext } from "svelte";
import type { InvoiceListLabels } from "./invoice-core";
import type { InvoiceListDensity, invoiceList } from "./variants";

export type InvoiceListContext = {
	readonly styles: ReturnType<typeof invoiceList>;
	readonly density: InvoiceListDensity;
	readonly locale: string | undefined;
	readonly labels: InvoiceListLabels;
};

export const [getInvoiceList, setInvoiceList] = createContext<InvoiceListContext>();
