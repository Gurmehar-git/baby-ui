"use client";

import {
	type FormEvent,
	type ReactNode,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarImage,
} from "../../avatar/react/avatar";
import { Button } from "../../button/react/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "../../input-group/react/input-group";
import { cn } from "../../lib/react/cn";
import type { ImageSlotProps } from "../../lib/react/image";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import { Spinner } from "../../spinner/react/spinner";
import {
	emailProblem,
	type NewsletterIssue,
	type NewsletterStatus,
	type NewsletterStory,
	nudge,
	SIGNUP_DONE,
	SIGNUP_FAILED,
	signupMessages,
	stackIssues,
	stackStyle,
} from "./signup";
import { type NewsletterSignupVariant, newsletterSignup } from "./variants";

export type {
	NewsletterIssue,
	NewsletterSignupVariant,
	NewsletterStatus,
	NewsletterStory,
};

export interface NewsletterSignupProps {
	title: string;
	/** Called with a valid, trimmed email; set `status` from the request. */
	onSubmit: (email: string) => void;
	/** `inline` sets the copy beside the issue stack; `card` is self-contained with the stack on top. */
	variant?: NewsletterSignupVariant;
	description?: string;
	status?: NewsletterStatus;
	/** Shown when `status` is "error". */
	error?: string;
	/** From the success state's "Use a different email"; set `status` back to "idle". */
	onReset?: () => void;
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	buttonLabel?: string;
	privacyNote?: string;
	privacyLink?: { label: string; href: string };
	/** Reader count and up to three faces; the count ticks up on success. */
	readers?: { count: number; avatars?: { src: string; alt?: string }[] };
	/** Masthead on every issue. */
	name?: string;
	/** Recent issues, newest first; the first three make the stack. */
	issues?: NewsletterIssue[];
	/** The next issue; it lands on the stack, addressed to the reader, on success. */
	upcoming?: NewsletterIssue;
	/** Renders each image, e.g. through your framework's image component; defaults to `<img>`. */
	image?: (props: ImageSlotProps) => ReactNode;
	className?: string;
}

/** A newsletter signup framed by the newsletter itself: subscribing drops the next issue, addressed to the reader, onto a stack of recent ones. */
export function NewsletterSignup({
	title,
	onSubmit,
	variant = "inline",
	description,
	status = "idle",
	error,
	onReset,
	value,
	onValueChange,
	placeholder = "you@company.com",
	buttonLabel = "Subscribe",
	privacyNote,
	privacyLink,
	readers,
	name = "",
	issues = [],
	upcoming,
	image,
	className,
}: NewsletterSignupProps) {
	const id = useId();
	const s = newsletterSignup({ variant });
	const [own, setOwn] = useState("");
	const email = value ?? own;
	const [problem, setProblem] = useState<string | null>(null);
	const [tried, setTried] = useState(false);
	const [sentTo, setSentTo] = useState("");
	const field = useRef<HTMLDivElement>(null);
	const input = useRef<HTMLInputElement>(null);
	const done = status === "success";
	const busy = status === "submitting";

	const setEmail = (next: string) => {
		if (value === undefined) setOwn(next);
		onValueChange?.(next);
		if (tried) setProblem(emailProblem(next));
	};
	const submit = (event: FormEvent) => {
		event.preventDefault();
		if (busy || done) return;
		setTried(true);
		const found = emailProblem(email);
		setProblem(found);
		if (found) {
			nudge(field.current);
			input.current?.focus();
			return;
		}
		setSentTo(email.trim());
		onSubmit(email.trim());
	};
	const last = useRef(status);
	useEffect(() => {
		if (status === "error") nudge(field.current);
		if (status === "success") document.getElementById(`${id}-again`)?.focus();
		// Leaving success unmounts the focused button, so focus returns to the field.
		if (status === "idle" && last.current === "success") input.current?.focus();
		last.current = status;
	}, [status, id]);

	const message = problem ?? (status === "error" ? (error ?? SIGNUP_FAILED) : null);
	const label = done
		? "Subscribed"
		: busy
			? "Subscribing"
			: status === "error"
				? "Try again"
				: buttonLabel;

	return (
		<section
			data-slot="newsletter-signup"
			data-variant={variant}
			data-status={status}
			aria-labelledby={`${id}-title`}
			className={cn(s.root(), className)}
		>
			<div className={s.layout()}>
				<div className={s.copy()}>
					<h2 id={`${id}-title`} className={s.title()}>
						{title}
					</h2>
					{description ? <p className={s.description()}>{description}</p> : null}
					<form
						className={s.form()}
						onSubmit={submit}
						noValidate
						aria-labelledby={`${id}-title`}
					>
						<InputGroup ref={field} size="xl" className={s.field()}>
							<InputGroupInput
								ref={input}
								type="email"
								name="email"
								inputMode="email"
								autoComplete="email"
								enterKeyHint="send"
								autoCapitalize="off"
								spellCheck={false}
								aria-label="Email address"
								placeholder={placeholder}
								value={email}
								readOnly={busy || done}
								aria-invalid={problem ? true : undefined}
								aria-describedby={`${id}-message`}
								onChange={(event) => setEmail(event.target.value)}
								onBlur={() => {
									if (email.trim() && !tried && status === "idle") {
										setTried(true);
										setProblem(emailProblem(email));
									}
								}}
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupButton
									type={done ? "button" : "submit"}
									size="sm"
									variant="default"
									aria-disabled={busy || undefined}
									className={s.submit()}
								>
									{busy ? (
										<span aria-hidden="true" className="inline-flex">
											<Spinner size="sm" />
										</span>
									) : null}
									{label}
								</InputGroupButton>
							</InputGroupAddon>
						</InputGroup>
						<div className={s.message()}>
							{signupMessages(
								`${privacyNote ?? ""} ${privacyLink?.label ?? ""}`,
								error,
							).map((text) => (
								<span key={text} aria-hidden="true" className={s.sizer()}>
									{text}
								</span>
							))}
							<p
								id={`${id}-message`}
								aria-live="polite"
								data-tone={message ? "error" : undefined}
								className={s.messageLine()}
							>
								{message ? (
									message
								) : done ? (
									<>
										{SIGNUP_DONE}{" "}
										<Button
											id={`${id}-again`}
											variant="link"
											size="xs"
											className={s.again()}
											onClick={onReset}
										>
											Use a different email
										</Button>
									</>
								) : (
									<>
										{privacyNote}
										{privacyLink ? (
											<>
												{" "}
												<a className={s.link()} href={privacyLink.href}>
													{privacyLink.label}
												</a>
											</>
										) : null}
									</>
								)}
							</p>
						</div>
					</form>
					{readers ? (
						<div className={s.readers()}>
							{readers.avatars?.length ? (
								<AvatarGroup aria-hidden="true">
									{readers.avatars.slice(0, 3).map((face) => (
										<Avatar key={face.src} size="sm" className="size-7">
											<AvatarImage src={face.src} alt={face.alt ?? ""} />
											<AvatarFallback>{(face.alt ?? "").charAt(0)}</AvatarFallback>
										</Avatar>
									))}
								</AvatarGroup>
							) : null}
							<span>
								<RollingDigits
									value={readers.count + (done ? 1 : 0)}
									startOnView={false}
									className={s.readerCount()}
								/>{" "}
								readers
								<span data-on={done} className={s.you()}>
									<span className={s.youInner()}>, including you</span>
								</span>
							</span>
						</div>
					) : null}
				</div>
				{issues.length || upcoming ? (
					<div className={s.stack()}>
						{stackIssues(issues, upcoming, done).map(({ issue, depth }) => (
							<article
								key={issue.number}
								data-depth={depth}
								aria-hidden={depth !== 0 || undefined}
								aria-label={depth === 0 ? `${name}, issue ${issue.number}` : undefined}
								className={s.issue()}
								style={stackStyle(depth)}
							>
								<header className={s.issueHead()}>
									<span className={s.masthead()}>{name}</span>
									<span className={s.issueNumber()}>Issue {issue.number}</span>
								</header>
								<p className={s.issueMeta()}>
									<span>{issue.date}</span>
									{issue === upcoming ? (
										<>
											<span aria-hidden="true">·</span>
											<span className={s.recipient()}>
												To {sentTo || email || placeholder}
											</span>
										</>
									) : null}
								</p>
								<h3 className={s.subject()}>{issue.subject}</h3>
								<ul className={s.stories()}>
									{issue.stories.slice(0, 3).map((story) => (
										<li key={story.title} className={s.story()}>
											{image ? (
												image({
													src: story.image,
													alt: "",
													width: 88,
													height: 88,
													className: s.thumb(),
													loading: "lazy",
												})
											) : (
												<img
													src={story.image}
													alt={""}
													width={88}
													height={88}
													className={s.thumb()}
													loading={"lazy"}
													decoding="async"
													draggable={false}
												/>
											)}
											<span className={s.storyTitle()}>{story.title}</span>
											<span className={s.minutes()}>{story.minutes} min</span>
										</li>
									))}
								</ul>
							</article>
						))}
					</div>
				) : null}
			</div>
		</section>
	);
}
