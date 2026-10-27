<script lang="ts">
import type { ComponentProps } from "svelte";
import AvatarFallback from "../../avatar/svelte/avatar-fallback.svelte";

let { ...rest }: ComponentProps<typeof AvatarFallback> = $props();
</script>
<AvatarFallback data-slot="testimonial-avatar-fallback" {...rest} />
