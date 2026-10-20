"use client";

import {
	createContext,
	Fragment,
	type ReactNode,
	useContext,
	useMemo,
	useState,
} from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../../hover-card/react/hover-card";
import { cn } from "../../lib/cn";
import {
	type CitationRef,
	type CitationSegment,
	type CitationSource,
	monogram,
	needsSpace,
	numberCitations,
	segmentActive,
	siteName,
} from "../citation-core";
import { type CitationChip, citationText } from "../variants";

type Active = { segment: number | null; source: string | null };

type CitationCtx = {
	segments: CitationSegment[];
	numbered: ReturnType<typeof numberCitations>;
	chip: CitationChip;
	active: Active;
	activate: (segment: number | null, source: string | null) => void;
	styles: ReturnType<typeof citationText>;
};

const CitationContext = createContext<CitationCtx | null>(null);

function useCitation(part: string): CitationCtx {
	const ctx = useContext(CitationContext);
	if (!ctx) throw new Error(`${part} must be used inside <CitationText>`);
	return ctx;
}

export interface CitationTextProps {
	/** The answer, one entry per sentence or clause; append entries as the answer streams. */
	segments: CitationSegment[];
	sources: CitationSource[];
	/** Chips read as a number, or as the source's site name. */
	chip?: CitationChip;
	/** Fires with the source under the pointer or focus, null when it leaves. */
	onActiveSourceChange?: (id: string | null) => void;
	className?: string;
	children?: ReactNode;
}

/** The root: the answer, its sources and which one is under the pointer. Compose the body and sources inside. */
export function CitationText({
	segments,
	sources,
	chip = "number",
	onActiveSourceChange,
	className,
	children,
}: CitationTextProps) {
	const styles = citationText({ chip });
	const numbered = useMemo(() => numberCitations(segments, sources), [segments, sources]);
	const [active, setActive] = useState<Active>({ segment: null, source: null });
	const ctx: CitationCtx = {
		segments,
		numbered,
		chip,
		active,
		activate: (segment, source) => {
			setActive({ segment, source });
			onActiveSourceChange?.(source);
		},
		styles,
	};
	return (
		<CitationContext.Provider value={ctx}>
			<div data-slot="citation-text" className={cn(styles.root(), className)}>
				{children}
			</div>
		</CitationContext.Provider>
	);
}

function Favicon({ source, className }: { source: CitationSource; className: string }) {
	return (
		<span aria-hidden="true" className={className}>
			{source.favicon ? (
				<img
					src={source.favicon}
					alt=""
					loading="lazy"
					referrerPolicy="no-referrer"
					className="size-full object-cover"
				/>
			) : (
				monogram(source)
			)}
		</span>
	);
}

function Chip({ cite, index }: { cite: CitationRef; index: number }) {
	const { chip, activate, styles } = useCitation("CitationTextBody");
	return (
		<HoverCard>
			<HoverCardTrigger
				href={cite.source.url}
				target="_blank"
				rel="noreferrer noopener"
				aria-label={`Source ${cite.number}: ${cite.source.title}`}
				data-slot="citation-chip"
				className={styles.chip()}
				onMouseEnter={() => activate(index, cite.id)}
				onMouseLeave={() => activate(null, null)}
				onFocus={() => activate(index, cite.id)}
				onBlur={() => activate(null, null)}
			>
				{chip === "domain" ? siteName(cite.source.domain) : cite.number}
			</HoverCardTrigger>
			<HoverCardContent className={styles.card()}>
				<div className={styles.cardHead()}>
					<Favicon source={cite.source} className={styles.favicon()} />
					<span className="truncate">{cite.source.domain}</span>
				</div>
				<p className={styles.cardTitle()}>{cite.source.title}</p>
				{cite.source.snippet ? (
					<p className={styles.cardSnippet()}>{cite.source.snippet}</p>
				) : null}
				<a
					href={cite.source.url}
					target="_blank"
					rel="noreferrer noopener"
					className={styles.cardLink()}
				>
					Open source
				</a>
			</HoverCardContent>
		</HoverCard>
	);
}

/** The answer text with a chip after each cited clause; hovering a chip lights its clause. */
export function CitationTextBody({ className }: { className?: string }) {
	const { segments, numbered, active, styles } = useCitation("CitationTextBody");
	return (
		<p className={className}>
			{segments.map((segment, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: segments are positional and their text can repeat.
				<Fragment key={index}>
					{index > 0 && needsSpace(segments[index - 1]?.text ?? "", segment.text)
						? " "
						: null}
					<span
						data-slot="citation-segment"
						data-active={segmentActive(numbered.refs, index, active) || undefined}
						className={styles.segment()}
					>
						{segment.text}
					</span>
					{(numbered.refs[index] ?? []).map((cite) => (
						<Chip key={cite.id} cite={cite} index={index} />
					))}
				</Fragment>
			))}
		</p>
	);
}

/** Every cited source, numbered in order of first citation; hovering one lights its clauses. */
export function CitationTextSources({
	label = "Sources",
	className,
}: {
	label?: string;
	className?: string;
}) {
	const { numbered, active, activate, styles } = useCitation("CitationTextSources");
	if (numbered.cited.length === 0) return null;
	return (
		<div className={cn(styles.sources(), className)}>
			<p className={styles.sourcesLabel()}>{label}</p>
			<ol className={styles.sourceList()}>
				{numbered.cited.map((cite) => (
					<li key={cite.id}>
						<a
							href={cite.source.url}
							target="_blank"
							rel="noreferrer noopener"
							data-active={active.source === cite.id || undefined}
							className={styles.source()}
							onMouseEnter={() => activate(null, cite.id)}
							onMouseLeave={() => activate(null, null)}
							onFocus={() => activate(null, cite.id)}
							onBlur={() => activate(null, null)}
						>
							<span className={styles.sourceNumber()}>{cite.number}</span>
							<Favicon source={cite.source} className={styles.favicon()} />
							<span className={styles.sourceTitle()}>{cite.source.title}</span>
							<span className={styles.sourceDomain()}>
								{siteName(cite.source.domain)}
							</span>
						</a>
					</li>
				))}
			</ol>
		</div>
	);
}
