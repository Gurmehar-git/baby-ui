<script lang="ts">
import { AuthForm, Button } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { AUTH_CODE, AUTH_PROVIDERS } from "../data/auth";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
type Props = ComponentProps<typeof AuthForm>;
const p = $derived(controlProps<Props>(props));
let step = $state<NonNullable<Props["step"]>>("details");
let status = $state<NonNullable<Props["status"]>>("idle");
let error = $state<string>();
let resendAt = $state<number>();
let pending = $state<string>();
let signedIn = $state(false);
let timer: ReturnType<typeof setTimeout> | undefined;
$effect(() => () => clearTimeout(timer));
// The demo stands in for a server: requests wait a beat; the code is always the one shown below.
function later(run: () => void) {
	clearTimeout(timer);
	timer = setTimeout(run, 900);
}
</script>

{#if signedIn}
	<div class="grid justify-items-center gap-3 text-sm">
		<p>You are signed in.</p>
		<Button variant="outline" size="sm" onclick={() => ((signedIn = false), (step = "details"))}>Start over</Button>
	</div>
{:else}
	<div class="grid w-full justify-items-center gap-3">
		<AuthForm
			variant={p.variant}
			{step}
			{status}
			{error}
			{resendAt}
			providers={AUTH_PROVIDERS}
			pendingProvider={pending}
			onProvider={(id) => {
				pending = id;
				later(() => ((pending = undefined), (signedIn = true)));
			}}
			onPasskey={() => later(() => (signedIn = true))}
			onSubmit={() => {
				status = "submitting";
				later(() => {
					status = "idle";
					step = "code";
					resendAt = Date.now() + 30_000;
				});
			}}
			onCode={(code) => {
				status = "submitting";
				later(() => {
					if (code === AUTH_CODE) {
						status = "idle";
						signedIn = true;
					} else {
						status = "error";
						error = "That code didn't match. Check the latest email.";
					}
				});
			}}
			onResend={() => (resendAt = Date.now() + 30_000)}
			onBack={() => ((step = "details"), (status = "idle"))}
		>
			{#snippet legal()}
				By continuing you agree to the <a href="#terms">Terms</a> and <a href="#privacy">Privacy policy</a>.
			{/snippet}
		</AuthForm>
		{#if step === "code"}<p class="text-muted-foreground text-xs">Demo code: {AUTH_CODE}</p>{/if}
	</div>
{/if}
