"use client";

import { type ComponentProps, createContext, type ReactNode, useContext } from "react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "../../context-menu/react/context-menu";
import { cn } from "../../lib/cn";
import { type AssetMenuVariant, assetMenu } from "../variants";

export type { AssetMenuVariant };

const AssetMenuContext = createContext<AssetMenuVariant>("default");

export function AssetMenu({
	variant = "default",
	...props
}: ComponentProps<typeof ContextMenu> & { variant?: AssetMenuVariant }) {
	return (
		<AssetMenuContext.Provider value={variant}>
			<ContextMenu {...props} />
		</AssetMenuContext.Provider>
	);
}

export function AssetMenuTrigger(props: ComponentProps<typeof ContextMenuTrigger>) {
	return <ContextMenuTrigger {...props} />;
}

export function AssetMenuContent({
	className,
	...props
}: ComponentProps<typeof ContextMenuContent>) {
	const variant = useContext(AssetMenuContext);
	return (
		<ContextMenuContent
			data-slot="asset-menu-content"
			className={cn(assetMenu({ variant }).content(), className)}
			{...props}
		/>
	);
}

export function AssetMenuLabel(props: ComponentProps<typeof ContextMenuLabel>) {
	return <ContextMenuLabel data-slot="asset-menu-label" {...props} />;
}

export function AssetMenuSeparator(props: ComponentProps<typeof ContextMenuSeparator>) {
	return <ContextMenuSeparator data-slot="asset-menu-separator" {...props} />;
}

export function AssetMenuPreview({ className, ...props }: ComponentProps<"span">) {
	const variant = useContext(AssetMenuContext);
	return (
		<span
			data-slot="asset-menu-preview"
			className={cn(assetMenu({ variant }).preview(), className)}
			{...props}
		/>
	);
}

export function AssetMenuCopyItem({
	value,
	onCopy,
	className,
	onClick,
	children,
	...props
}: Omit<ComponentProps<typeof ContextMenuItem>, "onClick" | "onCopy"> & {
	value: string;
	onCopy?: (success: boolean) => void;
	onClick?: ComponentProps<typeof ContextMenuItem>["onClick"];
	children: ReactNode;
}) {
	const variant = useContext(AssetMenuContext);
	const copy: NonNullable<ComponentProps<typeof ContextMenuItem>["onClick"]> = async (
		event,
	) => {
		onClick?.(event);
		if (event.defaultPrevented) return;
		try {
			await navigator.clipboard.writeText(value);
			onCopy?.(true);
		} catch {
			onCopy?.(false);
		}
	};
	return (
		<ContextMenuItem
			data-slot="asset-menu-copy-item"
			className={cn(assetMenu({ variant }).item(), className)}
			onClick={copy}
			{...props}
		>
			{children}
		</ContextMenuItem>
	);
}

export function AssetMenuLinkItem({
	href,
	className,
	children,
	...props
}: Omit<ComponentProps<typeof ContextMenuItem>, "render"> & {
	href: string;
	target?: string;
	rel?: string;
	download?: boolean | string;
	children: ReactNode;
}) {
	const variant = useContext(AssetMenuContext);
	const { target, rel, download, ...itemProps } = props;
	return (
		<ContextMenuItem
			data-slot="asset-menu-link-item"
			render={<a href={href} target={target} rel={rel} download={download} />}
			className={cn(assetMenu({ variant }).item(), className)}
			{...itemProps}
		>
			{children}
		</ContextMenuItem>
	);
}
