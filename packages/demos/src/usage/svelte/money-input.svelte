<script lang="ts">
import { MoneyInput } from "@baby-ui/svelte";

let cents = $state<number | null>(null);
</script>

<MoneyInput label="Budget" bind:value={cents} max={500_000} name="budget" />
