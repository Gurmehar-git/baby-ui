import type { ReactNode } from "react";
import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	pixelBasedPreset,
	Row,
	Section,
	Tailwind,
	Text,
} from "react-email";
import { cn } from "../../lib/react/cn";
import { emailTailwindConfig } from "../../lib/react/email-theme";
import {
	EMAIL_STAT_TREND_GLYPH,
	type EmailBadgeTone,
	type EmailButtonShape,
	type EmailButtonSize,
	type EmailButtonVariant,
	type EmailButtonWidth,
	type EmailCalloutTone,
	type EmailCodeSize,
	type EmailDividerSpacing,
	type EmailFallbackLinkAlign,
	type EmailFooterAlign,
	type EmailFooterLayout,
	type EmailHeaderAlign,
	type EmailHeaderVariant,
	type EmailHeadingAlign,
	type EmailHeadingSize,
	type EmailHeroAlign,
	type EmailHeroSize,
	type EmailHeroTone,
	type EmailKeyValueDensity,
	type EmailListMarker,
	type EmailPanelTone,
	type EmailSectionAlign,
	type EmailShellSurface,
	type EmailStatsColumns,
	type EmailStatsTone,
	type EmailStatsTrend,
	type EmailTextSize,
	type EmailTextTone,
	emailBadge,
	emailButton,
	emailCallout,
	emailCode,
	emailDivider,
	emailFallbackLink,
	emailFooter,
	emailHeader,
	emailHeading,
	emailHero,
	emailKeyValue,
	emailList,
	emailPanel,
	emailSection,
	emailShell,
	emailStats,
	emailText,
} from "./variants";

export type {
	EmailBadgeTone,
	EmailButtonShape,
	EmailButtonSize,
	EmailButtonVariant,
	EmailButtonWidth,
	EmailCalloutTone,
	EmailCodeSize,
	EmailDividerSpacing,
	EmailFallbackLinkAlign,
	EmailFooterAlign,
	EmailFooterLayout,
	EmailHeaderAlign,
	EmailHeaderVariant,
	EmailHeadingAlign,
	EmailHeadingSize,
	EmailHeroAlign,
	EmailHeroSize,
	EmailHeroTone,
	EmailKeyValueDensity,
	EmailListMarker,
	EmailPanelTone,
	EmailSectionAlign,
	EmailShellSurface,
	EmailStatsColumns,
	EmailStatsTone,
	EmailStatsTrend,
	EmailTextSize,
	EmailTextTone,
};

const tailwindConfig = { ...emailTailwindConfig, presets: [pixelBasedPreset] };

export interface EmailShellProps {
	/** Inbox preview line shown after the subject; keep it under ~90 characters. */
	preview: string;
	children: ReactNode;
	lang?: string;
	surface?: EmailShellSurface;
	/** Rendered under the card, e.g. a `plain` EmailFooter. */
	footer?: ReactNode;
	/** Rendered inside the card after the content, edge to edge, e.g. a `band` or `bar` footer. */
	cardFooter?: ReactNode;
}

/** Document, theme and layout for every template: a centred card on a quiet page. */
export function EmailShell({
	preview,
	children,
	lang = "en",
	surface = "card",
	footer,
	cardFooter,
}: EmailShellProps) {
	const s = emailShell({ surface });
	return (
		<Html lang={lang}>
			<Tailwind config={tailwindConfig}>
				<Head>
					<meta name="color-scheme" content="light dark" />
					<meta name="supported-color-schemes" content="light dark" />
				</Head>
				<Preview>{preview}</Preview>
				<Body className={s.body()}>
					<Section className={s.page()}>
						<Container className={s.container()}>
							<Section className={s.card()}>
								<Section className={s.content()}>{children}</Section>
								{cardFooter}
							</Section>
							{footer}
						</Container>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	);
}

export interface EmailHeaderProps {
	brand: string;
	/** Absolute PNG or JPG URL, 32px tall; SVG does not render in Gmail or Outlook. */
	logo?: string;
	/** Rendered width of `logo`: 32 for a square mark, wider for a `logo` wordmark. */
	logoWidth?: number;
	/** `lockup` sets the name beside a square mark; `logo` shows a wordmark image alone. */
	variant?: EmailHeaderVariant;
	align?: EmailHeaderAlign;
}

export function EmailHeader({
	brand,
	logo,
	logoWidth = 32,
	variant = "lockup",
	align = "left",
}: EmailHeaderProps) {
	const s = emailHeader({ variant, align });
	return (
		<Text className={s.root()}>
			{logo ? (
				<Img
					src={logo}
					alt={variant === "logo" ? brand : ""}
					role={variant === "logo" ? undefined : "presentation"}
					width={logoWidth}
					height={32}
					className={s.logo()}
				/>
			) : null}
			{logo && variant === "logo" ? null : <span className={s.name()}>{brand}</span>}
		</Text>
	);
}

export function EmailHeading({
	children,
	size = "lg",
	align = "left",
}: {
	children: ReactNode;
	size?: EmailHeadingSize;
	align?: EmailHeadingAlign;
}) {
	return (
		<Heading as="h1" className={emailHeading({ size, align })}>
			{children}
		</Heading>
	);
}

export interface EmailHeroProps {
	title: string;
	text?: string;
	/** Small label top left, e.g. "Security" or "Order NW-58213". */
	eyebrow?: string;
	/** Small text top right, e.g. a pre-formatted date. */
	meta?: string;
	/** Absolute URL of an illustration or photo shown under the text. */
	imageUrl?: string;
	imageAlt?: string;
	tone?: EmailHeroTone;
	size?: EmailHeroSize;
	align?: EmailHeroAlign;
}

/** A tinted opening panel: eyebrow and date, a large headline, a line of text and an image. */
export function EmailHero({
	title,
	text,
	eyebrow,
	meta,
	imageUrl,
	imageAlt,
	tone = "muted",
	size = "display",
	align = "left",
}: EmailHeroProps) {
	const s = emailHero({ tone, size, align });
	return (
		<Section className={s.root()}>
			{eyebrow || meta ? (
				<Row>
					<Column>
						<Text className={s.eyebrow()}>{eyebrow ?? ""}</Text>
					</Column>
					<Column>
						<Text className={s.meta()}> {meta ?? ""}</Text>
					</Column>
				</Row>
			) : null}
			<Heading as="h1" className={s.title()}>
				{title}
			</Heading>
			{text ? <Text className={s.text()}>{text}</Text> : null}
			{imageUrl ? (
				<Img src={imageUrl} alt={imageAlt ?? title} width={480} className={s.image()} />
			) : null}
		</Section>
	);
}

/** A tinted, rounded box that groups a summary: totals, details, a notice. */
export function EmailPanel({
	children,
	tone = "muted",
}: {
	children: ReactNode;
	tone?: EmailPanelTone;
}) {
	return <Section className={emailPanel({ tone })}>{children}</Section>;
}

/** One card of a `stacked` EmailShell. */
export function EmailSection({
	children,
	align = "left",
}: {
	children: ReactNode;
	align?: EmailSectionAlign;
}) {
	return <Section className={emailSection({ align })}>{children}</Section>;
}

export interface EmailListItem {
	title?: string;
	text: string;
	/** Absolute URL of a 20px icon; used when `marker` is "icon". */
	iconUrl?: string;
}

/** A list with a marker per row: numbered steps, check marks, dots or your own icons. */
export function EmailList({
	items,
	marker = "number",
}: {
	items: EmailListItem[];
	marker?: EmailListMarker;
}) {
	const s = emailList({ marker });
	return (
		<Section>
			{items.map((item, i) => (
				<Row key={`${item.title ?? ""}-${item.text}`}>
					<Column className={s.markerCell()}>
						{marker === "icon" && item.iconUrl ? (
							<Img
								src={item.iconUrl}
								alt=""
								width={20}
								height={20}
								className={s.icon()}
							/>
						) : (
							<Text className={s.marker()}>
								{marker === "number" ? i + 1 : marker === "check" ? "✓" : "•"}
							</Text>
						)}
					</Column>
					<Column className={s.body()}>
						{item.title ? <Text className={s.title()}>{item.title}</Text> : null}
						<Text className={s.text()}>{item.text}</Text>
					</Column>
				</Row>
			))}
		</Section>
	);
}

export function EmailText({
	children,
	tone = "default",
	size = "default",
	className,
}: {
	children: ReactNode;
	tone?: EmailTextTone;
	size?: EmailTextSize;
	className?: string;
}) {
	return <Text className={cn(emailText({ tone, size }), className)}>{children}</Text>;
}

/** A short label such as "Security" or "Receipt"; the text carries the meaning, not the tone. */
export function EmailBadge({
	children,
	tone = "neutral",
}: {
	children: ReactNode;
	tone?: EmailBadgeTone;
}) {
	return <Text className={emailBadge({ tone })}>{children}</Text>;
}

export function EmailButton({
	href,
	children,
	variant = "primary",
	size = "default",
	shape = "rounded",
	width = "auto",
}: {
	href: string;
	children: ReactNode;
	variant?: EmailButtonVariant;
	size?: EmailButtonSize;
	shape?: EmailButtonShape;
	width?: EmailButtonWidth;
}) {
	return (
		<Button href={href} className={emailButton({ variant, size, shape, width })}>
			{children}
		</Button>
	);
}

export function EmailCallout({
	children,
	title,
	tone = "neutral",
}: {
	children: ReactNode;
	/** Bold first line, e.g. "Didn't request this?". */
	title?: string;
	tone?: EmailCalloutTone;
}) {
	const s = emailCallout({ tone });
	return (
		<Section className={s.root()}>
			{title ? <Text className={s.title()}>{title}</Text> : null}
			{children}
		</Section>
	);
}

export function EmailDivider({ spacing = "md" }: { spacing?: EmailDividerSpacing }) {
	return <Hr className={emailDivider({ spacing })} />;
}

export interface EmailFooterLink {
	label: string;
	href: string;
}

export interface EmailFooterProps {
	/** Sender identity and postal address: required for commercial mail in many regions. */
	lines: string[];
	links?: EmailFooterLink[];
	/** Why the recipient got this email, e.g. "You're receiving this because you signed up". */
	reason?: string;
	/** Product name, set as a small lockup above the legal lines (inside the bar for `bar`). */
	brand?: string;
	/** Absolute URL of the square mark beside `brand`, shown at 20px. */
	logo?: string;
	/** `plain` goes in EmailShell's `footer`; `band`, `bar` and `row` go in its `cardFooter`. */
	layout?: EmailFooterLayout;
	align?: EmailFooterAlign;
}

export function EmailFooter({
	lines,
	links = [],
	reason,
	brand,
	logo,
	layout = "plain",
	align = "center",
}: EmailFooterProps) {
	const s = emailFooter({ layout, align });
	const lockup = brand ? (
		<Text className={s.brand()}>
			{logo ? (
				<Img
					src={logo}
					alt=""
					role="presentation"
					width={20}
					height={20}
					className={s.mark()}
				/>
			) : null}
			<span className={logo ? s.markName() : undefined}>{brand}</span>
		</Text>
	) : null;
	const linkRow =
		links.length > 0 ? (
			<Text className={s.linkText()}>
				{links.map((link, i) => (
					<span key={link.href}>
						{i > 0 ? " · " : null}
						<Link href={link.href} className={s.link()}>
							{link.label}
						</Link>
					</span>
				))}
			</Text>
		) : null;
	const legal = (
		<>
			{reason ? <Text className={s.reason()}>{reason}</Text> : null}
			{lines.map((line) => (
				<Text key={line} className={s.text()}>
					{line}
				</Text>
			))}
		</>
	);
	if (layout === "bar")
		return (
			<Section className={s.root()}>
				<Section className={s.bar()}>
					<Row>
						<Column>{lockup}</Column>
						<Column className={s.linksCell()}>{linkRow}</Column>
					</Row>
				</Section>
				<Section className={s.legal()}>{legal}</Section>
			</Section>
		);
	if (layout === "row")
		return (
			<Section className={s.root()}>
				{lockup}
				<Row>
					<Column>{legal}</Column>
					<Column className={s.linksCell()}>{linkRow}</Column>
				</Row>
			</Section>
		);
	return (
		<Section className={s.root()}>
			{lockup}
			{legal}
			{linkRow}
		</Section>
	);
}

export function EmailCode({ code, size = "lg" }: { code: string; size?: EmailCodeSize }) {
	return <Text className={emailCode({ size })}>{code}</Text>;
}

/** The raw URL under a button, for clients that block buttons or strip styles. */
export function EmailFallbackLink({
	href,
	label = "If the button doesn't work, paste this link into your browser:",
	align = "left",
}: {
	href: string;
	label?: string;
	align?: EmailFallbackLinkAlign;
}) {
	const s = emailFallbackLink({ align });
	return (
		<Text className={s.root()}>
			{label}{" "}
			<Link href={href} className={s.link()}>
				{href}
			</Link>
		</Text>
	);
}

export interface EmailStat {
	/** Pre-formatted, e.g. "1,284" or "$12.4k". */
	value: string;
	label: string;
	/** Change or context in words, e.g. "Up 12% vs last week"; colour never carries it alone. */
	note?: string;
	/** Prefixes `note` with an arrow, tinted in dark mode. */
	trend?: EmailStatsTrend;
}

/** Headline numbers in a grid of cards, `columns` per row. */
export function EmailStats({
	items,
	columns = 3,
	tone = "neutral",
}: {
	items: EmailStat[];
	columns?: EmailStatsColumns;
	tone?: EmailStatsTone;
}) {
	const s = emailStats({ columns, tone });
	const rows: EmailStat[][] = [];
	for (let i = 0; i < items.length; i += columns) rows.push(items.slice(i, i + columns));
	return (
		<Section>
			{rows.map((row, r) => (
				<Section key={row.map((item) => item.label).join("|")}>
					{r > 0 ? <Section className={s.rowGap()} /> : null}
					<Row>
						{row.flatMap((item, i) => [
							i > 0 ? <Column key={`${item.label}-gap`} className={s.gap()} /> : null,
							<Column key={item.label} className={s.cell()}>
								<Section className={s.card()}>
									<Text className={s.value()}>{item.value}</Text>
									<Text className={s.label()}>{item.label}</Text>
									{item.note ? (
										<Text className={s.note({ trend: item.trend })}>
											{item.trend ? EMAIL_STAT_TREND_GLYPH[item.trend] : ""}
											{item.note}
										</Text>
									) : null}
								</Section>
							</Column>,
						])}
					</Row>
				</Section>
			))}
		</Section>
	);
}

export interface EmailKeyValueRow {
	label: string;
	value: string;
}

export function EmailKeyValue({
	rows,
	total,
	density = "comfortable",
}: {
	rows: EmailKeyValueRow[];
	/** Emphasised last row with a rule above it, e.g. an order total. */
	total?: EmailKeyValueRow;
	density?: EmailKeyValueDensity;
}) {
	const s = emailKeyValue({ density });
	return (
		<Section>
			{rows.map((row) => (
				<Row key={row.label}>
					<Column className={s.label()}>{row.label}</Column>
					{/* The space keeps plain-text renders reading "Label value", not "Labelvalue". */}
					<Column className={s.value()}> {row.value}</Column>
				</Row>
			))}
			{total ? (
				<Row>
					<Column className={cn(s.label(), s.total())}>{total.label}</Column>
					<Column className={cn(s.value(), s.total())}> {total.value}</Column>
				</Row>
			) : null}
		</Section>
	);
}
