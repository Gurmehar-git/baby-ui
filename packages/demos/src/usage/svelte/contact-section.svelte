<script lang="ts">
import { ContactSection } from "@baby-ui/svelte";

let status = $state<"idle" | "submitting" | "success" | "error">("idle");
</script>

<ContactSection
	topics={["Sales", "Support", "Partnerships"]}
	{status}
	onSubmit={async (message) => {
		status = "submitting";
		const res = await fetch("/api/contact", { method: "POST", body: JSON.stringify(message) });
		status = res.ok ? "success" : "error";
	}}
	onReset={() => (status = "idle")}
/>
