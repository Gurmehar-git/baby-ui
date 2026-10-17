import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { type PaginationSize, pagination } from "../variants";

export type { PaginationSize };

/** Part names and data-slot values follow shadcn/ui, so this drops into an existing project. */
export function Pagination({ className, ...props }: ComponentProps<"nav">) {
	return (
		<nav
			aria-label="Pagination"
			data-slot="pagination"
			className={cn("flex items-center gap-1", className)}
			{...props}
		/>
	);
}

export function PaginationContent({ className, ...props }: ComponentProps<"ul">) {
	return (
		<ul
			data-slot="pagination-content"
			className={cn("flex list-none items-center gap-1", className)}
			{...props}
		/>
	);
}

export function PaginationItem({ className, ...props }: ComponentProps<"li">) {
	return <li data-slot="pagination-item" className={cn("flex", className)} {...props} />;
}

type SizeProp = { size?: PaginationSize };

export function PaginationLink({
	className,
	active = false,
	size = "default",
	...props
}: ComponentProps<"button"> & SizeProp & { active?: boolean }) {
	return (
		<button
			type="button"
			data-slot="pagination-link"
			aria-current={active ? "page" : undefined}
			className={cn(pagination({ size }).link(), className)}
			{...props}
		/>
	);
}

const navClass = (size: PaginationSize) => {
	const s = pagination({ size });
	return cn(s.link(), s.nav());
};

export function PaginationPrevious({
	className,
	size = "default",
	...props
}: ComponentProps<"button"> & SizeProp) {
	return (
		<button
			type="button"
			data-slot="pagination-previous"
			aria-label="Previous page"
			className={cn(navClass(size), className)}
			{...props}
		>
			<svg viewBox="0 0 16 16" fill="none" aria-hidden>
				<path
					d="M10 4 6 8l4 4"
					stroke="currentColor"
					strokeWidth="1.4"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</button>
	);
}

export function PaginationNext({
	className,
	size = "default",
	...props
}: ComponentProps<"button"> & SizeProp) {
	return (
		<button
			type="button"
			data-slot="pagination-next"
			aria-label="Next page"
			className={cn(navClass(size), className)}
			{...props}
		>
			<svg viewBox="0 0 16 16" fill="none" aria-hidden>
				<path
					d="m6 4 4 4-4 4"
					stroke="currentColor"
					strokeWidth="1.4"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</button>
	);
}

export function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
	return (
		<span
			role="presentation"
			aria-hidden
			data-slot="pagination-ellipsis"
			className={cn("px-1 text-muted-foreground text-sm", className)}
			{...props}
		>
			&hellip;
			<span className="sr-only">More pages</span>
		</span>
	);
}
