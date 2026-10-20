<script lang="ts">
import {
	type MagicLinkLayout,
	MagicLinkLogin,
	MagicLinkLoginAside,
	MagicLinkLoginBrand,
	MagicLinkLoginEmail,
	MagicLinkLoginForm,
	MagicLinkLoginHeader,
	MagicLinkLoginInbox,
	MagicLinkLoginLegal,
	MagicLinkLoginPanel,
	MagicLinkLoginProviders,
	MagicLinkLoginResend,
	MagicLinkLoginSent,
	MagicLinkLoginSentHeader,
	MagicLinkLoginViews,
	type MagicLinkProvider,
	type MagicLinkStatus,
	type MagicLinkVariant,
} from "@baby-ui/svelte";
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import {
	MAGIC_LINK_EMAIL,
	MAGIC_LINK_PROVIDERS,
	RESEND_COOLDOWN_MS,
	SEND_DELAY_MS,
} from "../data/magic-link-login";

let { props = {} }: { props?: Record<string, unknown> } = $props();

let status = $state<MagicLinkStatus>("idle");
let email = $state("");
let now = $state(Date.now());
let resendAvailableAt = $state<number>();
let pendingProvider = $state<string>();
let timer: ReturnType<typeof setTimeout> | undefined;

const variant = $derived((props.variant as MagicLinkVariant) ?? "card");
const layout = $derived((props.layout as MagicLinkLayout) ?? "centered");

// The demo owns the clock; the component only reads `now`.
$effect(() => {
	const tick = setInterval(() => (now = Date.now()), 1000);
	return () => {
		clearInterval(tick);
		clearTimeout(timer);
	};
});

// The status control previews a state directly.
$effect(() => {
	const forced = props.status as MagicLinkStatus | undefined;
	if (!forced) return;
	untrack(() => {
		clearTimeout(timer);
		if (forced !== "idle" && !email) email = MAGIC_LINK_EMAIL;
		if (forced === "sent") resendAvailableAt = Date.now() + RESEND_COOLDOWN_MS;
		status = forced;
	});
});

function send() {
	status = "sending";
	clearTimeout(timer);
	timer = setTimeout(() => {
		status = "sent";
		resendAvailableAt = Date.now() + RESEND_COOLDOWN_MS;
		now = Date.now();
	}, SEND_DELAY_MS);
}

const providers: MagicLinkProvider<Snippet>[] = MAGIC_LINK_PROVIDERS.map((p) => ({
	...p,
	icon: p.id === "github" ? githubIcon : googleIcon,
}));
</script>

{#snippet githubIcon()}
	<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path
			d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
		/>
	</svg>
{/snippet}

{#snippet googleIcon()}
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<path
			fill="#4285F4"
			d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
		/>
		<path
			fill="#34A853"
			d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
		/>
		<path
			fill="#FBBC05"
			d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84Z"
		/>
		<path
			fill="#EA4335"
			d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.95 10.95 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
		/>
	</svg>
{/snippet}

{#snippet brand()}
	<span class="size-5 rounded-md bg-foreground" aria-hidden="true"></span>
	Acme
{/snippet}

<MagicLinkLogin
	{status}
	bind:email
	{now}
	{resendAvailableAt}
	{variant}
	{layout}
	error="We couldn't send the link. Try again in a moment."
>
	{#if layout === "split"}
		<MagicLinkLoginAside>
			<div class="flex items-center gap-2 font-medium">{@render brand()}</div>
			<figure class="flex flex-col gap-3">
				<blockquote class="text-foreground text-lg leading-snug tracking-tight">
					"We shipped our billing portal in a week. Sign-in took ten minutes."
				</blockquote>
				<figcaption class="text-muted-foreground">Dana Ortiz, Head of Product at Fieldnote</figcaption>
			</figure>
		</MagicLinkLoginAside>
	{/if}
	<MagicLinkLoginPanel>
		{#if layout !== "split"}
			<MagicLinkLoginBrand>{@render brand()}</MagicLinkLoginBrand>
		{/if}
		<MagicLinkLoginViews>
			<MagicLinkLoginForm>
				<MagicLinkLoginHeader />
				<MagicLinkLoginProviders
					{providers}
					pending={pendingProvider}
					onProvider={(id) => {
						// A real app redirects to the provider here.
						pendingProvider = id;
						clearTimeout(timer);
						timer = setTimeout(() => (pendingProvider = undefined), SEND_DELAY_MS);
					}}
				/>
				<MagicLinkLoginEmail onSubmit={send} />
				<MagicLinkLoginLegal>
					By continuing you agree to the <a href="#terms">Terms</a> and
					<a href="#privacy">Privacy Policy</a>.
				</MagicLinkLoginLegal>
			</MagicLinkLoginForm>
			<MagicLinkLoginSent>
				<MagicLinkLoginSentHeader />
				<MagicLinkLoginInbox />
				<MagicLinkLoginResend
					onResend={send}
					onBack={() => {
						clearTimeout(timer);
						status = "idle";
					}}
				/>
			</MagicLinkLoginSent>
		</MagicLinkLoginViews>
	</MagicLinkLoginPanel>
</MagicLinkLogin>
