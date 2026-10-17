"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useId,
	useState,
} from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../../accordion/react/accordion";
import { Badge } from "../../badge/react/badge";
import { CodeBlock } from "../../code-block/react/code-block";
import { cn } from "../../lib/cn";
import type { ImageSlotProps } from "../../lib/image";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import {
	CHANGELOG_KINDS,
	type ChangelogEntry,
	type ChangelogKind,
	type ChangelogMedia,
	changelogDay,
	changelogMonths,
	kindBadge,
	kindCount,
	kindShown,
} from "../changelog";
import { type ChangelogFeedVariant, changelogFeed } from "../variants";

export type { ChangelogEntry, ChangelogFeedVariant, ChangelogKind, ChangelogMedia };

type ChangelogFeedState = {
	entries: ChangelogEntry[];
	locale?: string;
	titleId: string;
	kinds: ChangelogKind[];
	setKinds: (next: string | string[]) => void;
	open: string[];
	setOpen: (next: string | string[]) => void;
	shown: ChangelogEntry[];
	styles: ReturnType<typeof changelogFeed>;
};

const ChangelogFeedContext = createContext<ChangelogFeedState | null>(null);

function useChangelogFeed() {
	const state = useContext(ChangelogFeedContext);
	if (!state)
		throw new Error("ChangelogFeed parts must be rendered inside a ChangelogFeed.");
	return state;
}

export interface ChangelogFeedProps extends Omit<ComponentProps<"section">, "children"> {
	/** Release notes; grouped by month, newest first. */
	entries: ChangelogEntry[];
	/** `timeline` threads entries on a rail; `list` is plain rows. */
	variant?: ChangelogFeedVariant;
	/** Kinds shown; empty shows all. */
	kinds?: ChangelogKind[];
	onKindsChange?: (kinds: ChangelogKind[]) => void;
	/** Open entry ids; defaults to the newest. */
	value?: string[];
	onValueChange?: (value: string[]) => void;
	locale?: string;
	children?: ReactNode;
}

/**
 * Release notes from parts: ChangelogFeedHeader, ChangelogFeedFilters, ChangelogFeedList,
 * ChangelogFeedEmpty and ChangelogFeedEnd.
 */
export function ChangelogFeed({
	entries,
	variant = "list",
	kinds: kindsProp,
	onKindsChange,
	value,
	onValueChange,
	locale,
	className,
	children,
	...props
}: ChangelogFeedProps) {
	const titleId = useId();
	const styles = changelogFeed({ variant });
	const [ownKinds, setOwnKinds] = useState<ChangelogKind[]>([]);
	const [ownOpen, setOwnOpen] = useState<string[]>(() => {
		const newest = changelogMonths(entries, locale)[0]?.items[0];
		return newest ? [newest.id] : [];
	});
	const kinds = kindsProp ?? ownKinds;

	const state: ChangelogFeedState = {
		entries,
		locale,
		titleId,
		kinds,
		setKinds: (next) => {
			const list = (Array.isArray(next) ? next : [next]).flatMap((v) =>
				CHANGELOG_KINDS.filter((k) => k.id === v).map((k) => k.id),
			);
			if (kindsProp === undefined) setOwnKinds(list);
			onKindsChange?.(list);
		},
		open: value ?? ownOpen,
		setOpen: (next) => {
			const list = Array.isArray(next) ? next : next ? [next] : [];
			if (value === undefined) setOwnOpen(list);
			onValueChange?.(list);
		},
		shown: entries.filter((entry) => kindShown(entry, kinds)),
		styles,
	};

	return (
		<ChangelogFeedContext.Provider value={state}>
			<section
				data-slot="changelog-feed"
				data-variant={variant}
				aria-labelledby={titleId}
				className={cn(styles.root(), className)}
				{...props}
			>
				<div className={styles.inner()}>{children}</div>
			</section>
		</ChangelogFeedContext.Provider>
	);
}

/** The top row: ChangelogFeedHeading, then anything beside it such as a subscribe button. */
export function ChangelogFeedHeader({ className, ...props }: ComponentProps<"header">) {
	const { styles } = useChangelogFeed();
	return (
		<header
			data-slot="changelog-feed-header"
			className={cn(styles.header(), className)}
			{...props}
		/>
	);
}

/** Stacks ChangelogFeedTitle over ChangelogFeedDescription. */
export function ChangelogFeedHeading({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useChangelogFeed();
	return (
		<div
			data-slot="changelog-feed-heading"
			className={cn(styles.heading(), className)}
			{...props}
		/>
	);
}

export function ChangelogFeedTitle({ className, ...props }: ComponentProps<"h2">) {
	const { titleId, styles } = useChangelogFeed();
	return (
		<h2
			data-slot="changelog-feed-title"
			id={titleId}
			className={cn(styles.title(), className)}
			{...props}
		/>
	);
}

export function ChangelogFeedDescription({ className, ...props }: ComponentProps<"p">) {
	const { styles } = useChangelogFeed();
	return (
		<p
			data-slot="changelog-feed-description"
			className={cn(styles.description(), className)}
			{...props}
		/>
	);
}

/** New / Improved / Fixed chips with counts, and a rolling total of what is shown. */
export function ChangelogFeedFilters({
	label = "Filter by kind",
	className,
}: {
	label?: string;
	className?: string;
}) {
	const { entries, kinds, setKinds, shown, styles } = useChangelogFeed();
	return (
		<div data-slot="changelog-feed-filters" className={cn(styles.toolbar(), className)}>
			<ToggleGroup
				type="multiple"
				variant="chip"
				size="sm"
				label={label}
				value={kinds}
				onValueChange={setKinds}
			>
				{CHANGELOG_KINDS.map((kind) => (
					<ToggleGroupItem key={kind.id} value={kind.id}>
						{kind.label}
						<span className={styles.filterCount()}>{kindCount(entries, kind.id)}</span>
					</ToggleGroupItem>
				))}
			</ToggleGroup>
			<p className={styles.count()} aria-live="polite">
				<RollingDigits value={shown.length} startOnView={false} /> updates
			</p>
		</div>
	);
}

export interface ChangelogFeedListProps {
	/** Renders each image, e.g. through your framework's image component; defaults to `<img>`. */
	image?: (props: ImageSlotProps) => ReactNode;
	className?: string;
}

/** Entries by month under sticky headings; each opens into its details and media. */
export function ChangelogFeedList({ image, className }: ChangelogFeedListProps) {
	const { entries, locale, kinds, open, setOpen, styles } = useChangelogFeed();
	return (
		<div data-slot="changelog-feed-list" className={className}>
			{changelogMonths(entries, locale).map((month) => {
				const visible = month.items.some((entry) => kindShown(entry, kinds));
				return (
					<div
						key={month.key}
						data-hidden={!visible}
						inert={!visible}
						className={styles.month()}
					>
						<div className={styles.monthInner()}>
							<h3 className={styles.monthLabel()}>{month.label}</h3>
							<Accordion
								type="multiple"
								value={open}
								onValueChange={setOpen}
								className={styles.list()}
							>
								{month.items.map((entry) => {
									const gone = !kindShown(entry, kinds);
									return (
										<AccordionItem
											key={entry.id}
											value={entry.id}
											data-hidden={gone}
											inert={gone}
											className={styles.row()}
										>
											<div className={styles.rowInner()}>
												<AccordionTrigger className={styles.trigger()}>
													<span className={styles.triggerBody()}>
														<span className={styles.meta()}>
															<time dateTime={entry.date}>
																{changelogDay(entry.date, locale)}
															</time>
															<span className={styles.version()}>v{entry.version}</span>
														</span>
														<span className={styles.body()}>
															<span className={styles.titleLine()}>
																<Badge variant={kindBadge[entry.kind]} size="sm">
																	{
																		CHANGELOG_KINDS.find((k) => k.id === entry.kind)
																			?.label
																	}
																</Badge>
																{entry.title}
															</span>
															<span className={styles.summary()}>{entry.summary}</span>
														</span>
													</span>
												</AccordionTrigger>
												<AccordionContent className={styles.panel()}>
													{entry.details?.length ? (
														<ul className={styles.details()}>
															{entry.details.map((detail) => (
																<li key={detail}>{detail}</li>
															))}
														</ul>
													) : null}
													{entry.media?.type === "photo" ? (
														<figure className={styles.figure()}>
															{image ? (
																image({
																	src: entry.media.src,
																	alt: entry.media.alt,
																	className: styles.photo(),
																	loading: "lazy",
																})
															) : (
																<img
																	src={entry.media.src}
																	alt={entry.media.alt}
																	className={styles.photo()}
																	loading="lazy"
																	decoding="async"
																	draggable={false}
																/>
															)}
															{entry.media.caption ? (
																<figcaption className={styles.caption()}>
																	{entry.media.caption}
																</figcaption>
															) : null}
														</figure>
													) : entry.media?.type === "code" ? (
														<CodeBlock
															code={entry.media.code}
															filename={entry.media.file}
															language={entry.media.language}
														/>
													) : null}
												</AccordionContent>
											</div>
										</AccordionItem>
									);
								})}
							</Accordion>
						</div>
					</div>
				);
			})}
		</div>
	);
}

/** Shown when the filters leave nothing; defaults to "No updates of that kind." */
export function ChangelogFeedEmpty({ className, children }: ComponentProps<"p">) {
	const { shown, styles } = useChangelogFeed();
	if (shown.length > 0) return null;
	return (
		<p data-slot="changelog-feed-empty" className={cn(styles.empty(), className)}>
			{children ?? "No updates of that kind."}
		</p>
	);
}

/** A closing line after the last entry; hidden while the filters leave nothing. */
export function ChangelogFeedEnd({ className, ...props }: ComponentProps<"p">) {
	const { shown, styles } = useChangelogFeed();
	if (shown.length === 0) return null;
	return (
		<p
			data-slot="changelog-feed-end"
			className={cn(styles.end(), className)}
			{...props}
		/>
	);
}
