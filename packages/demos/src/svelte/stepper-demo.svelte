<script lang="ts">
import { Button, Stepper } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { CHECKOUT_STEPS, PAYMENT_ERROR } from "../data/stepper";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Stepper>>(props));
let current = $state(1);
let failed = $state(false);
const steps = $derived(
	CHECKOUT_STEPS.map((step) =>
		failed && step.id === "payment" ? { ...step, error: PAYMENT_ERROR } : step,
	),
);
</script>

<div class="grid w-full max-w-xl gap-6">
	<Stepper
		{steps}
		{current}
		onStepSelect={(index) => (current = index)}
		orientation={p.orientation}
		compact={p.compact}
		details={p.details}
	/>
	<div class="flex flex-wrap gap-2">
		<Button variant="outline" size="sm" disabled={current === 0} onclick={() => current--}>Back</Button>
		<Button size="sm" disabled={current === steps.length} onclick={() => current++}
			>{current >= steps.length - 1 ? "Finish" : "Next"}</Button
		>
		<Button variant="ghost" size="sm" onclick={() => (failed = !failed)}
			>{failed ? "Clear error" : "Decline payment"}</Button
		>
	</div>
</div>
