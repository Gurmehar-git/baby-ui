<script lang="ts">
import { cn } from "../../lib/cn";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import { pageHeader } from "../variants";

let { value, class: classProp }: { value: number; class?: string } = $props();
</script>

<!-- A count inside a tab trigger that rolls to each new value. -->
<RollingDigits {value} startOnView={false} class={cn(pageHeader().tabCount(), classProp)} />
