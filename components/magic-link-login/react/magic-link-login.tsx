"use client";

import {
	type ComponentProps,
	createContext,
	type FormEvent,
	type ReactNode,
	type RefObject,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { Button } from "../../button/react/button";
import { Input } from "../../input/react/input";
import { Label } from "../../label/react/label";
import { cn } from "../../lib/cn";
import {
	cooldownSeconds,
	formatCooldown,
	inboxFor,
	isValidEmail,
	MAGIC_LINK_LABELS,
	type MagicLinkLabels,
	type MagicLinkProvider,
	type MagicLinkStatus,
	normalizeEmail,
} from "../magic-link-core";
import {
	type MagicLinkLayout,
	type MagicLinkVariant,
	magicLinkLogin,
	magicLinkView,
} from "../variants";

type View = "form" | "sent";

type MagicLinkCtx = {
	inputId: string;
	errorId: string;
	status: MagicLinkStatus;
	view: View;
	email: string;
	setEmail: (next: string) => void;
	address: string;
	invalid: boolean;
	setInvalid: (next: boolean) => void;
	/** The invalid-email or server message, if any. */
	message?: string;
	cooldown: number;
	sentHeading: RefObject<HTMLHeadingElement | null>;
	labels: MagicLinkLabels;
	styles: ReturnType<typeof magicLinkLogin>;
};

const MagicLinkContext = createContext<MagicLinkCtx | null>(null);

function useMagicLink(part: string): MagicLinkCtx {
	const ctx = useContext(MagicLinkContext);
	if (!ctx) throw new Error(`${part} must be used inside <MagicLinkLogin>`);
	return ctx;
}

export type MagicLinkLoginProps = Omit<ComponentProps<"div">, "onSubmit" | "title"> & {
	status: MagicLinkStatus;
	/** Controlled with onEmailChange; uncontrolled when omitted. */
	email?: string;
	onEmailChange?: (email: string) => void;
	/** Server message for the "error" status. */
	error?: string;
	/** Epoch ms when resending unlocks. Needs `now`. */
	resendAvailableAt?: number;
	/** Current epoch ms, ticked by the parent; drives the resend countdown. */
	now?: number;
	labels?: Partial<MagicLinkLabels>;
	variant?: MagicLinkVariant;
	layout?: MagicLinkLayout;
};

/** The root: status, email and the resend clock. Compose the panel, views and their parts inside. */
export function MagicLinkLogin({
	status,
	email: emailProp,
	onEmailChange,
	error,
	resendAvailableAt,
	now,
	labels: labelsProp,
	variant = "card",
	layout = "centered",
	className,
	children,
	...rest
}: MagicLinkLoginProps) {
	const labels = { ...MAGIC_LINK_LABELS, ...labelsProp };
	const id = useId();
	const inputId = `${id}-email`;
	const styles = magicLinkLogin({ variant, layout });
	const [internal, setInternal] = useState("");
	const email = emailProp ?? internal;
	const [invalid, setInvalid] = useState(false);

	// "sending" and "error" keep whichever view is on screen, so a resend stays in the sent view.
	const [view, setView] = useState<View>(status === "sent" ? "sent" : "form");
	const nextView: View = status === "sent" ? "sent" : status === "idle" ? "form" : view;
	if (nextView !== view) setView(nextView);

	const sentHeading = useRef<HTMLHeadingElement>(null);
	const mounted = useRef(false);
	useEffect(() => {
		if (!mounted.current) {
			mounted.current = true;
			return;
		}
		if (view === "sent") sentHeading.current?.focus();
		else document.getElementById(inputId)?.focus();
	}, [view, inputId]);

	const message = invalid ? labels.invalid : status === "error" ? error : undefined;
	const live =
		status === "sending"
			? labels.sending
			: status === "sent"
				? labels.announceSent
				: (message ?? "");

	const ctx: MagicLinkCtx = {
		inputId,
		errorId: `${id}-error`,
		status,
		view,
		email,
		setEmail: (next) => {
			setInvalid(false);
			if (emailProp === undefined) setInternal(next);
			onEmailChange?.(next);
		},
		address: normalizeEmail(email),
		invalid,
		setInvalid,
		message,
		cooldown: now === undefined ? 0 : cooldownSeconds(resendAvailableAt, now),
		sentHeading,
		labels,
		styles,
	};

	return (
		<MagicLinkContext.Provider value={ctx}>
			<div
				{...rest}
				data-slot="magic-link-login"
				className={cn(styles.root(), className)}
				data-status={status}
			>
				{children}
				<p className="sr-only" aria-live="polite">
					{live}
				</p>
			</div>
		</MagicLinkContext.Provider>
	);
}

/** The brand panel beside the form; shown only in the split layout. */
export function MagicLinkLoginAside({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useMagicLink("MagicLinkLoginAside");
	return <div className={cn(styles.aside(), className)} {...props} />;
}

/** The sign-in column: brand, then the two views. */
export function MagicLinkLoginPanel({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useMagicLink("MagicLinkLoginPanel");
	return <div className={cn(styles.panel(), className)} {...props} />;
}

export function MagicLinkLoginBrand({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useMagicLink("MagicLinkLoginBrand");
	return <div className={cn(styles.brand(), className)} {...props} />;
}

/** Stacks the form and sent views in one grid cell, so swapping them never changes the height. */
export function MagicLinkLoginViews({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useMagicLink("MagicLinkLoginViews");
	return <div className={cn(styles.views(), className)} {...props} />;
}

function View({
	name,
	className,
	children,
}: {
	name: View;
	className?: string;
	children?: ReactNode;
}) {
	const { view, styles } = useMagicLink("MagicLinkLoginForm");
	return (
		<div
			data-view={name}
			className={cn(styles.view(), magicLinkView({ active: view === name }), className)}
			inert={view !== name}
		>
			{children}
		</div>
	);
}

/** The first view: header, providers, email field and legal copy. */
export function MagicLinkLoginForm(props: { className?: string; children?: ReactNode }) {
	return <View name="form" {...props} />;
}

/** The second view, after the link is sent. */
export function MagicLinkLoginSent(props: { className?: string; children?: ReactNode }) {
	return <View name="sent" {...props} />;
}

/** Title and description of the form view; `headingLevel` matches the page outline. */
export function MagicLinkLoginHeader({
	headingLevel = 2,
	className,
}: {
	headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
	className?: string;
}) {
	const { labels, styles } = useMagicLink("MagicLinkLoginHeader");
	const Heading = `h${headingLevel}` as const;
	return (
		<div className={cn(styles.header(), className)}>
			<Heading className={styles.title()}>{labels.title}</Heading>
			<p className={styles.description()}>{labels.description}</p>
		</div>
	);
}

/** One button per OAuth provider, then an "or" rule. */
export function MagicLinkLoginProviders({
	providers,
	onProvider,
	pending,
	className,
}: {
	providers: MagicLinkProvider<ReactNode>[];
	onProvider?: (id: string) => void;
	/** The provider whose redirect is in flight; its button shows a spinner. */
	pending?: string;
	className?: string;
}) {
	const { status, labels, styles } = useMagicLink("MagicLinkLoginProviders");
	if (providers.length === 0) return null;
	return (
		<>
			<div className={cn(styles.providers(), className)}>
				{providers.map((p) => (
					<Button
						key={p.id}
						variant="outline"
						className={styles.provider()}
						disabled={status === "sending" || (pending !== undefined && pending !== p.id)}
						loading={pending === p.id}
						loadingLabel={`${labels.continueWith} ${p.label}`}
						onClick={() => onProvider?.(p.id)}
					>
						{p.icon}
						{labels.continueWith} {p.label}
					</Button>
				))}
			</div>
			<div className={styles.divider()}>{labels.or}</div>
		</>
	);
}

/** The email field and submit; a bad address or server error folds open under the field. */
export function MagicLinkLoginEmail({
	onSubmit,
	className,
}: {
	onSubmit: (email: string) => void;
	className?: string;
}) {
	const {
		inputId,
		errorId,
		status,
		view,
		email,
		setEmail,
		address,
		setInvalid,
		message,
		labels,
		styles,
	} = useMagicLink("MagicLinkLoginEmail");
	const sending = status === "sending";
	const shown = message !== undefined && view === "form";

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (sending) return;
		if (!isValidEmail(address)) {
			setInvalid(true);
			document.getElementById(inputId)?.focus();
			return;
		}
		onSubmit(address);
	}

	return (
		<form className={cn(styles.form(), className)} noValidate onSubmit={submit}>
			<div className={styles.field()}>
				<Label htmlFor={inputId}>{labels.email}</Label>
				<Input
					id={inputId}
					name="email"
					type="email"
					inputMode="email"
					autoComplete="email"
					autoCapitalize="none"
					spellCheck={false}
					placeholder={labels.placeholder}
					value={email}
					invalid={shown}
					aria-describedby={shown ? errorId : undefined}
					readOnly={sending}
					onChange={(e) => setEmail(e.currentTarget.value)}
				/>
				<div data-open={shown} className={styles.fold()}>
					<p id={errorId} className={styles.clip()} aria-hidden={!shown}>
						<span className={styles.error()}>{message}</span>
					</p>
				</div>
			</div>
			<Button
				type="submit"
				className={styles.submit()}
				loading={sending}
				loadingLabel={labels.sending}
			>
				{labels.submit}
			</Button>
		</form>
	);
}

/** Terms and privacy copy under the form; links get an underline that firms on hover. */
export function MagicLinkLoginLegal({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useMagicLink("MagicLinkLoginLegal");
	return <div className={cn(styles.legal(), className)} {...props} />;
}

function MailIcon() {
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
			<rect x="3" y="5" width="18" height="14" rx="2" />
			<path d="m3.5 6.5 8.5 6 8.5-6" />
		</svg>
	);
}

/** The mail mark, "Check your inbox" and the address it went to; takes focus when shown. */
export function MagicLinkLoginSentHeader({
	headingLevel = 2,
	className,
}: {
	headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
	className?: string;
}) {
	const { address, sentHeading, labels, styles } = useMagicLink(
		"MagicLinkLoginSentHeader",
	);
	const Heading = `h${headingLevel}` as const;
	return (
		<>
			<div className={styles.sentIcon()}>
				<MailIcon />
			</div>
			<div className={cn(styles.header(), className)}>
				<Heading ref={sentHeading} tabIndex={-1} className={styles.title()}>
					{labels.sentTitle}
				</Heading>
				<p className={styles.description()}>
					{labels.sentTo} <span className={styles.address()}>{address}</span>.{" "}
					{labels.sentBody}
				</p>
			</div>
		</>
	);
}

/** "Open Gmail" and friends, when the address belongs to a known webmail. */
export function MagicLinkLoginInbox({ className }: { className?: string }) {
	const { address, labels, styles } = useMagicLink("MagicLinkLoginInbox");
	const inbox = inboxFor(address);
	if (!inbox) return null;
	return (
		<div className={cn(styles.actions(), className)}>
			<Button href={inbox.href} target="_blank" rel="noopener noreferrer">
				{labels.openInbox} {inbox.name}
			</Button>
		</div>
	);
}

/** The spam hint, any resend error, and resend with its cooldown; `onBack` adds "Use a different email". */
export function MagicLinkLoginResend({
	onResend,
	onBack,
	className,
}: {
	onResend: () => void;
	/** Set `status` back to "idle" here. */
	onBack?: () => void;
	className?: string;
}) {
	const { status, view, message, cooldown, labels, styles } =
		useMagicLink("MagicLinkLoginResend");
	const shown = message !== undefined && view === "sent";
	return (
		<div className={cn(styles.resend(), className)}>
			<p className={styles.hint()}>{labels.sentHint}</p>
			<div data-open={shown} className={styles.fold()}>
				<p className={styles.clip()} aria-hidden={!shown}>
					<span className={cn(styles.error(), "pt-2")}>{message}</span>
				</p>
			</div>
			<div className={styles.footer()}>
				{onBack ? (
					<Button variant="ghost" size="sm" onClick={onBack}>
						{labels.differentEmail}
					</Button>
				) : null}
				<Button
					variant="outline"
					size="sm"
					disabled={cooldown > 0}
					loading={status === "sending"}
					loadingLabel={labels.sending}
					onClick={onResend}
				>
					{cooldown > 0
						? `${labels.resendIn} ${formatCooldown(cooldown)}`
						: labels.resend}
				</Button>
			</div>
		</div>
	);
}
