<script lang="ts">
import { Column, Img, Link, Row, Section, Text } from "@better-svelte-email/components";
import EmailButton from "../../email-kit/svelte/email-button.svelte";
import EmailFooter, {
	type EmailFooterLink,
} from "../../email-kit/svelte/email-footer.svelte";
import EmailHeader from "../../email-kit/svelte/email-header.svelte";
import EmailHeading from "../../email-kit/svelte/email-heading.svelte";
import EmailSection from "../../email-kit/svelte/email-section.svelte";
import EmailShell from "../../email-kit/svelte/email-shell.svelte";
import EmailText from "../../email-kit/svelte/email-text.svelte";
import { type EmailWelcomeDensity, emailWelcome } from "../variants";

export interface EmailWelcomeStep {
	title: string;
	description: string;
	/** Deep link into the product for this step. */
	href?: string;
	/** Link text; name the destination, e.g. "Connect a data source". */
	actionLabel?: string;
}

export interface EmailWelcomeResource {
	title: string;
	description: string;
	href: string;
}

/** A short personal note, e.g. from a founder, signed with a name and role. */
export interface EmailWelcomeNote {
	name: string;
	message: string;
	role?: string;
	/** Absolute URL of a square photo. */
	avatarUrl?: string;
}

let {
	productName,
	actionUrl,
	steps,
	companyLines,
	recipientName,
	logoUrl,
	heroImageUrl,
	heroImageAlt,
	actionLabel = "Get started",
	resources = [],
	note,
	supportEmail,
	supportLabel = "Questions? Reply to this email or write to",
	footerLinks,
	preview = `Your ${productName} account is ready. Here is how to get started.`,
	eyebrow = "Thanks for joining",
	heading = recipientName ? `Welcome, ${recipientName}` : `Welcome to ${productName}`,
	intro = `Your ${productName} account is ready. Here is what's worth doing first.`,
	stepsTitle = "Getting started",
	resourcesTitle = "Explore",
	reason,
	density = "comfortable",
}: {
	productName: string;
	/** Where the button lands: usually the dashboard or the first setup screen. */
	actionUrl: string;
	/** Two to four first actions; an empty list hides the section. */
	steps: EmailWelcomeStep[];
	/** Sender name and postal address, one line each. */
	companyLines: string[];
	recipientName?: string;
	/** Absolute PNG URL of a square mark, set beside the product name in header and footer. */
	logoUrl?: string;
	/** Absolute URL of a wide illustration or product shot above the heading. */
	heroImageUrl?: string;
	heroImageAlt?: string;
	actionLabel?: string;
	/** Docs, templates or community links, each a titled row. */
	resources?: EmailWelcomeResource[];
	note?: EmailWelcomeNote;
	/** Shown as a mailto link in the help line; omit to hide the line. */
	supportEmail?: string;
	/** Lead-in before the support address. */
	supportLabel?: string;
	footerLinks?: EmailFooterLink[];
	preview?: string;
	/** Small line above the heading. */
	eyebrow?: string;
	heading?: string;
	intro?: string;
	stepsTitle?: string;
	resourcesTitle?: string;
	/** Footer line saying why this arrived, e.g. "You're receiving this because you signed up". */
	reason?: string;
	density?: EmailWelcomeDensity;
} = $props();

const s = $derived(emailWelcome({ density }));
</script>

{#snippet help()}
	<EmailText tone="muted" size="sm">
		{supportLabel}
		<Link href={`mailto:${supportEmail}`} class={s.link()}>{supportEmail}</Link>.
	</EmailText>
{/snippet}

<EmailShell {preview} surface="stacked">
	{#snippet footer()}
		<EmailFooter lines={companyLines} links={footerLinks} {reason} brand={productName} logo={logoUrl} />
	{/snippet}
	<EmailSection align="center">
		<EmailHeader brand={productName} logo={logoUrl} align="center" />
		{#if heroImageUrl}
			<Img src={heroImageUrl} alt={heroImageAlt ?? productName} width="528" height="auto" class={s.heroImage()} />
		{/if}
		<EmailText class={s.eyebrow()}>{eyebrow}</EmailText>
		<EmailHeading size="display" align="center">{heading}</EmailHeading>
		<EmailText tone="muted" class={s.intro()}>{intro}</EmailText>
		<Section class={s.action()}>
			<EmailButton href={actionUrl} size="lg" shape="pill">{actionLabel}</EmailButton>
		</Section>
	</EmailSection>
	{#if steps.length > 0}
		<EmailSection>
			<EmailHeading size="default">{stepsTitle}</EmailHeading>
			<Section class={s.steps()}>
				{#each steps as step, i (step.title)}
					<Section>
						{#if i > 0}<Section class={s.stepGap()}>{""}</Section>{/if}
						<Row>
							<Column class={s.stepIndex()}>
								<Text class={s.stepBadge()}>{i + 1}</Text>
							</Column>
							<Column>
								<Text class={s.stepTitle()}>{step.title}</Text>
								<Text class={s.stepBody()}>{step.description}</Text>
								{#if step.href}
									<Text class={s.stepLink()}>
										<Link href={step.href} class={s.link()}>{step.actionLabel ?? step.title}</Link>
									</Text>
								{/if}
							</Column>
						</Row>
					</Section>
				{/each}
			</Section>
			{#if !note && supportEmail}
				<Section class={s.help()}>{@render help()}</Section>
			{/if}
		</EmailSection>
	{/if}
	{#if resources.length > 0}
		<EmailSection>
			<EmailHeading size="default">{resourcesTitle}</EmailHeading>
			<Section class={s.steps()}>
				{#each resources as resource (resource.href)}
					<Section class={s.resource()}>
						<Text class={s.resourceTitle()}>
							<Link href={resource.href} class={s.link()}>{resource.title}</Link>
						</Text>
						<EmailText tone="muted" size="sm">{resource.description}</EmailText>
					</Section>
				{/each}
			</Section>
		</EmailSection>
	{/if}
	{#if note}
		<EmailSection>
			<Row>
				{#if note.avatarUrl}
					<Column class={s.noteAvatarCell()}>
						<Img src={note.avatarUrl} alt={note.name} width="40" height="40" class={s.noteAvatar()} />
					</Column>
				{/if}
				<Column>
					<Text class={s.noteName()}>{note.name}</Text>
					{#if note.role}<Text class={s.noteRole()}>{note.role}</Text>{/if}
				</Column>
			</Row>
			<EmailText class={s.noteMessage()}>{note.message}</EmailText>
			{#if supportEmail}
				<Section class={s.help()}>{@render help()}</Section>
			{/if}
		</EmailSection>
	{/if}
	{#if !note && steps.length === 0 && supportEmail}
		<EmailSection align="center">{@render help()}</EmailSection>
	{/if}
</EmailShell>
