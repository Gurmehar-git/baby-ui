<script lang="ts">
import {
	LicenseKey,
	LicenseKeyConfirm,
	LicenseKeyHeader,
	LicenseKeyPass,
	LicenseKeyRotate,
	type LicenseKeyStatus,
	LicenseKeyTitle,
	LicenseKeyValue,
} from "@baby-ui/svelte";

let { licenseKey = $bindable() }: { licenseKey: string } = $props();

let status = $state<LicenseKeyStatus>("idle");
let error = $state<string>();

async function rotate() {
	status = "rotating";
	const res = await fetch("/api/license/rotate", { method: "POST" });
	if (!res.ok) {
		error = "Couldn't regenerate the key. The current one still works.";
		status = "error";
		return;
	}
	licenseKey = (await res.json()).key;
	status = "idle";
}
</script>

<LicenseKey {licenseKey} bind:status onRotate={rotate}>
	<LicenseKeyHeader>
		<LicenseKeyTitle>License key</LicenseKeyTitle>
		<LicenseKeyRotate />
	</LicenseKeyHeader>
	<div>
		<LicenseKeyPass>
			<LicenseKeyValue />
		</LicenseKeyPass>
		<LicenseKeyConfirm description="The current key stops working immediately." {error} />
	</div>
</LicenseKey>
