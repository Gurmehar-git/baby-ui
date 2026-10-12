"use client";

import { type ReactNode, useId, useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../accordion/accordion";
import { Badge } from "../badge/badge";
import { CodeBlock } from "../code-block/code-block";
import { cn } from "../lib/cn";
import { RollingDigits } from "../rolling-digits/rolling-digits";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group/toggle-group";
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
} from "./changelog";
import { type ChangelogFeedVariant, changelogFeed } from "./variants";

export type { ChangelogEntry, ChangelogFeedVariant, ChangelogKind, ChangelogMedia };

export interface ChangelogFeedProps {
	/** Release notes; grouped by month, newest first. */
	entries: ChangelogEntry[];
	/** `timeline` threads entries on a rail; `list` is plain rows. */
	variant?: ChangelogFeedVariant;
	title?: string;
	/** One line under the title, such as the latest release. */
	description?: string;
	/** Beside the title, e.g. a subscribe control. */
	actions?: ReactNode;
	/** Closing line after the last entry. */
	endNote?: string;
	/** Kinds shown; empty shows all. */
	kinds?: ChangelogKind[];
	onKindsChange?: (kinds: ChangelogKind[]) => void;
	/** Open entry ids; defaults to the newest. */
	value?: string[];
	onValueChange?: (value: string[]) => void;
	locale?: string;
	className?: string;
}

/** Release notes by month: kind filters with counts, sticky month headings, and entries that open into details, a photo or a snippet. */
export function ChangelogFeed({
	entries,
	variant = "list",
	title = "Changelog",
	description,
	actions,
	endNote,
	kinds: kindsProp,
	onKindsChange,
	value,
	onValueChange,
	locale,
	className,
}: ChangelogFeedProps) {
	const id = useId();
	const s = changelogFeed({ variant });
	const months = changelogMonths(entries, locale);
	const [ownKinds, setOwnKinds] = useState<ChangelogKind[]>([]);
	const [ownOpen, setOwnOpen] = useState<string[]>(() => {
		const newest = months[0]?.items[0];
		return newest ? [newest.id] : [];
	});
	const kinds = kindsProp ?? ownKinds;
	const open = value ?? ownOpen;
	const shown = entries.filter((entry) => kindShown(entry, kinds));
	const setKinds = (next: string | string[]) => {
		const list = (Array.isArray(next) ? next : [next]).flatMap((v) =>
			CHANGELOG_KINDS.filter((k) => k.id === v).map((k) => k.id),
		);
		if (kindsProp === undefined) setOwnKinds(list);
		onKindsChange?.(list);
	};
	const setOpen = (next: string | string[]) => {
		const list = Array.isArray(next) ? next : next ? [next] : [];
		if (value === undefined) setOwnOpen(list);
		onValueChange?.(list);
	};

	return (
		<section
			data-slot="changelog-feed"
			data-variant={variant}
			aria-labelledby={`${id}-title`}
			className={cn(s.root(), className)}
		>
			<div className={s.inner()}>
				<header className={s.header()}>
					<div className={s.heading()}>
						<h2 id={`${id}-title`} className={s.title()}>
							{title}
						</h2>
						{description ? <p className={s.description()}>{description}</p> : null}
					</div>
					{actions}
				</header>
				<div className={s.toolbar()}>
					<ToggleGroup
						type="multiple"
						variant="chip"
						size="sm"
						label="Filter by kind"
						value={kinds}
						onValueChange={setKinds}
					>
						{CHANGELOG_KINDS.map((kind) => (
							<ToggleGroupItem key={kind.id} value={kind.id}>
								{kind.label}
								<span className={s.filterCount()}>{kindCount(entries, kind.id)}</span>
							</ToggleGroupItem>
						))}
					</ToggleGroup>
					<p className={s.count()} aria-live="polite">
						<RollingDigits value={shown.length} startOnView={false} /> updates
					</p>
				</div>
				{months.map((month) => {
					const visible = month.items.some((entry) => kindShown(entry, kinds));
					return (
						<div
							key={month.key}
							data-hidden={!visible}
							inert={!visible}
							className={s.month()}
						>
							<div className={s.monthInner()}>
								<h3 className={s.monthLabel()}>{month.label}</h3>
								<Accordion
									type="multiple"
									value={open}
									onValueChange={setOpen}
									className={s.list()}
								>
									{month.items.map((entry) => {
										const gone = !kindShown(entry, kinds);
										return (
											<AccordionItem
												key={entry.id}
												value={entry.id}
												data-hidden={gone}
												inert={gone}
												className={s.row()}
											>
												<div className={s.rowInner()}>
													<AccordionTrigger className={s.trigger()}>
														<span className={s.triggerBody()}>
															<span className={s.meta()}>
																<time dateTime={entry.date}>
																	{changelogDay(entry.date, locale)}
																</time>
																<span className={s.version()}>v{entry.version}</span>
															</span>
															<span className={s.body()}>
																<span className={s.titleLine()}>
																	<Badge variant={kindBadge[entry.kind]} size="sm">
																		{
																			CHANGELOG_KINDS.find((k) => k.id === entry.kind)
																				?.label
																		}
																	</Badge>
																	{entry.title}
																</span>
																<span className={s.summary()}>{entry.summary}</span>
															</span>
														</span>
													</AccordionTrigger>
													<AccordionContent className={s.panel()}>
														{entry.details?.length ? (
															<ul className={s.details()}>
																{entry.details.map((detail) => (
																	<li key={detail}>{detail}</li>
																))}
															</ul>
														) : null}
														{entry.media?.type === "photo" ? (
															<figure className={s.figure()}>
																<img
																	src={entry.media.src}
																	alt={entry.media.alt}
																	loading="lazy"
																	decoding="async"
																	className={s.photo()}
																/>
																{entry.media.caption ? (
																	<figcaption className={s.caption()}>
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
				{shown.length === 0 ? (
					<p className={s.empty()}>No updates of that kind.</p>
				) : null}
				{endNote && shown.length ? <p className={s.end()}>{endNote}</p> : null}
			</div>
		</section>
	);
}
