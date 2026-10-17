import { Img, Section, Text } from "react-email";
import {
	EmailBadge,
	EmailButton,
	EmailDivider,
	EmailFallbackLink,
	EmailFooter,
	type EmailFooterLink,
	EmailHeader,
	EmailHeading,
	EmailPanel,
	EmailShell,
	type EmailShellSurface,
	EmailText,
} from "../../email-kit/react/email-kit";
import { emailLayout } from "../../email-kit/variants";
import { emailTeamInvite, initials } from "../variants";

export interface EmailTeamInviteProps {
	productName: string;
	inviterName: string;
	teamName: string;
	/** One-time link that joins the team. */
	acceptUrl: string;
	/** Sender name and postal address, one line each. */
	companyLines: string[];
	inviterEmail?: string;
	/** Absolute URL of the inviter's photo; initials show without it. */
	inviterAvatarUrl?: string;
	/** Role the invitee joins with, e.g. "Editor". */
	role?: string;
	/** A personal note from the inviter, shown quoted. */
	message?: string;
	/** Pre-formatted lifetime, e.g. "7 days". */
	expiresIn?: string;
	/** Absolute PNG URL of a square mark, set beside the product name in header and footer. */
	logoUrl?: string;
	footerLinks?: EmailFooterLink[];
	reason?: string;
	preview?: string;
	/** Defaults to the team name. */
	heading?: string;
	/** Line above the team name. */
	lead?: string;
	actionLabel?: string;
	closingText?: string;
	fallbackLabel?: string;
	surface?: Exclude<EmailShellSurface, "stacked">;
}

/** A team invite led by the inviter's face, the team name and the role on offer. */
export function EmailTeamInvite({
	productName,
	inviterName,
	teamName,
	acceptUrl,
	companyLines,
	inviterEmail,
	inviterAvatarUrl,
	role,
	message,
	expiresIn,
	logoUrl,
	footerLinks,
	reason,
	preview = `${inviterName} invited you to join ${teamName} on ${productName}.`,
	heading,
	lead = `${inviterName} invited you to join`,
	actionLabel = "Accept invitation",
	closingText = `${expiresIn ? `This invitation expires in ${expiresIn}. ` : ""}If you weren't expecting it, you can ignore this email.`,
	fallbackLabel,
	surface = "card",
}: EmailTeamInviteProps) {
	const s = emailLayout();
	const t = emailTeamInvite();
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
			<EmailHeader brand={productName} logo={logoUrl} align="center" />
			{inviterAvatarUrl ? (
				<Img
					src={inviterAvatarUrl}
					alt={inviterName}
					width={64}
					height={64}
					className={t.avatar()}
				/>
			) : (
				<Text className={t.initials()}>{initials(inviterName)}</Text>
			)}
			<Text className={t.lead()}>{lead}</Text>
			<EmailHeading size="display" align="center">
				{heading ?? teamName}
			</EmailHeading>
			{role ? (
				<Section className={t.role()}>
					<EmailBadge tone="accent">{role}</EmailBadge>
				</Section>
			) : null}
			{message ? (
				<Section className={s.section()}>
					<EmailPanel>
						<EmailText>“{message}”</EmailText>
						<Text className={t.signoff()}>
							{inviterName}
							{inviterEmail ? `, ${inviterEmail}` : ""}
						</Text>
					</EmailPanel>
				</Section>
			) : null}
			<Section className={s.action()}>
				<EmailButton href={acceptUrl} size="lg" shape="pill" width="full">
					{actionLabel}
				</EmailButton>
			</Section>
			<EmailText tone="muted" size="sm" className={t.closing()}>
				{closingText}
			</EmailText>
			<EmailDivider spacing="lg" />
			<EmailFallbackLink href={acceptUrl} label={fallbackLabel} align="center" />
		</EmailShell>
	);
}
