import {
	Button,
	type ButtonSize,
	type ButtonVariant,
} from "@baby-ui/components/react/button";

export interface ButtonVariantsProps {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

export default function ButtonVariants({
	variant = "default",
	size = "default",
}: ButtonVariantsProps) {
	return (
		<Button variant={variant} size={size}>
			Deploy project
		</Button>
	);
}
