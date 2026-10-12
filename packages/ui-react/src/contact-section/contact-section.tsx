"use client";

import { type FormEvent, type ReactNode, useEffect, useId, useState } from "react";
import { Badge } from "../badge/badge";
import { Button } from "../button/button";
import { Field, FieldError, FieldLabel } from "../field/field";
import { Input } from "../input/input";
import { cn } from "../lib/cn";
import { Textarea } from "../textarea/textarea";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group/toggle-group";
import {
	type ContactChannelEntry,
	type ContactMessage,
	type ContactOffice,
	type ContactStatus,
	contactProblems,
	officeClock,
} from "./contact";
import { type ContactSectionVariant, contactSection } from "./variants";

export type { ContactMessage, ContactOffice, ContactSectionVariant, ContactStatus };

export interface ContactChannel extends ContactChannelEntry {
	/** Shown beside the list while this channel is selected. */
	detail: ReactNode;
}

export interface ContactSectionProps {
	/** `form` takes a message, `channels` lists ways to reach you, `offices` shows live local times. */
	variant?: ContactSectionVariant;
	title?: string;
	description?: string;
	/** Topic chips in the form; the first is chosen to start. */
	topics?: string[];
	/** Called with a valid message; set `status` from your request. */
	onSubmit?: (message: ContactMessage) => void;
	status?: ContactStatus;
	error?: string;
	/** From the confirmation's "Send another"; set `status` back to "idle". */
	onReset?: () => void;
	channels?: ContactChannel[];
	channel?: string;
	onChannelChange?: (value: string) => void;
	offices?: ContactOffice[];
	locale?: string;
	className?: string;
}

/** A contact section: a validated message form with a confirmation, a channel picker, or offices with live local times. */
export function ContactSection({
	variant = "form",
	title = "Get in touch",
	description,
	topics = ["General", "Sales", "Support"],
	onSubmit,
	status = "idle",
	error,
	onReset,
	channels = [],
	channel,
	onChannelChange,
	offices = [],
	locale,
	className,
}: ContactSectionProps) {
	const id = useId();
	const s = contactSection({ variant });
	const [message, setMessage] = useState<ContactMessage>({
		name: "",
		email: "",
		topic: topics[0] ?? "",
		message: "",
	});
	const [tried, setTried] = useState(false);
	const [ownChannel, setOwnChannel] = useState(channels[0]?.value ?? "");
	const [now, setNow] = useState<Date | null>(null);
	const picked = channel ?? ownChannel;
	const busy = status === "submitting";
	const done = status === "success";
	const problems = tried ? contactProblems(message) : {};

	// Office clocks tick each minute, after mount so server and client agree.
	useEffect(() => {
		if (variant !== "offices") return;
		setNow(new Date());
		const timer = setInterval(() => setNow(new Date()), 60_000);
		return () => clearInterval(timer);
	}, [variant]);

	const set = (key: keyof ContactMessage, value: string) =>
		setMessage((current) => ({ ...current, [key]: value }));
	const submit = (event: FormEvent) => {
		event.preventDefault();
		if (busy) return;
		setTried(true);
		if (Object.keys(contactProblems(message)).length) return;
		onSubmit?.({
			...message,
			name: message.name.trim(),
			email: message.email.trim(),
			message: message.message.trim(),
		});
	};
	const pick = (next: string | string[]) => {
		const value = Array.isArray(next) ? next[0] : next;
		if (!value) return;
		if (channel === undefined) setOwnChannel(value);
		onChannelChange?.(value);
	};
	const current = channels.find((item) => item.value === picked);

	return (
		<section
			data-slot="contact-section"
			data-variant={variant}
			aria-labelledby={`${id}-title`}
			className={cn(s.root(), className)}
		>
			<div className={s.inner()}>
				<div className={s.intro()}>
					<h2 id={`${id}-title`} className={s.title()}>
						{title}
					</h2>
					{description ? <p className={s.description()}>{description}</p> : null}
				</div>
				{variant === "form" ? (
					<div className={s.stage()}>
						<div data-active={!done} inert={done} className={s.face()}>
							<div className={s.faceInner()}>
								<form
									noValidate
									aria-labelledby={`${id}-title`}
									onSubmit={submit}
									className={s.form()}
								>
									<Field data-invalid={Boolean(problems.name)}>
										<FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
										<Input
											id={`${id}-name`}
											autoComplete="name"
											value={message.name}
											invalid={Boolean(problems.name)}
											onChange={(event) => set("name", event.target.value)}
										/>
										{problems.name ? <FieldError>{problems.name}</FieldError> : null}
									</Field>
									<Field data-invalid={Boolean(problems.email)}>
										<FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
										<Input
											id={`${id}-email`}
											type="email"
											autoComplete="email"
											value={message.email}
											invalid={Boolean(problems.email)}
											onChange={(event) => set("email", event.target.value)}
										/>
										{problems.email ? <FieldError>{problems.email}</FieldError> : null}
									</Field>
									<Field className={s.wide()}>
										<FieldLabel id={`${id}-topic`}>Topic</FieldLabel>
										<ToggleGroup
											variant="chip"
											size="sm"
											label="Topic"
											value={message.topic}
											onValueChange={(next) => {
												const value = Array.isArray(next) ? next[0] : next;
												if (value) set("topic", value);
											}}
										>
											{topics.map((topic) => (
												<ToggleGroupItem key={topic} value={topic}>
													{topic}
												</ToggleGroupItem>
											))}
										</ToggleGroup>
									</Field>
									<Field data-invalid={Boolean(problems.message)} className={s.wide()}>
										<FieldLabel htmlFor={`${id}-message`}>Message</FieldLabel>
										<Textarea
											id={`${id}-message`}
											value={message.message}
											invalid={Boolean(problems.message)}
											onChange={(event) => set("message", event.target.value)}
										/>
										{problems.message ? (
											<FieldError>{problems.message}</FieldError>
										) : null}
									</Field>
									{status === "error" && error ? (
										<p role="alert" className={s.error()}>
											{error}
										</p>
									) : null}
									<Button type="submit" loading={busy} className={s.wide()}>
										Send message
									</Button>
								</form>
							</div>
						</div>
						<div data-active={done} inert={!done} className={s.face()}>
							<div className={s.faceInner()}>
								<div className={s.done()} aria-live="polite">
									<p className={s.doneTitle()}>Message sent</p>
									<p className={s.doneText()}>
										Thanks, {message.name.trim() || "there"}. We reply to{" "}
										{message.email.trim()} within a working day.
									</p>
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											setMessage((m) => ({ ...m, message: "" }));
											setTried(false);
											onReset?.();
										}}
									>
										Send another
									</Button>
								</div>
							</div>
						</div>
					</div>
				) : variant === "channels" ? (
					<div className={s.channels()}>
						<ToggleGroup
							variant="segmented"
							orientation="vertical"
							label="Ways to reach us"
							value={picked}
							onValueChange={pick}
							className={s.channelList()}
						>
							{channels.map((item) => (
								<ToggleGroupItem
									key={item.value}
									value={item.value}
									className={s.channelItem()}
								>
									{item.label}
									{item.meta ? (
										<span className={s.channelMeta()}>{item.meta}</span>
									) : null}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
						<div className={s.stage()}>
							{channels.map((item) => (
								<div
									key={item.value}
									data-active={item === current}
									inert={item !== current}
									className={s.face()}
								>
									<div className={s.faceInner()}>
										<div className={s.panel()}>{item.detail}</div>
									</div>
								</div>
							))}
						</div>
					</div>
				) : (
					<div className={s.offices()}>
						{offices.map((office) => {
							const clock = now ? officeClock(office, now, locale) : null;
							return (
								<article key={office.city} className={s.office()}>
									<div className={s.officeTop()}>
										<h3 className={s.city()}>{office.city}</h3>
										{clock ? (
											<Badge variant={clock.open ? "success" : "secondary"} size="sm">
												{clock.open ? "Open" : "Closed"}
											</Badge>
										) : null}
									</div>
									<p className={s.clock()}>{clock ? `${clock.time} local time` : " "}</p>
									<address className={s.address()}>
										{office.address.map((line) => (
											<span key={line} className="block not-italic">
												{line}
											</span>
										))}
									</address>
									{office.email ? (
										<a href={`mailto:${office.email}`} className={s.link()}>
											{office.email}
										</a>
									) : null}
								</article>
							);
						})}
					</div>
				)}
			</div>
		</section>
	);
}
