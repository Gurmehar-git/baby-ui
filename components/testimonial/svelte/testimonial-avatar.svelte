<script lang="ts">
import type { ComponentProps } from "svelte";
import Avatar from "../../avatar/svelte/avatar.svelte";
import { cn } from "../../lib/cn";
import { testimonial } from "../variants";
import { getTestimonial } from "./context";

let { class: classProp, ...rest }: ComponentProps<typeof Avatar> = $props();
const context = getTestimonial();
const s = $derived(testimonial({ variant: context.variant }));
</script>

<Avatar data-slot="testimonial-avatar" size="sm" class={cn(s.avatar(), classProp)} {...rest} />
