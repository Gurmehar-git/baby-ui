<script lang="ts">
import { Img, Section, Text } from "@better-svelte-email/components";
import EmailBadge from "../../email-kit/svelte/email-badge.svelte";
import EmailButton from "../../email-kit/svelte/email-button.svelte";
import EmailDivider from "../../email-kit/svelte/email-divider.svelte";
import EmailFallbackLink from "../../email-kit/svelte/email-fallback-link.svelte";
import EmailFooter, {
	type EmailFooterLink,
} from "../../email-kit/svelte/email-footer.svelte";
import EmailHeader from "../../email-kit/svelte/email-header.svelte";
import EmailHeading from "../../email-kit/svelte/email-heading.svelte";
import EmailPanel from "../../email-kit/svelte/email-panel.svelte";
import EmailShell from "../../email-kit/svelte/email-shell.svelte";
import EmailText from "../../email-kit/svelte/email-text.svelte";
import { type EmailShellSurface, emailLayout } from "../../email-kit/svelte/variants";
import { emailTeamInvite, initials } from "./variants";

let {
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
}: {
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
} = $props();

const s = emailLayout();
const t = emailTeamInvite();
</script>

<EmailShell {preview} {surface}>
	{#snippet cardFooter()}
		<EmailFooter lines={companyLines} links={footerLinks} {reason} brand={productName} logo={logoUrl} layout="band" />
	{/snippet}
	<EmailHeader brand={productName} logo={logoUrl} align="center" />
	{#if inviterAvatarUrl}
		<Img src={inviterAvatarUrl} alt={inviterName} width="64" height="64" class={t.avatar()} />
	{:else}
		<Text class={t.initials()}>{initials(inviterName)}</Text>
	{/if}
	<Text class={t.lead()}>{lead}</Text>
	<EmailHeading size="display" align="center">{heading ?? teamName}</EmailHeading>
	{#if role}
		<Section class={t.role()}>
			<EmailBadge tone="accent">{role}</EmailBadge>
		</Section>
	{/if}
	{#if message}
		<Section class={s.section()}>
			<EmailPanel>
				<EmailText>“{message}”</EmailText>
				<Text class={t.signoff()}>{inviterName}{inviterEmail ? `, ${inviterEmail}` : ""}</Text>
			</EmailPanel>
		</Section>
	{/if}
	<Section class={s.action()}>
		<EmailButton href={acceptUrl} size="lg" shape="pill" width="full">{actionLabel}</EmailButton>
	</Section>
	<EmailText tone="muted" size="sm" class={t.closing()}>{closingText}</EmailText>
	<EmailDivider spacing="lg" />
	<EmailFallbackLink href={acceptUrl} label={fallbackLabel} align="center" />
</EmailShell>
