<script lang="ts">
import type { ComponentProps } from "svelte";
import AvatarImage from "../../avatar/svelte/avatar-image.svelte";

let { ...rest }: ComponentProps<typeof AvatarImage> = $props();
</script>
<AvatarImage data-slot="testimonial-avatar-image" {...rest} />
