"use client";

import type { ReactNode } from "react";
import { Button } from "../../button/react/button";
import { ButtonGroup } from "../../button-group/react/button-group";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../dropdown-menu/react/dropdown-menu";
import { cn } from "../../lib/cn";
import { type SplitButtonSize, type SplitButtonVariant, splitButton } from "../variants";

export type { SplitButtonSize, SplitButtonVariant };

export type SplitButtonAction = {
	label: string;
	onSelect: () => void;
	icon?: ReactNode;
	destructive?: boolean;
	disabled?: boolean;
};

export interface SplitButtonProps {
	/** The primary action's label. */
	label: string;
	onClick?: () => void;
	icon?: ReactNode;
	/** Related actions in the chevron's menu. */
	actions: SplitButtonAction[];
	/** Accessible name of the chevron; defaults to "More options". */
	menuLabel?: string;
	variant?: SplitButtonVariant;
	size?: SplitButtonSize;
	disabled?: boolean;
	className?: string;
}

/** A primary action with a chevron that opens related actions, built from ButtonGroup and DropdownMenu. */
export function SplitButton({
	label,
	onClick,
	icon,
	actions,
	menuLabel = "More options",
	variant = "default",
	size = "default",
	disabled = false,
	className,
}: SplitButtonProps) {
	const s = splitButton({ variant, size });
	return (
		<ButtonGroup data-slot="split-button" className={className}>
			<Button
				variant={variant}
				size={size}
				disabled={disabled}
				onClick={onClick}
				className={s.main()}
			>
				{icon}
				{label}
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant={variant}
							size={size}
							disabled={disabled}
							aria-label={menuLabel}
						/>
					}
					className={s.menu()}
				>
					<svg viewBox="0 0 16 16" fill="none" aria-hidden>
						<path
							d="m4 6 4 4 4-4"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" sideOffset={6}>
					{actions.map((action) => (
						<DropdownMenuItem
							key={action.label}
							destructive={action.destructive}
							disabled={action.disabled}
							className={cn(s.item())}
							onClick={action.onSelect}
						>
							{action.icon}
							{action.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</ButtonGroup>
	);
}
