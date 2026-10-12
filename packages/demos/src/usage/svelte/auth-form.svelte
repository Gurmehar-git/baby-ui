<script lang="ts">
import { AuthForm } from "@baby-ui/svelte";

let step = $state<"details" | "code">("details");
let status = $state<"idle" | "submitting" | "error">("idle");
</script>

<AuthForm
	{step}
	{status}
	onSubmit={async ({ email }) => {
		status = "submitting";
		await fetch("/api/auth/code", { method: "POST", body: email });
		status = "idle";
		step = "code";
	}}
	onCode={async (code) => {
		const res = await fetch("/api/auth/verify", { method: "POST", body: code });
		status = res.ok ? "idle" : "error";
	}}
	onBack={() => (step = "details")}
/>
