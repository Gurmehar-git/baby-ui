<script lang="ts">
import { Stepper } from "@baby-ui/svelte";

const steps = [
	{ id: "account", label: "Account" },
	{ id: "profile", label: "Profile" },
	{ id: "done", label: "Done" },
];
let current = $state(1);
</script>

<Stepper {steps} {current} onStepSelect={(index) => (current = index)} />
