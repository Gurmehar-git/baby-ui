<script lang="ts">
import { Section } from "@better-svelte-email/components";
import EmailButton from "../../email-kit/svelte/email-button.svelte";
import EmailCode from "../../email-kit/svelte/email-code.svelte";
import EmailDivider from "../../email-kit/svelte/email-divider.svelte";
import EmailFallbackLink from "../../email-kit/svelte/email-fallback-link.svelte";
import EmailFooter, {
	type EmailFooterLink,
} from "../../email-kit/svelte/email-footer.svelte";
import EmailHeader from "../../email-kit/svelte/email-header.svelte";
import EmailHeading from "../../email-kit/svelte/email-heading.svelte";
import EmailList, { type EmailListItem } from "../../email-kit/svelte/email-list.svelte";
import EmailPanel from "../../email-kit/svelte/email-panel.svelte";
import EmailShell from "../../email-kit/svelte/email-shell.svelte";
import EmailText from "../../email-kit/svelte/email-text.svelte";
import { type EmailShellSurface, emailLayout } from "../../email-kit/variants";
import { emailVerify } from "../variants";

let {
	productName,
	recipientEmail,
	verifyUrl,
	expiresIn,
	companyLines,
	code,
	helpItems = [],
	logoUrl,
	footerLinks,
	reason,
	preview = `Confirm ${recipientEmail} to finish setting up ${productName}.`,
	heading = "Verify your email",
	subheading = `Thanks for signing up for ${productName}`,
	intro = `Confirm that ${recipientEmail} is your address to finish setting up your ${productName} account.`,
	actionLabel = "Verify email address",
	codeLabel = "Or enter this code in the app",
	fallbackLabel,
	ignoreText = `This link expires in ${expiresIn}. If you didn't create a ${productName} account, you can ignore this email.`,
	noticeTitle = "Security notice",
	helpTitle = "Need help?",
	surface = "card",
}: {
	productName: string;
	/** The address being confirmed, shown back so the reader knows which account this is. */
	recipientEmail: string;
	/** One-time confirmation link. */
	verifyUrl: string;
	/** Pre-formatted lifetime of the link, e.g. "24 hours". */
	expiresIn: string;
	/** Sender name and postal address, one line each. */
	companyLines: string[];
	/** Optional code for people who opened the email on another device. */
	code?: string;
	/** Ways to reach support, e.g. email, phone, hours. */
	helpItems?: EmailListItem[];
	/** Absolute PNG URL of a square mark, set beside the product name in header and footer. */
	logoUrl?: string;
	footerLinks?: EmailFooterLink[];
	/** Footer line saying why this arrived. */
	reason?: string;
	preview?: string;
	heading?: string;
	/** Line under the heading. */
	subheading?: string;
	intro?: string;
	actionLabel?: string;
	codeLabel?: string;
	fallbackLabel?: string;
	/** Security panel text; defaults to the expiry plus "ignore if this wasn't you". */
	ignoreText?: string;
	noticeTitle?: string;
	helpTitle?: string;
	surface?: Exclude<EmailShellSurface, "stacked">;
} = $props();

const s = emailLayout();
const v = emailVerify();
</script>

<EmailShell {preview} {surface}>
	{#snippet cardFooter()}
		<EmailFooter lines={companyLines} links={footerLinks} {reason} brand={productName} logo={logoUrl} layout="band" />
	{/snippet}
	<EmailHeader brand={productName} logo={logoUrl} align="center" />
	<EmailHeading align="center">{heading}</EmailHeading>
	<EmailText tone="muted" class={v.subheading()}>{subheading}</EmailText>
	<EmailText class={v.intro()}>{intro}</EmailText>
	<Section class={v.action()}>
		<EmailButton href={verifyUrl} size="lg">{actionLabel}</EmailButton>
	</Section>
	{#if code}
		<Section class={s.section()}>
			<EmailText tone="muted" size="sm" class={v.codeLabel()}>{codeLabel}</EmailText>
			<EmailCode {code} />
		</Section>
	{/if}
	<Section class={v.fallback()}>
		<EmailFallbackLink href={verifyUrl} label={fallbackLabel} align="center" />
	</Section>
	<Section class={v.notice()}>
		<EmailPanel>
			<EmailText class={s.sectionTitle()}>{noticeTitle}</EmailText>
			<EmailText size="sm">{ignoreText}</EmailText>
		</EmailPanel>
	</Section>
	{#if helpItems.length > 0}
		<EmailDivider spacing="lg" />
		<EmailHeading size="default">{helpTitle}</EmailHeading>
		<Section class={v.helpList()}>
			<EmailList items={helpItems} marker="dot" />
		</Section>
	{/if}
</EmailShell>
