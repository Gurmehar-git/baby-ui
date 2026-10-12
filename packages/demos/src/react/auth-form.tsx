"use client";

import { AuthForm, type AuthStatus, type AuthStep, Button } from "@baby-ui/react";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { AUTH_CODE, AUTH_PROVIDERS } from "../data/auth";
import { controlProps } from "../data/preview-props";

export function AuthFormDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof AuthForm>>(props);
	const [step, setStep] = useState<AuthStep>("details");
	const [status, setStatus] = useState<AuthStatus>("idle");
	const [error, setError] = useState<string>();
	const [resendAt, setResendAt] = useState<number>();
	const [pending, setPending] = useState<string>();
	const [signedIn, setSignedIn] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	useEffect(() => () => clearTimeout(timer.current), []);
	// The demo stands in for a server: requests wait a beat; the code is always the one shown below.
	const later = (run: () => void) => {
		clearTimeout(timer.current);
		timer.current = setTimeout(run, 900);
	};
	if (signedIn)
		return (
			<div className="grid justify-items-center gap-3 text-sm">
				<p>You are signed in.</p>
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						setSignedIn(false);
						setStep("details");
					}}
				>
					Start over
				</Button>
			</div>
		);
	return (
		<div className="grid w-full justify-items-center gap-3">
			<AuthForm
				variant={p.variant}
				step={step}
				status={status}
				error={error}
				resendAt={resendAt}
				providers={AUTH_PROVIDERS.map((provider) => ({
					...provider,
					icon: <img src={provider.logo} alt="" width={16} height={16} />,
				}))}
				pendingProvider={pending}
				onProvider={(id) => {
					setPending(id);
					later(() => {
						setPending(undefined);
						setSignedIn(true);
					});
				}}
				onPasskey={() => later(() => setSignedIn(true))}
				onSubmit={() => {
					setStatus("submitting");
					later(() => {
						setStatus("idle");
						setStep("code");
						setResendAt(Date.now() + 30_000);
					});
				}}
				onCode={(code) => {
					setStatus("submitting");
					later(() => {
						if (code === AUTH_CODE) {
							setStatus("idle");
							setSignedIn(true);
						} else {
							setStatus("error");
							setError("That code didn't match. Check the latest email.");
						}
					});
				}}
				onResend={() => setResendAt(Date.now() + 30_000)}
				onBack={() => {
					setStep("details");
					setStatus("idle");
				}}
				legal={
					<>
						By continuing you agree to the <a href="#terms">Terms</a> and{" "}
						<a href="#privacy">Privacy policy</a>.
					</>
				}
			/>
			{step === "code" ? (
				<p className="text-muted-foreground text-xs">Demo code: {AUTH_CODE}</p>
			) : null}
		</div>
	);
}
