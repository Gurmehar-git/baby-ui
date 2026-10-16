import { Link, Section } from "react-email";
import {
	EmailBadge,
	EmailButton,
	EmailDivider,
	EmailFooter,
	type EmailFooterLink,
	EmailHeader,
	EmailHeading,
	EmailKeyValue,
	type EmailKeyValueRow,
	EmailPanel,
	EmailShell,
	type EmailShellSurface,
	EmailText,
} from "../../email-kit/react/email-kit";
import { emailLayout } from "../../email-kit/react/variants";
import { EMAIL_RECEIPT_LABELS, type EmailReceiptLabels, emailReceipt } from "./variants";

export type { EmailReceiptLabels };

export interface EmailReceiptProps {
	productName: string;
	receiptNumber: string;
	/** Pre-formatted, so the email never guesses a locale. */
	date: string;
	/** What was charged, amounts pre-formatted with currency, e.g. "$24.00". */
	items: EmailKeyValueRow[];
	/** Pre-formatted grand total. */
	total: string;
	/** E.g. "Visa ending 4242"; never the full card number. */
	paymentMethod: string;
	/** Sender name and postal address, one line each. */
	companyLines: string[];
	/** Rows between items and total, e.g. subtotal, discount, tax. */
	adjustments?: EmailKeyValueRow[];
	/** Billing name and address, one line each. */
	billingLines?: string[];
	/** Link to a PDF invoice or billing page. */
	invoiceUrl?: string;
	/** Address for questions about the charge. */
	billingEmail?: string;
	/** Absolute PNG URL of a square mark, set beside the product name in header and footer. */
	logoUrl?: string;
	footerLinks?: EmailFooterLink[];
	reason?: string;
	preview?: string;
	heading?: string;
	intro?: string;
	actionLabel?: string;
	helpLabel?: string;
	labels?: Partial<EmailReceiptLabels>;
	surface?: Exclude<EmailShellSurface, "stacked">;
}

/** A payment receipt: display headline, items in a tinted panel, details and a brand bar footer. */
export function EmailReceipt({
	productName,
	receiptNumber,
	date,
	items,
	total,
	paymentMethod,
	companyLines,
	adjustments = [],
	billingLines = [],
	invoiceUrl,
	billingEmail,
	logoUrl,
	footerLinks,
	reason,
	preview = `Receipt ${receiptNumber} from ${productName}: ${total} paid on ${date}.`,
	heading = `Receipt from ${productName}`,
	intro = "Thanks for your payment. Keep this email for your records.",
	actionLabel = "Download invoice",
	helpLabel = "Questions about this charge? Write to",
	labels: labelOverrides,
	surface = "card",
}: EmailReceiptProps) {
	const s = emailLayout();
	const r = emailReceipt();
	const labels = { ...EMAIL_RECEIPT_LABELS, ...labelOverrides };
	return (
		<EmailShell
			preview={preview}
			surface={surface}
			cardFooter={
				<EmailFooter
					lines={companyLines}
					links={footerLinks}
					reason={reason}
					brand={productName}
					logo={logoUrl}
					layout="bar"
				/>
			}
		>
			<EmailHeader brand={productName} logo={logoUrl} />
			<Section className={s.badge()}>
				<EmailBadge tone="success">{labels.status}</EmailBadge>
			</Section>
			<EmailHeading size="display">{heading}</EmailHeading>
			<EmailText tone="muted" className={s.intro()}>
				{intro}
			</EmailText>
			<Section className={r.summary()}>
				<EmailPanel>
					<EmailText className={s.sectionTitle()}>{labels.items}</EmailText>
					<EmailKeyValue
						rows={[...items, ...adjustments]}
						total={{ label: labels.total, value: total }}
					/>
				</EmailPanel>
			</Section>
			<Section className={r.details()}>
				<EmailKeyValue
					density="compact"
					rows={[
						{ label: labels.receipt, value: receiptNumber },
						{ label: labels.date, value: date },
						{ label: labels.paymentMethod, value: paymentMethod },
					]}
				/>
			</Section>
			{billingLines.length > 0 ? (
				<Section className={s.section()}>
					<EmailText className={s.sectionTitle()}>{labels.billedTo}</EmailText>
					{billingLines.map((line) => (
						<EmailText key={line} tone="muted" size="sm">
							{line}
						</EmailText>
					))}
				</Section>
			) : null}
			{invoiceUrl ? (
				<Section className={s.action()}>
					<EmailButton href={invoiceUrl} shape="pill">
						{actionLabel}
					</EmailButton>
				</Section>
			) : null}
			{billingEmail ? (
				<>
					<EmailDivider spacing="lg" />
					<EmailText tone="muted" size="sm">
						{helpLabel}{" "}
						<Link href={`mailto:${billingEmail}`} className={s.inlineLink()}>
							{billingEmail}
						</Link>
						.
					</EmailText>
				</>
			) : null}
		</EmailShell>
	);
}
