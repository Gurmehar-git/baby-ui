<script lang="ts">
import { Section } from "@better-svelte-email/components";
import EmailButton from "../../email-kit/svelte/email-button.svelte";
import EmailCallout from "../../email-kit/svelte/email-callout.svelte";
import EmailCode from "../../email-kit/svelte/email-code.svelte";
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
import { type EmailShellSurface, emailLayout } from "../../email-kit/svelte/variants";
import { emailMagicLink } from "./variants";

let {
	productName,
	signInUrl,
	expiresIn,
	companyLines,
	code,
	requestDetails = [],
	logoUrl,
	footerLinks,
	reason,
	preview = code
		? `Your ${productName} sign-in code is ${code}.`
		: `Your ${productName} sign-in link is inside.`,
	heading = `Sign in to ${productName}`,
	intro = code
		? "Enter this code to finish signing in, or use the button below."
		: "Use the button below to sign in. The link works once.",
	actionLabel = `Sign in to ${productName}`,
	codeLabel = "Your sign-in code",
	expiryText = `This ${code ? "code" : "link"} expires in ${expiresIn}.`,
	detailsTitle = "Request details",
	warningTitle = "Didn't try to sign in?",
	warningText = "You can safely ignore this email. Nobody can sign in without it.",
	surface = "card",
}: {
	productName: string;
	/** One-time sign-in link. */
	signInUrl: string;
	/** Pre-formatted lifetime, e.g. "10 minutes". */
	expiresIn: string;
	/** Sender name and postal address, one line each. */
	companyLines: string[];
	/** One-time code; when set it leads and the button becomes the alternative. */
	code?: string;
	/** Where the request came from, e.g. device, location, time; helps spot a stranger's attempt. */
	requestDetails?: EmailKeyValueRow[];
	/** Absolute PNG URL of a square mark, set beside the product name in header and footer. */
	logoUrl?: string;
	footerLinks?: EmailFooterLink[];
	reason?: string;
	preview?: string;
	heading?: string;
	intro?: string;
	actionLabel?: string;
	codeLabel?: string;
	expiryText?: string;
	detailsTitle?: string;
	warningTitle?: string;
	warningText?: string;
	surface?: Exclude<EmailShellSurface, "stacked">;
} = $props();

const s = emailLayout();
const m = emailMagicLink();
</script>

<EmailShell {preview} {surface}>
	{#snippet cardFooter()}
		<EmailFooter
			lines={companyLines}
			links={footerLinks}
			{reason}
			brand={productName}
			logo={logoUrl}
			layout="row"
			align="left"
		/>
	{/snippet}
	<EmailHeader brand={productName} logo={logoUrl} align="center" />
	<EmailHeading align="center">{heading}</EmailHeading>
	<EmailText tone="muted" class={m.intro()}>{intro}</EmailText>
	{#if code}
		<Section class={s.section()}>
			<EmailPanel tone="accent">
				<EmailText class={m.codeLabel()}>{codeLabel}</EmailText>
				<EmailCode {code} />
			</EmailPanel>
		</Section>
	{/if}
	<Section class={s.action()}>
		<EmailButton href={signInUrl} variant={code ? "secondary" : "primary"} width="full">
			{actionLabel}
		</EmailButton>
	</Section>
	<EmailText tone="muted" size="sm" class={m.expiry()}>{expiryText}</EmailText>
	{#if requestDetails.length > 0}
		<Section class={s.section()}>
			<EmailPanel tone="outline">
				<EmailText class={s.sectionTitle()}>{detailsTitle}</EmailText>
				<EmailKeyValue rows={requestDetails} density="compact" />
			</EmailPanel>
		</Section>
	{/if}
	<Section class={s.section()}>
		<EmailCallout tone="warning" title={warningTitle}>
			<EmailText size="sm">{warningText}</EmailText>
		</EmailCallout>
	</Section>
</EmailShell>
