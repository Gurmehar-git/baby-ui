"use client";

import {
	type ComponentProps,
	createContext,
	type KeyboardEvent,
	type ReactNode,
	useContext,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { Button } from "../../button/react/button";
import { CopyButton } from "../../copy-button/react/copy-button";
import { cn } from "../../lib/cn";
import {
	keyGroups,
	LICENSE_KEY_LABELS,
	type LicenseKeyStatus,
	maskKey,
} from "../license-core";
import {
	type LicenseKeyVariant,
	licenseDisclosure,
	licenseKey as licenseKeyStyles,
} from "../variants";

type Styles = ReturnType<typeof licenseKeyStyles>;

type LicenseKeyContextValue = {
	licenseKey: string;
	status: LicenseKeyStatus;
	setStatus: (status: LicenseKeyStatus) => void;
	onRotate: () => void;
	revealed: boolean;
	setRevealed: (revealed: boolean) => void;
	styles: Styles;
	confirmId: string;
	triggerId: string;
	cancelId: string;
};

const LicenseKeyContext = createContext<LicenseKeyContextValue | null>(null);

function useLicenseKey() {
	const context = useContext(LicenseKeyContext);
	if (!context) throw new Error("LicenseKey parts must be used inside <LicenseKey>");
	return context;
}

export type LicenseKeyProps = ComponentProps<"div"> & {
	licenseKey: string;
	status: LicenseKeyStatus;
	/** Regenerate asks for "confirming"; Cancel and Escape ask for "idle". */
	onStatusChange: (status: LicenseKeyStatus) => void;
	/** Fires from the confirm step. Set "rotating", then "idle" with the new key. */
	onRotate: () => void;
	/** Controlled with onRevealedChange; uncontrolled when omitted. */
	revealed?: boolean;
	defaultRevealed?: boolean;
	onRevealedChange?: (revealed: boolean) => void;
	variant?: LicenseKeyVariant;
	/** Announced politely while rotating and once a new key lands. */
	rotatingLabel?: string;
	rotatedLabel?: string;
};

/** Holds the key, its reveal and the regenerate flow; the parts inside read them from here. */
export function LicenseKey({
	licenseKey,
	status,
	onStatusChange,
	onRotate,
	revealed: revealedProp,
	defaultRevealed = false,
	onRevealedChange,
	variant = "card",
	rotatingLabel = LICENSE_KEY_LABELS.rotating,
	rotatedLabel = LICENSE_KEY_LABELS.rotated,
	className,
	children,
	...rest
}: LicenseKeyProps) {
	const id = useId();
	const styles = licenseKeyStyles({ variant });
	const [ownRevealed, setOwnRevealed] = useState(defaultRevealed);
	const revealed = revealedProp ?? ownRevealed;
	const open = status !== "idle";
	const confirmId = `${id}-confirm`;
	const triggerId = `${id}-rotate`;
	const cancelId = `${id}-cancel`;

	const root = useRef<HTMLDivElement>(null);
	const wasOpen = useRef(open);
	useEffect(() => {
		if (wasOpen.current === open) return;
		wasOpen.current = open;
		// Only move focus the user already has here; a parent flipping status must not steal it.
		if (!root.current?.contains(document.activeElement)) return;
		document.getElementById(open ? cancelId : triggerId)?.focus();
	}, [open, cancelId, triggerId]);

	const [announced, setAnnounced] = useState("");
	const lastKey = useRef(licenseKey);
	useEffect(() => {
		if (lastKey.current === licenseKey) return;
		lastKey.current = licenseKey;
		setAnnounced(rotatedLabel);
	}, [licenseKey, rotatedLabel]);

	const value = useMemo<LicenseKeyContextValue>(
		() => ({
			licenseKey,
			status,
			setStatus: onStatusChange,
			onRotate,
			revealed,
			setRevealed: (next) => {
				if (revealedProp === undefined) setOwnRevealed(next);
				onRevealedChange?.(next);
			},
			styles,
			confirmId,
			triggerId,
			cancelId,
		}),
		[
			licenseKey,
			status,
			onStatusChange,
			onRotate,
			revealed,
			revealedProp,
			onRevealedChange,
			styles,
			confirmId,
			triggerId,
			cancelId,
		],
	);

	return (
		<LicenseKeyContext.Provider value={value}>
			<div
				{...rest}
				ref={root}
				data-slot="license-key"
				data-variant={variant}
				data-status={status}
				className={cn(styles.root(), className)}
			>
				{children}
				<p className="sr-only" aria-live="polite">
					{status === "rotating" ? rotatingLabel : announced}
				</p>
			</div>
		</LicenseKeyContext.Provider>
	);
}

export function LicenseKeyHeader({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useLicenseKey();
	return (
		<div
			data-slot="license-key-header"
			className={cn(styles.header(), className)}
			{...props}
		/>
	);
}

export function LicenseKeyHeading({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useLicenseKey();
	return <div className={cn(styles.heading(), className)} {...props} />;
}

export function LicenseKeyTitle({
	level = 2,
	className,
	...props
}: ComponentProps<"h2"> & { level?: 2 | 3 | 4 | 5 | 6 }) {
	const { styles } = useLicenseKey();
	const Heading = `h${level}` as "h2";
	return <Heading className={cn(styles.title(), className)} {...props} />;
}

export function LicenseKeyDescription({ className, ...props }: ComponentProps<"p">) {
	const { styles } = useLicenseKey();
	return <p className={cn(styles.description(), className)} {...props} />;
}

/** Opens and closes the confirm step; it never regenerates on its own. */
export function LicenseKeyRotate({
	children = LICENSE_KEY_LABELS.rotate,
	className,
}: {
	children?: ReactNode;
	className?: string;
}) {
	const { status, setStatus, confirmId, triggerId, styles } = useLicenseKey();
	const open = status !== "idle";
	return (
		<Button
			id={triggerId}
			variant="ghost"
			size="sm"
			aria-expanded={open}
			aria-controls={confirmId}
			disabled={status === "rotating"}
			onClick={() => setStatus(open ? "idle" : "confirming")}
			className={cn("group/rotate", className)}
		>
			<RotateIcon spinning={status === "rotating"} className={styles.rotateIcon()} />
			{children}
		</Button>
	);
}

/** The panel around the key. */
export function LicenseKeyPass({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useLicenseKey();
	return (
		<div
			data-slot="license-key-pass"
			className={cn(styles.pass(), className)}
			{...props}
		/>
	);
}

export function LicenseKeyPassHeader({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useLicenseKey();
	return <div className={cn(styles.passHeader(), className)} {...props} />;
}

export function LicenseKeyBrand({ className, children, ...props }: ComponentProps<"p">) {
	const { styles } = useLicenseKey();
	return (
		<p className={cn(styles.brand(), className)} {...props}>
			<span aria-hidden="true" className={styles.glyph()}>
				<KeyIcon />
			</span>
			<span className="truncate">{children}</span>
		</p>
	);
}

/** The plan, led by a live dot that pings once when it first appears. */
export function LicenseKeyPlan({
	className,
	children,
	...props
}: ComponentProps<"span">) {
	const { styles } = useLicenseKey();
	return (
		<span className={cn(styles.plan(), className)} {...props}>
			<span aria-hidden="true" className={styles.planDot()}>
				<span className={styles.planDotCore()} />
			</span>
			{children}
		</span>
	);
}

const CHIP_STAGGER_MS = 50;
const PULSE_STAGGER_MS = 90;
// The flip's length in motion.css; a toggle inside it swaps at once instead of replaying.
const FLIP_MS = 360;

type Beat = { n: number; kind: "flip" | "ring" | "wave" | "still" };

/**
 * The key as chips of four. Reveal or hide flips each chip in turn, a new key flips in and
 * rings, copying sends a wave across them and they pulse while a new key is minted.
 */
export function LicenseKeyValue({
	revealLabel = LICENSE_KEY_LABELS.reveal,
	hideLabel = LICENSE_KEY_LABELS.hide,
	copyLabel = LICENSE_KEY_LABELS.copy,
	copiedLabel = LICENSE_KEY_LABELS.copied,
	className,
	...props
}: ComponentProps<"div"> & {
	revealLabel?: string;
	hideLabel?: string;
	copyLabel?: string;
	copiedLabel?: string;
}) {
	const { licenseKey, revealed, setRevealed, status, styles } = useLicenseKey();
	const rotating = status === "rotating";
	const [beat, setBeat] = useState<Beat>({ n: 0, kind: "flip" });
	const last = useRef({ licenseKey, revealed, at: Number.NEGATIVE_INFINITY });

	useEffect(() => {
		const keyChanged = last.current.licenseKey !== licenseKey;
		if (!keyChanged && last.current.revealed === revealed) return;
		const at = performance.now();
		const quick = at - last.current.at < FLIP_MS;
		last.current = { licenseKey, revealed, at };
		setBeat((b) => ({
			n: b.n + 1,
			kind: keyChanged ? "ring" : quick ? "still" : "flip",
		}));
	}, [licenseKey, revealed]);

	const { prefix, groups } = keyGroups(revealed ? licenseKey : maskKey(licenseKey));
	return (
		<div
			data-slot="license-key-value"
			data-rotating={rotating ? "" : undefined}
			className={cn(styles.well(), className)}
			{...props}
		>
			<code className={styles.value()}>
				<span className={styles.valuePrefix()}>{prefix}</span>
				{groups.map((group, g) => (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: a new key per beat remounts the chip to replay its animation.
						key={`${beat.n}-${g}`}
						className={cn(
							styles.chip(),
							rotating
								? "license-pulse"
								: beat.n > 0 && beat.kind !== "still" && `license-${beat.kind}`,
						)}
						style={{
							animationDelay: `${g * (rotating ? PULSE_STAGGER_MS : CHIP_STAGGER_MS)}ms`,
						}}
					>
						{group}
					</span>
				))}
			</code>
			<span className={styles.actions()}>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label={revealed ? hideLabel : revealLabel}
					aria-pressed={revealed}
					disabled={rotating}
					onClick={() => setRevealed(!revealed)}
					className={styles.action()}
				>
					<EyeIcon off={revealed} slashClass={styles.eyeSlash()} />
				</Button>
				{/* Capture, not a prop: CopyButton has no callback, and the wave only needs the click. */}
				<span
					className="contents"
					onClickCapture={() => setBeat((b) => ({ n: b.n + 1, kind: "wave" }))}
				>
					<CopyButton
						text={licenseKey}
						label={copyLabel}
						copiedLabel={copiedLabel}
						iconOnly
						className={styles.action()}
					/>
				</span>
			</span>
		</div>
	);
}

export function LicenseKeyMeta({ className, ...props }: ComponentProps<"dl">) {
	const { styles } = useLicenseKey();
	return <dl className={cn(styles.meta(), className)} {...props} />;
}

export function LicenseKeyMetaItem({
	label,
	className,
	children,
	...props
}: ComponentProps<"div"> & { label: ReactNode }) {
	const { styles } = useLicenseKey();
	return (
		<div className={cn(styles.metaItem(), className)} {...props}>
			<dt className={styles.metaLabel()}>{label}</dt>
			<dd className={styles.metaValue()}>{children}</dd>
		</div>
	);
}

/** Seats as pips, one per seat, when there are few enough to count at a glance. */
export function LicenseKeySeats({
	used,
	total,
	label = LICENSE_KEY_LABELS.seats,
	of = LICENSE_KEY_LABELS.seatsOf,
	className,
	...props
}: Omit<ComponentProps<"div">, "children"> & {
	used: number;
	total: number;
	label?: ReactNode;
	of?: string;
}) {
	const { styles } = useLicenseKey();
	return (
		<LicenseKeyMetaItem label={label} className={className} {...props}>
			{total <= 12 ? (
				<span aria-hidden="true" className={styles.pips()}>
					{Array.from({ length: total }, (_, i) => (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: pips are generated from a count, so position is the identity.
							key={i}
							data-on={i < used ? "" : undefined}
							className={styles.pip()}
							style={{ transitionDelay: `${120 + i * 45}ms` }}
						/>
					))}
				</span>
			) : null}
			{used} {of} {total}
		</LicenseKeyMetaItem>
	);
}

export function LicenseKeyConfirm({
	title = LICENSE_KEY_LABELS.confirmTitle,
	description,
	error,
	cancelLabel = LICENSE_KEY_LABELS.cancel,
	confirmLabel = LICENSE_KEY_LABELS.confirmRotate,
	rotatingLabel = LICENSE_KEY_LABELS.rotating,
	className,
}: {
	title?: ReactNode;
	description?: ReactNode;
	/** Shown while status is "error". */
	error?: ReactNode;
	cancelLabel?: string;
	confirmLabel?: string;
	rotatingLabel?: string;
	className?: string;
}) {
	const { status, setStatus, onRotate, styles, confirmId, cancelId } = useLicenseKey();
	const open = status !== "idle";
	function closeOnEscape(event: KeyboardEvent) {
		if (event.key !== "Escape" || status === "rotating") return;
		event.stopPropagation();
		setStatus("idle");
	}
	return (
		<div
			id={confirmId}
			className={cn(licenseDisclosure({ open }), className)}
			inert={!open}
		>
			<div className="min-h-0 overflow-hidden">
				<div className={cn("mt-3", styles.confirm())}>
					<p className={styles.confirmTitle()}>{title}</p>
					{description ? <p className={styles.confirmBody()}>{description}</p> : null}
					{status === "error" && error ? (
						<p role="alert" className={styles.error()}>
							{error}
						</p>
					) : null}
					<div className={styles.confirmActions()}>
						<Button
							id={cancelId}
							onKeyDown={closeOnEscape}
							variant="ghost"
							size="sm"
							disabled={status === "rotating"}
							onClick={() => setStatus("idle")}
						>
							{cancelLabel}
						</Button>
						<Button
							variant="destructive"
							onKeyDown={closeOnEscape}
							size="sm"
							loading={status === "rotating"}
							loadingLabel={rotatingLabel}
							onClick={onRotate}
						>
							{confirmLabel}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

/** Numbered setup steps; each LicenseKeyStep takes the next number on its own. */
export function LicenseKeySetup({ className, ...props }: ComponentProps<"ol">) {
	const { styles } = useLicenseKey();
	return <ol className={cn(styles.setup(), className)} {...props} />;
}

export function LicenseKeyStep({
	title,
	className,
	children,
	...props
}: ComponentProps<"li"> & { title: ReactNode }) {
	const { styles } = useLicenseKey();
	return (
		<li className={cn(styles.step(), className)} {...props}>
			<span aria-hidden="true" className={styles.stepNumber()} />
			<div className={styles.stepBody()}>
				<p className={styles.stepTitle()}>{title}</p>
				{children}
			</div>
		</li>
	);
}

/** A copyable snippet; `copyText` copies something other than what is shown, like the real key. */
export function LicenseKeyCode({
	text,
	copyText,
	copyLabel = LICENSE_KEY_LABELS.copySnippet,
	copiedLabel = LICENSE_KEY_LABELS.copied,
	className,
}: {
	text: string;
	copyText?: string;
	copyLabel?: string;
	copiedLabel?: string;
	className?: string;
}) {
	const { styles } = useLicenseKey();
	return (
		<div className={cn(styles.code(), className)}>
			{/* Focusable so keyboard users can scroll a long command sideways. */}
			{/* biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region */}
			<pre className={styles.pre()} tabIndex={0}>
				<code>{text}</code>
			</pre>
			<CopyButton
				text={copyText ?? text}
				label={copyLabel}
				copiedLabel={copiedLabel}
				iconOnly
				className={styles.codeCopy()}
			/>
		</div>
	);
}

function EyeIcon({ off, slashClass }: { off: boolean; slashClass: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
			<circle cx="12" cy="12" r="2.75" />
			<path
				d="m4 4 16 16"
				pathLength={1}
				className={slashClass}
				style={{ strokeDashoffset: off ? 0 : 1 }}
			/>
		</svg>
	);
}

function RotateIcon({ spinning, className }: { spinning: boolean; className: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			data-spinning={spinning ? "" : undefined}
			className={className}
		>
			<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
		</svg>
	);
}

function KeyIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="7.5" cy="15.5" r="4.5" />
			<path d="m10.7 12.3 9.8-9.8M17 6l3 3M14.5 8.5l2 2" />
		</svg>
	);
}
