import { type ComponentProps, createContext, type ReactNode, useContext } from "react";
import { Card } from "../../card/react/card";
import { cn } from "../../lib/cn";
import {
	type ShowcaseCardSize,
	type ShowcaseCardVariant,
	showcaseCard,
} from "../variants";

export type { ShowcaseCardSize, ShowcaseCardVariant };

type Styles = ReturnType<typeof showcaseCard>;
const ShowcaseCardContext = createContext<Styles | null>(null);

function useShowcaseCard() {
	const styles = useContext(ShowcaseCardContext);
	if (!styles)
		throw new Error("ShowcaseCard parts must be rendered inside ShowcaseCard.");
	return styles;
}

export interface ShowcaseCardProps extends Omit<ComponentProps<typeof Card>, "variant"> {
	variant?: ShowcaseCardVariant;
	size?: ShowcaseCardSize;
	children?: ReactNode;
}

export function ShowcaseCard({
	variant = "solid",
	size = "default",
	className,
	children,
	...props
}: ShowcaseCardProps) {
	const styles = showcaseCard({ variant, size });
	return (
		<ShowcaseCardContext.Provider value={styles}>
			<Card
				variant="framed"
				data-slot="showcase-card"
				data-variant={variant}
				data-size={size}
				className={cn(styles.root(), className)}
				{...props}
			>
				{children}
			</Card>
		</ShowcaseCardContext.Provider>
	);
}

export function ShowcaseCardPreview({ className, ...props }: ComponentProps<"div">) {
	const styles = useShowcaseCard();
	return (
		<div
			data-slot="showcase-card-preview"
			className={cn(styles.preview(), className)}
			{...props}
		/>
	);
}

export function ShowcaseCardFooter({ className, ...props }: ComponentProps<"div">) {
	const styles = useShowcaseCard();
	return (
		<div
			data-slot="showcase-card-footer"
			className={cn(styles.footer(), className)}
			{...props}
		/>
	);
}

export function ShowcaseCardCopy({ className, ...props }: ComponentProps<"div">) {
	const styles = useShowcaseCard();
	return (
		<div
			data-slot="showcase-card-copy"
			className={cn(styles.copy(), className)}
			{...props}
		/>
	);
}

export function ShowcaseCardTitle({ className, ...props }: ComponentProps<"h3">) {
	const styles = useShowcaseCard();
	return (
		<h3
			data-slot="showcase-card-title"
			className={cn(styles.title(), className)}
			{...props}
		/>
	);
}

export function ShowcaseCardDescription({ className, ...props }: ComponentProps<"p">) {
	const styles = useShowcaseCard();
	return (
		<p
			data-slot="showcase-card-description"
			className={cn(styles.description(), className)}
			{...props}
		/>
	);
}

export function ShowcaseCardAction({ className, ...props }: ComponentProps<"div">) {
	const styles = useShowcaseCard();
	return (
		<div
			data-slot="showcase-card-action"
			className={cn(styles.action(), className)}
			{...props}
		/>
	);
}

export function ShowcaseCardLink({ className, ...props }: ComponentProps<"a">) {
	const styles = useShowcaseCard();
	return (
		<a
			data-slot="showcase-card-link"
			className={cn(styles.link(), className)}
			{...props}
		/>
	);
}
