<script lang="ts">
import { Link, Section } from "@better-svelte-email/components";
import EmailButton from "../../email-kit/svelte/email-button.svelte";
import EmailDivider from "../../email-kit/svelte/email-divider.svelte";
import EmailFallbackLink from "../../email-kit/svelte/email-fallback-link.svelte";
import EmailFooter, {
	type EmailFooterLink,
} from "../../email-kit/svelte/email-footer.svelte";
import EmailHeader from "../../email-kit/svelte/email-header.svelte";
import EmailHero from "../../email-kit/svelte/email-hero.svelte";
import EmailKeyValue, {
	type EmailKeyValueRow,
} from "../../email-kit/svelte/email-key-value.svelte";
import EmailShell from "../../email-kit/svelte/email-shell.svelte";
import EmailText from "../../email-kit/svelte/email-text.svelte";
import { type EmailShellSurface, emailLayout } from "../../email-kit/variants";
import { emailPasswordReset } from "../variants";

let {
	productName,
	resetUrl,
	expiresIn,
	companyLines,
	recipientEmail,
	requestedAt,
	requestDetails = [],
	securityUrl,
	logoUrl,
	footerLinks,
	reason,
	preview = `Reset your ${productName} password. The link expires in ${expiresIn}.`,
	eyebrow = "Password reset",
	heading = "Reset your password",
	intro = `We received a request to reset the password for ${recipientEmail ?? `your ${productName} account`}.`,
	prompt = "Choose a new password with the button below.",
	actionLabel = "Reset password",
	expiryText = `This link expires in ${expiresIn} and can be used once.`,
	fallbackLabel,
	detailsTitle = "Request details",
	warningTitle = "Didn't request this?",
	warningText = "Ignore this email and your password stays the same.",
	securityLabel = "Review your account security",
	surface = "card",
}: {
	productName: string;
	/** One-time reset link. */
	resetUrl: string;
	/** Pre-formatted lifetime, e.g. "1 hour". */
	expiresIn: string;
	/** Sender name and postal address, one line each. */
	companyLines: string[];
	/** The account's address, shown back so the reader knows which account this is. */
	recipientEmail?: string;
	/** Pre-formatted time of the request, shown top right of the hero panel. */
	requestedAt?: string;
	/** Where the request came from, e.g. device, location, time. */
	requestDetails?: EmailKeyValueRow[];
	/** Account security page, linked for readers who didn't ask. */
	securityUrl?: string;
	/** Absolute PNG URL of a square mark, set beside the product name in header and footer. */
	logoUrl?: string;
	footerLinks?: EmailFooterLink[];
	reason?: string;
	preview?: string;
	/** Small label top left of the hero panel. */
	eyebrow?: string;
	heading?: string;
	intro?: string;
	/** Centred line above the button. */
	prompt?: string;
	actionLabel?: string;
	expiryText?: string;
	fallbackLabel?: string;
	detailsTitle?: string;
	warningTitle?: string;
	warningText?: string;
	securityLabel?: string;
	surface?: Exclude<EmailShellSurface, "stacked">;
} = $props();

const s = emailLayout();
const r = emailPasswordReset();
</script>

<EmailShell {preview} {surface}>
	{#snippet cardFooter()}
		<EmailFooter lines={companyLines} links={footerLinks} {reason} brand={productName} logo={logoUrl} layout="band" />
	{/snippet}
	<EmailHeader brand={productName} logo={logoUrl} />
	<EmailHero {eyebrow} meta={requestedAt} title={heading} text={intro} tone="accent" />
	<EmailText class={r.prompt()}>{prompt}</EmailText>
	<Section class={r.action()}>
		<EmailButton href={resetUrl} size="lg" width="full">{actionLabel}</EmailButton>
	</Section>
	<EmailText tone="muted" size="sm" class={r.reassurance()}>
		{`${expiryText} ${warningTitle} ${warningText}`}{#if securityUrl}{" "}<Link href={securityUrl} class={s.inlineLink()}>{securityLabel}</Link>.{/if}
	</EmailText>
	{#if requestDetails.length > 0}
		<Section class={s.section()}>
			<EmailText class={s.sectionTitle()}>{detailsTitle}</EmailText>
			<EmailKeyValue rows={requestDetails} density="compact" />
		</Section>
	{/if}
	<EmailDivider spacing="lg" />
	<EmailFallbackLink href={resetUrl} label={fallbackLabel} />
</EmailShell>
