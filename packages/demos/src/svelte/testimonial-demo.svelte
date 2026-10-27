<script lang="ts">
import {
	Testimonial,
	TestimonialAuthor,
	TestimonialAuthorDetails,
	TestimonialAuthorName,
	TestimonialAuthorTagline,
	TestimonialAvatar,
	TestimonialAvatarFallback,
	TestimonialAvatarImage,
	TestimonialQuote,
	TestimonialVerifiedBadge,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Testimonial>>(props));
</script>

<div class="w-full max-w-xl">
	<Testimonial variant={p.variant ?? "card"}>
		<TestimonialQuote>
			The new workflow removed the busywork without hiding the details our team needs.
		</TestimonialQuote>
		<TestimonialAuthor>
			<TestimonialAvatar>
				<TestimonialAvatarImage src="https://i.pravatar.cc/128?img=47" alt="Mina Patel" />
				<TestimonialAvatarFallback>MP</TestimonialAvatarFallback>
			</TestimonialAvatar>
			<TestimonialAuthorDetails>
				<TestimonialAuthorName>
					Mina Patel <TestimonialVerifiedBadge />
				</TestimonialAuthorName>
				<TestimonialAuthorTagline>Design systems lead, Northstar</TestimonialAuthorTagline>
			</TestimonialAuthorDetails>
		</TestimonialAuthor>
	</Testimonial>
</div>
