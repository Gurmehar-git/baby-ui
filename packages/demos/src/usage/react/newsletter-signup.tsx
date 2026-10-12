"use client";

import { NewsletterSignup, type NewsletterStatus } from "@baby-ui/react";
import { useState } from "react";

export function Example() {
	const [status, setStatus] = useState<NewsletterStatus>("idle");
	return (
		<NewsletterSignup
			title="Get the next issue on Friday"
			status={status}
			onSubmit={async (email) => {
				setStatus("submitting");
				const res = await fetch("/api/subscribe", { method: "POST", body: email });
				setStatus(res.ok ? "success" : "error");
			}}
			onReset={() => setStatus("idle")}
		/>
	);
}
