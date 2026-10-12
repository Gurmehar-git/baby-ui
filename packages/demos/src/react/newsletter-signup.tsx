"use client";

import { NewsletterSignup, type NewsletterStatus } from "@baby-ui/react";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import {
	NEWSLETTER_ISSUES,
	NEWSLETTER_READERS,
	NEWSLETTER_UPCOMING,
} from "../data/newsletter";
import { controlProps } from "../data/preview-props";

export function NewsletterSignupDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof NewsletterSignup>>(props);
	const [status, setStatus] = useState<NewsletterStatus>("idle");
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	useEffect(() => () => clearTimeout(timer.current), []);
	// The demo stands in for a request: an address containing "fail" is rejected.
	const submit = (email: string) => {
		setStatus("submitting");
		timer.current = setTimeout(
			() => setStatus(email.includes("fail") ? "error" : "success"),
			1100,
		);
	};
	return (
		<NewsletterSignup
			variant={p.variant}
			title="Five minutes on interface craft, every Friday"
			description="Three links worth your time and one short essay on the details that make software feel right."
			privacyNote="No tracking pixels. Unsubscribe with one click."
			privacyLink={{ label: "Privacy policy", href: "#privacy" }}
			name="Margins"
			issues={NEWSLETTER_ISSUES}
			upcoming={NEWSLETTER_UPCOMING}
			readers={NEWSLETTER_READERS}
			status={status}
			onSubmit={submit}
			onReset={() => setStatus("idle")}
		/>
	);
}
