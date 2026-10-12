<script lang="ts">
import { BillingPrice, BillingToggle } from "@baby-ui/svelte";

let period = $state("monthly");
</script>

<BillingToggle bind:value={period} />
<BillingPrice amount={period === "yearly" ? 19 : 24} period="per month" />
