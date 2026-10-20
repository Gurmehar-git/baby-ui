import {
	MagicLinkLogin,
	MagicLinkLoginEmail,
	MagicLinkLoginForm,
	MagicLinkLoginHeader,
	MagicLinkLoginInbox,
	MagicLinkLoginPanel,
	MagicLinkLoginResend,
	MagicLinkLoginSent,
	MagicLinkLoginSentHeader,
	MagicLinkLoginViews,
	type MagicLinkStatus,
} from "@baby-ui/react";
import { useEffect, useState } from "react";

export function Example() {
	const [status, setStatus] = useState<MagicLinkStatus>("idle");
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string>();
	const [resendAvailableAt, setResendAvailableAt] = useState<number>();
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		const timer = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(timer);
	}, []);

	async function send(address: string) {
		setStatus("sending");
		const res = await fetch("/api/auth/magic-link", {
			method: "POST",
			body: JSON.stringify({ email: address }),
		});
		if (!res.ok) {
			setError("We couldn't send the link. Try again in a moment.");
			setStatus("error");
			return;
		}
		setResendAvailableAt(Date.now() + 30_000);
		setStatus("sent");
	}

	return (
		<MagicLinkLogin
			status={status}
			email={email}
			onEmailChange={setEmail}
			error={error}
			now={now}
			resendAvailableAt={resendAvailableAt}
		>
			<MagicLinkLoginPanel>
				<MagicLinkLoginViews>
					<MagicLinkLoginForm>
						<MagicLinkLoginHeader />
						<MagicLinkLoginEmail onSubmit={send} />
					</MagicLinkLoginForm>
					<MagicLinkLoginSent>
						<MagicLinkLoginSentHeader />
						<MagicLinkLoginInbox />
						<MagicLinkLoginResend
							onResend={() => send(email)}
							onBack={() => setStatus("idle")}
						/>
					</MagicLinkLoginSent>
				</MagicLinkLoginViews>
			</MagicLinkLoginPanel>
		</MagicLinkLogin>
	);
}
