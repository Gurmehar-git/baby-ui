<script lang="ts">
import { NewsletterSignup } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import {
	NEWSLETTER_ISSUES,
	NEWSLETTER_READERS,
	NEWSLETTER_UPCOMING,
} from "../data/newsletter";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
type Props = ComponentProps<typeof NewsletterSignup>;
const p = $derived(controlProps<Props>(props));
let status = $state<NonNullable<Props["status"]>>("idle");
let timer: ReturnType<typeof setTimeout> | undefined;
$effect(() => () => clearTimeout(timer));
// The demo stands in for a request: an address containing "fail" is rejected.
function submit(email: string) {
	status = "submitting";
	timer = setTimeout(() => (status = email.includes("fail") ? "error" : "success"), 1100);
}
</script>

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
	{status}
	onSubmit={submit}
	onReset={() => (status = "idle")}
/>
