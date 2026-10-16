"use client";

import { type FormEvent, type ReactNode, useEffect, useId, useState } from "react";
import { Button } from "../../button/react/button";
import { Checkbox } from "../../checkbox/react/checkbox";
import { Field, FieldError, FieldLabel, FieldSeparator } from "../../field/react/field";
import { Input } from "../../input/react/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../input-otp/react/input-otp";
import { cn } from "../../lib/react/cn";
import { PasswordInput } from "../../password-input/react/password-input";
import {
	AUTH_COPY,
	type AuthDetails,
	type AuthMode,
	type AuthProviderEntry,
	type AuthStatus,
	type AuthStep,
	authProblems,
	resendSeconds,
} from "./auth";
import { type AuthFormVariant, authForm } from "./variants";

export type { AuthDetails, AuthFormVariant, AuthMode, AuthStatus, AuthStep };

export interface AuthFormProviderOption extends AuthProviderEntry {
	icon?: ReactNode;
}

export interface AuthFormProps {
	/** Called with valid details; move `step` to "code" once a code is sent, or finish the sign-in. */
	onSubmit: (details: AuthDetails) => void;
	/** `card` frames the form on a bordered surface; `plain` sits on the page. */
	variant?: AuthFormVariant;
	mode?: AuthMode;
	onModeChange?: (mode: AuthMode) => void;
	step?: AuthStep;
	/** Back from the code step. */
	onBack?: () => void;
	status?: AuthStatus;
	/** Shown when `status` is "error"; field values are kept. */
	error?: string;
	/** Called once every code digit is in. */
	onCode?: (code: string) => void;
	onResend?: () => void;
	/** Epoch ms when a new code may be requested. */
	resendAt?: number;
	codeLength?: number;
	providers?: AuthFormProviderOption[];
	onProvider?: (id: string) => void;
	/** The provider whose redirect is in flight. */
	pendingProvider?: string;
	/** Shows "Sign in with a passkey" in sign-in mode. */
	onPasskey?: () => void;
	brand?: ReactNode;
	title?: string;
	description?: string;
	/** Under the form, e.g. terms and privacy links. */
	legal?: ReactNode;
	className?: string;
}

/** Sign in or sign up: providers, email or full details, then a one-time code; every step is driven by your props. */
export function AuthForm({
	onSubmit,
	variant = "card",
	mode: modeProp,
	onModeChange,
	step = "details",
	onBack,
	status = "idle",
	error,
	onCode,
	onResend,
	resendAt,
	codeLength = 6,
	providers = [],
	onProvider,
	pendingProvider,
	onPasskey,
	brand,
	title,
	description,
	legal,
	className,
}: AuthFormProps) {
	const id = useId();
	const s = authForm({ variant });
	const [ownMode, setOwnMode] = useState<AuthMode>("sign-in");
	const mode = modeProp ?? ownMode;
	const copy = AUTH_COPY[mode];
	const [details, setDetails] = useState<Required<AuthDetails>>({
		email: "",
		name: "",
		password: "",
		updates: false,
	});
	const [tried, setTried] = useState(false);
	const [code, setCode] = useState("");
	const [now, setNow] = useState(() => Date.now());
	const busy = status === "submitting";
	const problems = tried ? authProblems(mode, details) : {};
	const wait = resendSeconds(resendAt, now);

	// A one-second clock for the resend countdown, only while one is pending.
	useEffect(() => {
		if (step !== "code" || resendAt === undefined) return;
		const timer = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(timer);
	}, [step, resendAt]);
	useEffect(() => {
		if (step === "details") setCode("");
	}, [step]);

	const set = <K extends keyof AuthDetails>(key: K, value: Required<AuthDetails>[K]) =>
		setDetails((current) => ({ ...current, [key]: value }));
	const switchMode = () => {
		const next = mode === "sign-in" ? "sign-up" : "sign-in";
		if (modeProp === undefined) setOwnMode(next);
		onModeChange?.(next);
		setTried(false);
	};
	const submit = (event: FormEvent) => {
		event.preventDefault();
		if (busy) return;
		setTried(true);
		if (Object.keys(authProblems(mode, details)).length) return;
		onSubmit(
			mode === "sign-up"
				? { ...details, email: details.email.trim(), name: details.name.trim() }
				: { email: details.email.trim() },
		);
	};
	const signUp = mode === "sign-up";

	return (
		<div
			data-slot="auth-form"
			data-variant={variant}
			data-mode={mode}
			className={cn(s.root(), className)}
		>
			<header className={s.header()}>
				{brand ? <div className={s.brand()}>{brand}</div> : null}
				<h1 id={`${id}-title`} className={s.title()}>
					{step === "code" ? "Check your email" : (title ?? copy.title)}
				</h1>
				<p className={s.description()}>
					{step === "code"
						? `We sent a ${codeLength}-digit code.`
						: (description ?? copy.description)}
				</p>
			</header>
			<div className={s.stage()}>
				<div
					data-active={step === "details"}
					inert={step !== "details"}
					className={s.step()}
				>
					<div className={s.stepInner()}>
						<form
							noValidate
							aria-labelledby={`${id}-title`}
							onSubmit={submit}
							className={s.form()}
						>
							{providers.length || onPasskey ? (
								<div className={s.providers()}>
									{providers.map((provider) => (
										<Button
											key={provider.id}
											type="button"
											variant="outline"
											loading={pendingProvider === provider.id}
											disabled={
												busy ||
												(pendingProvider !== undefined && pendingProvider !== provider.id)
											}
											onClick={() => onProvider?.(provider.id)}
										>
											{provider.icon ? (
												<span className={s.providerIcon()}>{provider.icon}</span>
											) : null}
											Continue with {provider.label}
										</Button>
									))}
									{onPasskey && !signUp ? (
										<Button
											type="button"
											variant="outline"
											disabled={busy}
											onClick={onPasskey}
										>
											Sign in with a passkey
										</Button>
									) : null}
								</div>
							) : null}
							{providers.length || onPasskey ? <FieldSeparator>or</FieldSeparator> : null}
							<div data-open={signUp} inert={!signUp} className={s.fold()}>
								<div className={s.foldInner()}>
									<Field data-invalid={Boolean(problems.name)}>
										<FieldLabel htmlFor={`${id}-name`}>Full name</FieldLabel>
										<Input
											id={`${id}-name`}
											autoComplete="name"
											value={details.name}
											invalid={Boolean(problems.name)}
											onChange={(event) => set("name", event.target.value)}
										/>
										{problems.name ? <FieldError>{problems.name}</FieldError> : null}
									</Field>
								</div>
							</div>
							<Field data-invalid={Boolean(problems.email)}>
								<FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
								<Input
									id={`${id}-email`}
									type="email"
									inputMode="email"
									autoComplete="email"
									placeholder="you@company.com"
									value={details.email}
									invalid={Boolean(problems.email)}
									onChange={(event) => set("email", event.target.value)}
								/>
								{problems.email ? <FieldError>{problems.email}</FieldError> : null}
							</Field>
							<div data-open={signUp} inert={!signUp} className={s.fold()}>
								<div className={s.foldInner()}>
									<Field data-invalid={Boolean(problems.password)}>
										<PasswordInput
											label="Password"
											autoComplete="new-password"
											value={details.password}
											onValueChange={(value) => set("password", value)}
										/>
										{problems.password ? (
											<FieldError>{problems.password}</FieldError>
										) : null}
									</Field>
									<Checkbox
										label="Send me product updates"
										checked={details.updates}
										onCheckedChange={(value) => set("updates", value)}
									/>
								</div>
							</div>
							{status === "error" && error && step === "details" ? (
								<p role="alert" className={s.error()}>
									{error}
								</p>
							) : null}
							<Button type="submit" loading={busy}>
								{copy.submit}
							</Button>
						</form>
					</div>
				</div>
				<div data-active={step === "code"} inert={step !== "code"} className={s.step()}>
					<div className={s.stepInner()}>
						<div className={s.form()}>
							<p className={s.codeIntro()}>
								Enter it below. It went to{" "}
								<span className={s.codeEmail()}>{details.email.trim()}</span>.
							</p>
							<div className={s.codeField()}>
								<InputOTP
									maxLength={codeLength}
									value={code}
									invalid={status === "error"}
									onChange={setCode}
									onComplete={(value: string) => onCode?.(value)}
									disabled={busy}
									aria-label="One-time code"
								>
									<InputOTPGroup>
										{Array.from({ length: codeLength }, (_, index) => (
											// biome-ignore lint/suspicious/noArrayIndexKey: slots are positional.
											<InputOTPSlot key={index} index={index} />
										))}
									</InputOTPGroup>
								</InputOTP>
							</div>
							{status === "error" && error && step === "code" ? (
								<p role="alert" className={s.error()}>
									{error}
								</p>
							) : null}
							<p className={s.resend()} aria-live="polite">
								{wait > 0 ? (
									`Resend a code in ${wait}s`
								) : (
									<Button variant="link" size="xs" onClick={onResend} disabled={busy}>
										Resend the code
									</Button>
								)}
							</p>
							{onBack ? (
								<Button variant="ghost" size="sm" onClick={onBack}>
									Use a different email
								</Button>
							) : null}
						</div>
					</div>
				</div>
			</div>
			{step === "details" ? (
				<p className={s.footer()}>
					{copy.switchPrompt}{" "}
					<Button variant="link" size="xs" onClick={switchMode}>
						{copy.switchAction}
					</Button>
				</p>
			) : null}
			{legal ? <div className={s.legal()}>{legal}</div> : null}
		</div>
	);
}
