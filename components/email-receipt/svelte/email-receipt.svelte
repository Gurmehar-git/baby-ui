<script lang="ts">
import { Link, Section } from "@better-svelte-email/components";
import EmailBadge from "../../email-kit/svelte/email-badge.svelte";
import EmailButton from "../../email-kit/svelte/email-button.svelte";
import EmailDivider from "../../email-kit/svelte/email-divider.svelte";
import EmailFooter, {
	type EmailFooterLink,
} from "../../email-kit/svelte/email-footer.svelte";
import EmailHeader from "../../email-kit/svelte/email-header.svelte";
import EmailHeading from "../../email-kit/svelte/email-heading.svelte";
import EmailKeyValue, {
	type EmailKeyValueRow,
} from "../../email-kit/svelte/email-key-value.svelte";
import EmailPanel from "../../email-kit/svelte/email-panel.svelte";
import EmailShell from "../../email-kit/svelte/email-shell.svelte";
import EmailText from "../../email-kit/svelte/email-text.svelte";
import { type EmailShellSurface, emailLayout } from "../../email-kit/variants";
import { EMAIL_RECEIPT_LABELS, type EmailReceiptLabels, emailReceipt } from "../variants";

let {
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
}: {
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
} = $props();

const s = emailLayout();
const r = emailReceipt();
const labels = $derived({ ...EMAIL_RECEIPT_LABELS, ...labelOverrides });
</script>

<EmailShell {preview} {surface}>
	{#snippet cardFooter()}
		<EmailFooter lines={companyLines} links={footerLinks} {reason} brand={productName} logo={logoUrl} layout="bar" />
	{/snippet}
	<EmailHeader brand={productName} logo={logoUrl} />
	<Section class={s.badge()}>
		<EmailBadge tone="success">{labels.status}</EmailBadge>
	</Section>
	<EmailHeading size="display">{heading}</EmailHeading>
	<EmailText tone="muted" class={s.intro()}>{intro}</EmailText>
	<Section class={r.summary()}>
		<EmailPanel>
			<EmailText class={s.sectionTitle()}>{labels.items}</EmailText>
			<EmailKeyValue rows={[...items, ...adjustments]} total={{ label: labels.total, value: total }} />
		</EmailPanel>
	</Section>
	<Section class={r.details()}>
		<EmailKeyValue
			density="compact"
			rows={[
				{ label: labels.receipt, value: receiptNumber },
				{ label: labels.date, value: date },
				{ label: labels.paymentMethod, value: paymentMethod },
			]}
		/>
	</Section>
	{#if billingLines.length > 0}
		<Section class={s.section()}>
			<EmailText class={s.sectionTitle()}>{labels.billedTo}</EmailText>
			{#each billingLines as line (line)}
				<EmailText tone="muted" size="sm">{line}</EmailText>
			{/each}
		</Section>
	{/if}
	{#if invoiceUrl}
		<Section class={s.action()}>
			<EmailButton href={invoiceUrl} shape="pill">{actionLabel}</EmailButton>
		</Section>
	{/if}
	{#if billingEmail}
		<EmailDivider spacing="lg" />
		<EmailText tone="muted" size="sm">
			{helpLabel}
			<Link href={`mailto:${billingEmail}`} class={s.inlineLink()}>{billingEmail}</Link>.
		</EmailText>
	{/if}
</EmailShell>
