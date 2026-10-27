import {
	Testimonial,
	TestimonialAuthor,
	TestimonialAuthorDetails,
	TestimonialAuthorName,
	TestimonialAuthorTagline,
	TestimonialQuote,
} from "@baby-ui/react";

export function Example() {
	return (
		<Testimonial variant="editorial">
			<TestimonialQuote>Shipping now feels calm, predictable, and fast.</TestimonialQuote>
			<TestimonialAuthor>
				<TestimonialAuthorDetails>
					<TestimonialAuthorName>Mina Patel</TestimonialAuthorName>
					<TestimonialAuthorTagline>Design systems lead</TestimonialAuthorTagline>
				</TestimonialAuthorDetails>
			</TestimonialAuthor>
		</Testimonial>
	);
}
