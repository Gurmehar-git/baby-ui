"use client";

import { AuthForm, type AuthStatus, type AuthStep } from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [step, setStep] = useState<AuthStep>("details");
	const [status, setStatus] = useState<AuthStatus>("idle");
	return (
		<AuthForm
			step={step}
			status={status}
			onSubmit={async ({ email }) => {
				setStatus("submitting");
				await fetch("/api/auth/code", { method: "POST", body: email });
				setStatus("idle");
				setStep("code");
			}}
			onCode={async (code) => {
				const res = await fetch("/api/auth/verify", { method: "POST", body: code });
				setStatus(res.ok ? "idle" : "error");
			}}
			onBack={() => setStep("details")}
		/>
	);
}
