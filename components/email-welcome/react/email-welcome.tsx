import { Column, Img, Link, Row, Section, Text } from "react-email";
import {
	EmailButton,
	EmailFooter,
	type EmailFooterLink,
	EmailHeader,
	EmailHeading,
	EmailSection,
	EmailShell,
	EmailText,
} from "../../email-kit/react/email-kit";
import { type EmailWelcomeDensity, emailWelcome } from "../variants";

export type { EmailWelcomeDensity };

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

export interface EmailWelcomeProps {
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
}

/** Separate cards on a quiet page: an image-led opener, first steps, resources and a note. */
export function EmailWelcome({
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
}: EmailWelcomeProps) {
	const s = emailWelcome({ density });
	const help = supportEmail ? (
		<EmailText tone="muted" size="sm">
			{supportLabel}{" "}
			<Link href={`mailto:${supportEmail}`} className={s.link()}>
				{supportEmail}
			</Link>
			.
		</EmailText>
	) : null;
	return (
		<EmailShell
			preview={preview}
			surface="stacked"
			footer={
				<EmailFooter
					lines={companyLines}
					links={footerLinks}
					reason={reason}
					brand={productName}
					logo={logoUrl}
				/>
			}
		>
			<EmailSection align="center">
				<EmailHeader brand={productName} logo={logoUrl} align="center" />
				{heroImageUrl ? (
					<Img
						src={heroImageUrl}
						alt={heroImageAlt ?? productName}
						width={528}
						className={s.heroImage()}
					/>
				) : null}
				<EmailText className={s.eyebrow()}>{eyebrow}</EmailText>
				<EmailHeading size="display" align="center">
					{heading}
				</EmailHeading>
				<EmailText tone="muted" className={s.intro()}>
					{intro}
				</EmailText>
				<Section className={s.action()}>
					<EmailButton href={actionUrl} size="lg" shape="pill">
						{actionLabel}
					</EmailButton>
				</Section>
			</EmailSection>
			{steps.length > 0 ? (
				<EmailSection>
					<EmailHeading size="default">{stepsTitle}</EmailHeading>
					<Section className={s.steps()}>
						{steps.map((step, i) => (
							<Section key={step.title}>
								{i > 0 ? <Section className={s.stepGap()} /> : null}
								<Row>
									<Column className={s.stepIndex()}>
										<Text className={s.stepBadge()}>{i + 1}</Text>
									</Column>
									<Column>
										<Text className={s.stepTitle()}>{step.title}</Text>
										<Text className={s.stepBody()}>{step.description}</Text>
										{step.href ? (
											<Text className={s.stepLink()}>
												<Link href={step.href} className={s.link()}>
													{step.actionLabel ?? step.title}
												</Link>
											</Text>
										) : null}
									</Column>
								</Row>
							</Section>
						))}
					</Section>
					{note ? null : help ? <Section className={s.help()}>{help}</Section> : null}
				</EmailSection>
			) : null}
			{resources.length > 0 ? (
				<EmailSection>
					<EmailHeading size="default">{resourcesTitle}</EmailHeading>
					<Section className={s.steps()}>
						{resources.map((resource) => (
							<Section key={resource.href} className={s.resource()}>
								<Text className={s.resourceTitle()}>
									<Link href={resource.href} className={s.link()}>
										{resource.title}
									</Link>
								</Text>
								<EmailText tone="muted" size="sm">
									{resource.description}
								</EmailText>
							</Section>
						))}
					</Section>
				</EmailSection>
			) : null}
			{note ? (
				<EmailSection>
					<Row>
						{note.avatarUrl ? (
							<Column className={s.noteAvatarCell()}>
								<Img
									src={note.avatarUrl}
									alt={note.name}
									width={40}
									height={40}
									className={s.noteAvatar()}
								/>
							</Column>
						) : null}
						<Column>
							<Text className={s.noteName()}>{note.name}</Text>
							{note.role ? <Text className={s.noteRole()}>{note.role}</Text> : null}
						</Column>
					</Row>
					<EmailText className={s.noteMessage()}>{note.message}</EmailText>
					{help ? <Section className={s.help()}>{help}</Section> : null}
				</EmailSection>
			) : null}
			{!note && steps.length === 0 && help ? (
				<EmailSection align="center">{help}</EmailSection>
			) : null}
		</EmailShell>
	);
}
