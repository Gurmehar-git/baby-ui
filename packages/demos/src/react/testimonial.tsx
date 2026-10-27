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
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function TestimonialDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Testimonial>>(props);
	return (
		<div className="w-full max-w-xl">
			<Testimonial variant={p.variant ?? "card"}>
				<TestimonialQuote>
					The new workflow removed the busywork without hiding the details our team needs.
				</TestimonialQuote>
				<TestimonialAuthor>
					<TestimonialAvatar>
						<TestimonialAvatarImage
							src="https://i.pravatar.cc/128?img=47"
							alt="Mina Patel"
						/>
						<TestimonialAvatarFallback>MP</TestimonialAvatarFallback>
					</TestimonialAvatar>
					<TestimonialAuthorDetails>
						<TestimonialAuthorName>
							Mina Patel <TestimonialVerifiedBadge />
						</TestimonialAuthorName>
						<TestimonialAuthorTagline>
							Design systems lead, Northstar
						</TestimonialAuthorTagline>
					</TestimonialAuthorDetails>
				</TestimonialAuthor>
			</Testimonial>
		</div>
	);
}
