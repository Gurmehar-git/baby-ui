import { Link, Section } from "react-email";
import {
	EmailButton,
	EmailDivider,
	EmailFallbackLink,
	EmailFooter,
	type EmailFooterLink,
	EmailHeader,
	EmailHero,
	EmailKeyValue,
	type EmailKeyValueRow,
	EmailShell,
	type EmailShellSurface,
	EmailText,
} from "../../email-kit/react/email-kit";
import { emailLayout } from "../../email-kit/variants";
import { emailPasswordReset } from "../variants";

export interface EmailPasswordResetProps {
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
}

/** Password reset with the request's origin and a clear path for readers who didn't ask. */
export function EmailPasswordReset({
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
}: EmailPasswordResetProps) {
	const s = emailLayout();
	const r = emailPasswordReset();
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
					layout="band"
				/>
			}
		>
			<EmailHeader brand={productName} logo={logoUrl} />
			<EmailHero
				eyebrow={eyebrow}
				meta={requestedAt}
				title={heading}
				text={intro}
				tone="accent"
			/>
			<EmailText className={r.prompt()}>{prompt}</EmailText>
			<Section className={r.action()}>
				<EmailButton href={resetUrl} size="lg" width="full">
					{actionLabel}
				</EmailButton>
			</Section>
			<EmailText tone="muted" size="sm" className={r.reassurance()}>
				{`${expiryText} ${warningTitle} ${warningText}`}
				{securityUrl ? (
					<>
						{" "}
						<Link href={securityUrl} className={s.inlineLink()}>
							{securityLabel}
						</Link>
						.
					</>
				) : null}
			</EmailText>
			{requestDetails.length > 0 ? (
				<Section className={s.section()}>
					<EmailText className={s.sectionTitle()}>{detailsTitle}</EmailText>
					<EmailKeyValue rows={requestDetails} density="compact" />
				</Section>
			) : null}
			<EmailDivider spacing="lg" />
			<EmailFallbackLink href={resetUrl} label={fallbackLabel} />
		</EmailShell>
	);
}
