<script lang="ts">
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
} from "@baby-ui/svelte";

let status = $state<MagicLinkStatus>("idle");
let email = $state("");
let error = $state<string>();
let resendAvailableAt = $state<number>();
let now = $state(Date.now());

$effect(() => {
	const timer = setInterval(() => (now = Date.now()), 1000);
	return () => clearInterval(timer);
});

async function send(address: string) {
	status = "sending";
	const res = await fetch("/api/auth/magic-link", {
		method: "POST",
		body: JSON.stringify({ email: address }),
	});
	if (!res.ok) {
		error = "We couldn't send the link. Try again in a moment.";
		status = "error";
		return;
	}
	resendAvailableAt = Date.now() + 30_000;
	status = "sent";
}
</script>

<MagicLinkLogin
	{status}
	bind:email
	{error}
	{now}
	{resendAvailableAt}
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
				<MagicLinkLoginResend onResend={() => send(email)} onBack={() => (status = "idle")} />
			</MagicLinkLoginSent>
		</MagicLinkLoginViews>
	</MagicLinkLoginPanel>
</MagicLinkLogin>
