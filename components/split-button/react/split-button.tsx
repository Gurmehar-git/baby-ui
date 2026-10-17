"use client";

import { type ComponentProps, createContext, useContext } from "react";
import { Button, type ButtonProps } from "../../button/react/button";
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

type SplitButtonState = {
	variant: SplitButtonVariant;
	size: SplitButtonSize;
	disabled: boolean;
	styles: ReturnType<typeof splitButton>;
};

const SplitButtonContext = createContext<SplitButtonState | null>(null);

function useSplitButton() {
	const state = useContext(SplitButtonContext);
	if (!state) throw new Error("SplitButton parts must be rendered inside a SplitButton.");
	return state;
}

export interface SplitButtonProps extends ComponentProps<typeof ButtonGroup> {
	variant?: SplitButtonVariant;
	size?: SplitButtonSize;
	disabled?: boolean;
}

/**
 * A primary action with a chevron that opens related actions: SplitButtonAction, then
 * SplitButtonMenu with SplitButtonTrigger and SplitButtonContent of SplitButtonItems.
 */
export function SplitButton({
	variant = "default",
	size = "default",
	disabled = false,
	...props
}: SplitButtonProps) {
	const styles = splitButton({ variant, size });
	return (
		<SplitButtonContext.Provider value={{ variant, size, disabled, styles }}>
			<ButtonGroup data-slot="split-button" {...props} />
		</SplitButtonContext.Provider>
	);
}

/** The primary action; takes the group's variant, size and disabled state. */
export function SplitButtonAction({
	className,
	...props
}: Extract<ButtonProps, { href?: undefined }>) {
	const { variant, size, disabled, styles } = useSplitButton();
	return (
		<Button
			data-slot="split-button-action"
			variant={variant}
			size={size}
			disabled={disabled}
			className={cn(styles.main(), className)}
			{...props}
		/>
	);
}

export function SplitButtonMenu(props: ComponentProps<typeof DropdownMenu>) {
	return <DropdownMenu {...props} />;
}

/** The chevron that opens the menu; named "More options" unless given an `aria-label`. */
export function SplitButtonTrigger({
	className,
	children,
	"aria-label": ariaLabel = "More options",
}: {
	className?: string;
	children?: ComponentProps<typeof Button>["children"];
	"aria-label"?: string;
}) {
	const { variant, size, disabled, styles } = useSplitButton();
	return (
		<DropdownMenuTrigger
			render={
				<Button
					data-slot="split-button-trigger"
					variant={variant}
					size={size}
					disabled={disabled}
					aria-label={ariaLabel}
				/>
			}
			className={cn(styles.menu(), className)}
		>
			{children ?? (
				<svg viewBox="0 0 16 16" fill="none" aria-hidden>
					<path
						d="m4 6 4 4 4-4"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			)}
		</DropdownMenuTrigger>
	);
}

export function SplitButtonContent({
	align = "end",
	sideOffset = 6,
	...props
}: ComponentProps<typeof DropdownMenuContent>) {
	return <DropdownMenuContent align={align} sideOffset={sideOffset} {...props} />;
}

export function SplitButtonItem({
	className,
	...props
}: ComponentProps<typeof DropdownMenuItem>) {
	const { styles } = useSplitButton();
	return <DropdownMenuItem className={cn(styles.item(), className)} {...props} />;
}
