"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import {
	type CSSProperties,
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useId,
	useMemo,
	useState,
} from "react";
import { Badge } from "../../badge/react/badge";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../../collapsible/react/collapsible";
import { cn } from "../../lib/react/cn";
import {
	type ReasoningRow,
	type ReasoningRowsKind,
	type ReasoningStepStatus,
	type ReasoningVariant,
	reasoning,
	reasoningExtras,
	reasoningRows,
	reasoningStep,
	SOURCE_TONES,
} from "./variants";

export type { ReasoningRow, ReasoningRowsKind, ReasoningStepStatus, ReasoningVariant };

type ActiveStep = { id: string; label: string };

const ReasoningContext = createContext<{
	setActive: (step: ActiveStep | null, id: string) => void;
} | null>(null);

export interface ReasoningProps {
	children?: ReactNode;
	/** Model is still reasoning: the title shimmers and the panel auto-opens. */
	thinking?: boolean;
	/** Seconds spent reasoning, passed in by the caller. */
	duration?: number;
	/** Controlled open state. Omit to open while thinking and close when done. */
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	variant?: ReasoningVariant;
	/** Title while thinking. */
	thinkingLabel?: string;
	/** Title once done, from the duration in seconds. */
	formatDuration?: (seconds: number) => string;
	className?: string;
}

export function Reasoning({
	children,
	thinking = false,
	duration = 0,
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	variant = "outline",
	thinkingLabel = "Thinking",
	formatDuration = (seconds) => `Thought for ${seconds}s`,
	className,
}: ReasoningProps) {
	const [touched, setTouched] = useState(false);
	const [manual, setManual] = useState(defaultOpen);
	const [active, setActiveStep] = useState<ActiveStep | null>(null);
	// Auto-open while thinking, auto-close when it ends, unless the reader has chosen.
	const open = openProp ?? (touched ? manual : thinking || defaultOpen);
	const styles = reasoning({ variant });

	const setActive = useCallback((step: ActiveStep | null, id: string) => {
		setActiveStep((current) => (step ? step : current?.id === id ? null : current));
	}, []);
	const context = useMemo(() => ({ setActive }), [setActive]);
	const preview = thinking && !open ? active : null;

	return (
		<ReasoningContext.Provider value={context}>
			<CollapsiblePrimitive.Root
				data-slot="reasoning"
				open={open}
				onOpenChange={(next) => {
					setTouched(true);
					setManual(next);
					onOpenChange?.(next);
				}}
				className={cn(styles.root(), className)}
			>
				<CollapsiblePrimitive.Trigger
					data-slot="reasoning-trigger"
					className={styles.trigger()}
				>
					<svg viewBox="0 0 16 16" fill="none" aria-hidden className={styles.icon()}>
						<path
							d="M8 1.8a4.2 4.2 0 0 0-2.4 7.6c.4.3.6.7.6 1.2v.3h3.6v-.3c0-.5.2-.9.6-1.2A4.2 4.2 0 0 0 8 1.8Z"
							stroke="currentColor"
							strokeWidth="1.2"
						/>
						<path
							d="M6.4 13.4h3.2"
							stroke="currentColor"
							strokeWidth="1.2"
							strokeLinecap="round"
						/>
					</svg>
					<span className={styles.heading()}>
						<span className={styles.titleRow()}>
							<span className={thinking ? styles.titleThinking() : styles.title()}>
								{thinking ? thinkingLabel : formatDuration(duration)}
							</span>
							{thinking && duration > 0 ? (
								<span className={styles.duration()}>{duration}s</span>
							) : null}
						</span>
						{preview ? (
							<span
								key={preview.id}
								className={cn(styles.preview(), "text-transition-unit")}
								style={
									{
										"--tt-duration": "220ms",
										"--tt-from-opacity": 0,
										"--tt-from-y": "8px",
										"--tt-from-blur": "3px",
									} as CSSProperties
								}
							>
								{preview.label}
							</span>
						) : null}
					</span>
					<svg viewBox="0 0 16 16" fill="none" aria-hidden className={styles.chevron()}>
						<path
							d="m4 6 4 4 4-4"
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</CollapsiblePrimitive.Trigger>
				{/* keepMounted still sets `hidden`; force it off so the rows transition has a frame. */}
				<CollapsiblePrimitive.Panel
					keepMounted
					hidden={false}
					data-slot="reasoning-content"
					className={styles.panel()}
				>
					<div className={styles.clip()}>
						<div className={styles.content()}>{children}</div>
					</div>
				</CollapsiblePrimitive.Panel>
			</CollapsiblePrimitive.Root>
		</ReasoningContext.Provider>
	);
}

export function ReasoningSteps({
	children,
	className,
}: {
	children?: ReactNode;
	className?: string;
}) {
	return (
		<ul data-slot="reasoning-steps" className={cn(reasoningStep().list(), className)}>
			{children}
		</ul>
	);
}

export interface ReasoningStepProps {
	label: string;
	description?: string;
	/** Pending steps stay hidden until they turn active or done. */
	status?: ReasoningStepStatus;
	children?: ReactNode;
	className?: string;
}

export function ReasoningStep({
	label,
	description,
	status = "done",
	children,
	className,
}: ReasoningStepProps) {
	const id = useId();
	const context = useContext(ReasoningContext);
	const setActive = context?.setActive;
	useEffect(() => {
		if (!setActive) return;
		setActive(status === "active" ? { id, label } : null, id);
		return () => setActive(null, id);
	}, [setActive, status, id, label]);

	if (status === "pending") return null;
	const styles = reasoningStep({ status });
	return (
		<li
			data-slot="reasoning-step"
			data-status={status}
			className={cn(styles.item(), className)}
		>
			<div className={styles.clip()}>
				<div className={styles.row()}>
					<div className={styles.rail()}>
						<div className={styles.glyphBox()}>
							<span key={status} className={styles.glyph()} aria-hidden="true">
								{status === "done" ? (
									<svg
										viewBox="0 0 12 12"
										fill="none"
										aria-hidden
										className="size-3 text-foreground"
									>
										<path
											d="m2.5 6.2 2.3 2.3 4.7-4.9"
											stroke="currentColor"
											strokeWidth="1.8"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								) : null}
							</span>
						</div>
						<span
							data-slot="reasoning-step-connector"
							aria-hidden="true"
							className={styles.connector()}
						/>
					</div>
					<div className={styles.body()}>
						<p className={styles.label()}>{label}</p>
						{description ? <p className={styles.description()}>{description}</p> : null}
						{children}
					</div>
				</div>
			</div>
		</li>
	);
}

export interface ReasoningStepDetailsProps {
	summary: ReactNode;
	children?: ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
}

export function ReasoningStepDetails({
	summary,
	children,
	open,
	defaultOpen = false,
	onOpenChange,
	className,
}: ReasoningStepDetailsProps) {
	const styles = reasoningExtras();
	return (
		<Collapsible
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={onOpenChange}
			className={className}
		>
			<CollapsibleTrigger className={styles.detailsTrigger()}>
				{summary}
			</CollapsibleTrigger>
			<CollapsibleContent className={styles.detailsContent()}>
				{children}
			</CollapsibleContent>
		</Collapsible>
	);
}

export function ReasoningStepSources({
	children,
	className,
}: {
	children?: ReactNode;
	className?: string;
}) {
	return <div className={cn(reasoningExtras().sources(), className)}>{children}</div>;
}

export interface ReasoningStepSourceProps {
	children?: ReactNode;
	/** Opens in a new tab when set. */
	href?: string;
	className?: string;
}

export function ReasoningStepSource({
	children,
	href,
	className,
}: ReasoningStepSourceProps) {
	const styles = reasoningExtras();
	const pill = (
		<Badge variant="outline" size="sm" className={cn(styles.source(), className)}>
			{children}
		</Badge>
	);
	if (!href) return pill;
	return (
		<a
			href={href}
			target="_blank"
			rel="noreferrer noopener"
			className={styles.sourceLink()}
		>
			{pill}
		</a>
	);
}

export interface ReasoningStepImageProps {
	src: string;
	alt?: string;
	caption?: ReactNode;
	className?: string;
}

export function ReasoningStepImage({
	src,
	alt = "",
	caption,
	className,
}: ReasoningStepImageProps) {
	const styles = reasoningExtras();
	return (
		<figure className={cn(styles.figure(), className)}>
			<img src={src} alt={alt} width={220} height={140} className={styles.image()} />
			{caption ? <figcaption className={styles.caption()}>{caption}</figcaption> : null}
		</figure>
	);
}

export interface ReasoningRowsProps {
	rows: readonly ReasoningRow[];
	kind?: ReasoningRowsKind;
	/** Search: the query shown above the sources. */
	query?: string;
	/** Coding: the selected row's `primary`. Omit to let the rows own it. */
	value?: string | null;
	defaultValue?: string | null;
	onValueChange?: (value: string | null) => void;
	className?: string;
}

/** Trace rows for a Reasoning panel: ticking steps, linked search sources or selectable files. */
export function ReasoningRows({
	rows,
	kind = "steps",
	query,
	value: valueProp,
	defaultValue = null,
	onValueChange,
	className,
}: ReasoningRowsProps) {
	const [ownValue, setOwnValue] = useState(defaultValue);
	const selected = valueProp === undefined ? ownValue : valueProp;
	const s = reasoningRows({ kind });
	const pick = (next: string | null) => {
		if (valueProp === undefined) setOwnValue(next);
		onValueChange?.(next);
	};

	return (
		<div data-slot="reasoning-rows" className={cn(s.list(), className)}>
			{query ? (
				<div className={s.query()}>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						aria-hidden
						className={s.glyph()}
					>
						<circle cx="11" cy="11" r="7" />
						<path d="M21 21l-4.3-4.3" />
					</svg>
					{query}
				</div>
			) : null}
			{rows.map((r, i) => {
				const style = { animationDelay: `${i * 80}ms` };
				const content = (
					<>
						{kind === "search" ? (
							<span className={cn(s.source(), SOURCE_TONES[i % SOURCE_TONES.length])}>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									aria-hidden
									className="size-2.5"
								>
									<circle cx="12" cy="12" r="9" />
									<path d="M3.5 12h17M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
								</svg>
							</span>
						) : null}
						{kind === "steps" ? (
							r.status === "active" ? (
								<span aria-hidden className={s.spinner()} />
							) : (
								<svg
									viewBox="0 0 16 16"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden
									className={s.glyph()}
								>
									<path d="M3.5 8.4 6.4 11 12.5 4.5" />
								</svg>
							)
						) : null}
						<span className={s.label()}>{r.primary}</span>
						{r.secondary ? (
							<span className={cn(s.secondary(), r.mono && "font-mono")}>
								{r.secondary}
							</span>
						) : null}
						{r.add !== undefined ? (
							<span className={s.diff()}>
								<span className="text-success-strong">+{r.add}</span>{" "}
								<span className="text-destructive-strong">-{r.del ?? 0}</span>
							</span>
						) : null}
					</>
				);
				if (kind === "search")
					return (
						<a
							// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
							key={`${i}-${r.primary}`}
							href={r.href}
							target="_blank"
							rel="noreferrer"
							style={style}
							className={s.row()}
						>
							{content}
						</a>
					);
				if (kind === "coding") {
					const pressed = selected === r.primary;
					return (
						<button
							// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
							key={`${i}-${r.primary}`}
							type="button"
							aria-pressed={pressed}
							onClick={() => pick(pressed ? null : r.primary)}
							style={style}
							className={s.row()}
						>
							{content}
						</button>
					);
				}
				return (
					// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
					<div key={`${i}-${r.primary}`} style={style} className={s.row()}>
						{content}
					</div>
				);
			})}
		</div>
	);
}
