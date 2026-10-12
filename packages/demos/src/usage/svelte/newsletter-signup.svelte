<script lang="ts">
import { NewsletterSignup } from "@baby-ui/svelte";

let status = $state<"idle" | "submitting" | "success" | "error">("idle");
async function subscribe(email: string) {
	status = "submitting";
	const res = await fetch("/api/subscribe", { method: "POST", body: email });
	status = res.ok ? "success" : "error";
}
</script>

<NewsletterSignup
	title="Get the next issue on Friday"
	{status}
	onSubmit={subscribe}
	onReset={() => (status = "idle")}
/>
