"use client";

import { type ComponentProps, createContext, type ReactNode, useContext } from "react";
import { Badge } from "../../badge/react/badge";
import { cn } from "../../lib/react/cn";
import { Skeleton } from "../../skeleton/react/skeleton";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../table/react/table";
import {
	formatInvoiceAmount,
	formatInvoiceDate,
	INVOICE_LIST_LABELS,
	INVOICE_STATUS_TONE,
	type Invoice,
	type InvoiceListLabels,
	type InvoiceStatus,
	isoDate,
} from "./invoice-core";
import { type InvoiceListDensity, invoiceList } from "./variants";

type InvoiceListContextValue = {
	styles: ReturnType<typeof invoiceList>;
	density: InvoiceListDensity;
	locale?: string;
	labels: InvoiceListLabels;
};

const InvoiceListContext = createContext<InvoiceListContextValue | null>(null);

function useInvoiceList() {
	const context = useContext(InvoiceListContext);
	if (!context) throw new Error("InvoiceList parts must be used inside <InvoiceList>");
	return context;
}

export interface InvoiceListProps extends ComponentProps<"div"> {
	density?: InvoiceListDensity;
	/** Marks the list busy and announces `labels.loading`; render skeleton parts alongside. */
	loading?: boolean;
	locale?: string;
	labels?: Partial<InvoiceListLabels>;
}

/** Billing history. Holds density, locale and copy; the table, cards and states are parts. */
export function InvoiceList({
	density = "comfortable",
	loading = false,
	locale,
	labels: labelOverrides,
	className,
	children,
	...rest
}: InvoiceListProps) {
	const labels = { ...INVOICE_LIST_LABELS, ...labelOverrides };
	const styles = invoiceList({ density });
	return (
		<InvoiceListContext.Provider value={{ styles, density, locale, labels }}>
			<div
				data-slot="invoice-list"
				aria-busy={loading || undefined}
				className={cn(styles.root(), className)}
				{...rest}
			>
				{loading ? (
					<span role="status" className="sr-only">
						{labels.loading}
					</span>
				) : null}
				{children}
			</div>
		</InvoiceListContext.Provider>
	);
}

/** The wide layout: a captioned table that takes over from the cards at the `@xl` container width. */
export function InvoiceListTable({
	showCaption = false,
	className,
	children,
}: {
	/** The caption stays in the accessibility tree; this also paints it under the table. */
	showCaption?: boolean;
	className?: string;
	children?: ReactNode;
}) {
	const { styles, density, labels } = useInvoiceList();
	return (
		<div className={cn(styles.table(), className)}>
			<Table density={density}>
				<TableCaption className={showCaption ? undefined : "sr-only"}>
					{labels.caption}
				</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead scope="col">{labels.columns.date}</TableHead>
						<TableHead scope="col">{labels.columns.number}</TableHead>
						<TableHead scope="col">{labels.columns.description}</TableHead>
						<TableHead scope="col" className="text-right">
							{labels.columns.amount}
						</TableHead>
						<TableHead scope="col">{labels.columns.status}</TableHead>
						<TableHead scope="col" className="text-right">
							<span className="sr-only">{labels.columns.actions}</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>{children}</TableBody>
			</Table>
		</div>
	);
}

/** Rows open from zero height as they arrive, so a loaded page never pops in. */
function Grow({ children }: { children: ReactNode }) {
	const { styles } = useInvoiceList();
	return (
		<div className={styles.grow()}>
			<div className={styles.growInner()}>{children}</div>
		</div>
	);
}

export function InvoiceListRow({ invoice }: { invoice: Invoice }) {
	const { styles, locale } = useInvoiceList();
	return (
		<TableRow data-slot="invoice-list-row">
			<TableCell className={styles.cell()}>
				<Grow>
					<time dateTime={isoDate(invoice.date)}>
						{formatInvoiceDate(invoice.date, locale)}
					</time>
				</Grow>
			</TableCell>
			<TableCell className={styles.cell()}>
				<Grow>
					<span className={styles.number()}>{invoice.number}</span>
				</Grow>
			</TableCell>
			<TableCell className={styles.cell()}>
				<Grow>{invoice.description}</Grow>
			</TableCell>
			<TableCell className={cn(styles.cell(), styles.amount())}>
				<Grow>{formatInvoiceAmount(invoice.amount, invoice.currency, locale)}</Grow>
			</TableCell>
			<TableCell className={styles.cell()}>
				<Grow>
					<InvoiceListStatus status={invoice.status} />
				</Grow>
			</TableCell>
			<TableCell className={styles.cell()}>
				<Grow>
					<InvoiceListDownloads invoice={invoice} />
				</Grow>
			</TableCell>
		</TableRow>
	);
}

export function InvoiceListRowSkeleton() {
	return (
		<TableRow aria-hidden="true">
			<TableCell>
				<Skeleton width="5.5rem" />
			</TableCell>
			<TableCell>
				<Skeleton width="4.5rem" />
			</TableCell>
			<TableCell>
				<Skeleton width="9rem" />
			</TableCell>
			<TableCell>
				<Skeleton width="4rem" className="ml-auto" />
			</TableCell>
			<TableCell>
				<Skeleton width="3.5rem" height="1.25rem" />
			</TableCell>
			<TableCell>
				<Skeleton width="6rem" className="ml-auto" />
			</TableCell>
		</TableRow>
	);
}

/** The narrow layout: stacked cards until the container reaches `@xl`. */
export function InvoiceListCards({ className, ...props }: ComponentProps<"ul">) {
	const { styles, labels } = useInvoiceList();
	return (
		<ul aria-label={labels.caption} className={cn(styles.list(), className)} {...props} />
	);
}

export function InvoiceListCard({ invoice }: { invoice: Invoice }) {
	const { styles, locale } = useInvoiceList();
	return (
		<li data-slot="invoice-list-card" className={styles.grow()}>
			<div className={styles.growInner()}>
				<div className={styles.item()}>
					<div className={styles.itemTop()}>
						<span className={styles.itemTitle()}>{invoice.description}</span>
						<span className={cn(styles.amount(), "font-medium text-sm")}>
							{formatInvoiceAmount(invoice.amount, invoice.currency, locale)}
						</span>
					</div>
					<div className={styles.itemMeta()}>
						<time dateTime={isoDate(invoice.date)}>
							{formatInvoiceDate(invoice.date, locale)}
						</time>
						<span className={styles.number()}>{invoice.number}</span>
						<InvoiceListStatus status={invoice.status} />
						<InvoiceListDownloads invoice={invoice} className="ml-auto" />
					</div>
				</div>
			</div>
		</li>
	);
}

export function InvoiceListCardSkeleton() {
	const { styles } = useInvoiceList();
	return (
		<li aria-hidden="true" className={styles.item()}>
			<Skeleton width="60%" />
			<Skeleton width="40%" height="0.75rem" />
		</li>
	);
}

export function InvoiceListStatus({
	status,
	className,
}: {
	status: InvoiceStatus;
	className?: string;
}) {
	const { labels } = useInvoiceList();
	return (
		<Badge variant={INVOICE_STATUS_TONE[status]} size="sm" className={className}>
			{labels.status[status]}
		</Badge>
	);
}

/** Receipt and invoice links, each only when its URL exists. */
export function InvoiceListDownloads({
	invoice,
	className,
}: {
	invoice: Invoice;
	className?: string;
}) {
	const { styles, labels } = useInvoiceList();
	return (
		<span className={cn(styles.links(), className)}>
			{invoice.receiptUrl ? (
				<a
					href={invoice.receiptUrl}
					target="_blank"
					rel="noopener noreferrer"
					download
					aria-label={labels.downloadReceipt(invoice.number)}
					className={styles.link()}
				>
					{labels.receipt}
				</a>
			) : null}
			{invoice.invoiceUrl ? (
				<a
					href={invoice.invoiceUrl}
					target="_blank"
					rel="noopener noreferrer"
					download
					aria-label={labels.downloadInvoice(invoice.number)}
					className={styles.link()}
				>
					{labels.invoice}
				</a>
			) : null}
		</span>
	);
}

export function InvoiceListEmpty({
	title,
	hint,
	className,
}: {
	title?: ReactNode;
	hint?: ReactNode;
	className?: string;
}) {
	const { styles, labels } = useInvoiceList();
	return (
		<div className={cn(styles.empty(), className)}>
			<p className={styles.emptyTitle()}>{title ?? labels.empty}</p>
			<p className={styles.emptyHint()}>{hint ?? labels.emptyHint}</p>
		</div>
	);
}

export function InvoiceListFooter({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useInvoiceList();
	return <div className={cn(styles.footer(), className)} {...props} />;
}
