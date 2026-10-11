"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Switch,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const TRIGGER =
	"inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 font-medium text-foreground text-sm";

// Switch renders its own label; reversing the row puts the text first without a second one.
const SWITCH_ROW = "flex w-full flex-row-reverse items-center justify-between gap-4";

export function PopoverDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof PopoverContent>>(props);
	const [autoDeploy, setAutoDeploy] = useState(true);
	const [comments, setComments] = useState(false);

	return (
		<Popover>
			<PopoverTrigger className={TRIGGER}>Deploy settings</PopoverTrigger>
			<PopoverContent
				className="w-72"
				side={p.side ?? "bottom"}
				sideOffset={Number(p.sideOffset ?? 4)}
				align={p.align ?? "center"}
			>
				<div className="flex flex-col gap-3">
					<Label>Preview branches</Label>
					<Switch
						checked={autoDeploy}
						onCheckedChange={setAutoDeploy}
						size="sm"
						label="Auto deploy"
						className={SWITCH_ROW}
					/>
					<Switch
						checked={comments}
						onCheckedChange={setComments}
						size="sm"
						label="Comment on PRs"
						className={SWITCH_ROW}
					/>
					<Button size="sm" className="mt-1 w-full">
						Save
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}

const ACTIONS = [
	{
		id: "copy",
		hint: "Copy to clipboard",
		path: "M6 6V4.5A1.5 1.5 0 0 1 7.5 3h4A1.5 1.5 0 0 1 13 4.5v4A1.5 1.5 0 0 1 11.5 10H10M4.5 6h4A1.5 1.5 0 0 1 10 7.5v4A1.5 1.5 0 0 1 8.5 13h-4A1.5 1.5 0 0 1 3 11.5v-4A1.5 1.5 0 0 1 4.5 6",
	},
	{
		id: "share",
		hint: "Copy a public link",
		path: "M8 10.5V3m0 0L5.5 5.5M8 3l2.5 2.5M3.5 10v2A1.5 1.5 0 0 0 5 13.5h6a1.5 1.5 0 0 0 1.5-1.5v-2",
	},
	{
		id: "delete",
		hint: "Move to trash",
		path: "M3.5 4.5h9M6.5 4.5V3h3v1.5M5 4.5l.5 8h5l.5-8",
	},
];

export function TooltipDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Tooltip>>(props);
	const pContent = controlProps<ComponentProps<typeof TooltipContent>>(props);
	const label = typeof props.label === "string" ? props.label : undefined;
	return (
		<div className="inline-flex items-center gap-1 rounded-xl border border-border p-1">
			{ACTIONS.map((action) => (
				<Tooltip key={action.id} delay={Number(p.delay ?? 400)}>
					<TooltipTrigger className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground">
						<svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
							<path
								d={action.path}
								stroke="currentColor"
								strokeWidth="1.3"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</TooltipTrigger>
					<TooltipContent side={pContent.side ?? "top"}>
						{action.id === "copy" ? label || action.hint : action.hint}
					</TooltipContent>
				</Tooltip>
			))}
		</div>
	);
}

export function DropdownMenuDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof DropdownMenuContent>>(props);
	const [last, setLast] = useState("");
	return (
		<div className="flex flex-col items-center gap-3">
			<DropdownMenu>
				<DropdownMenuTrigger className={TRIGGER}>Actions</DropdownMenuTrigger>
				<DropdownMenuContent side={p.side ?? "bottom"} align={p.align ?? "start"}>
					<DropdownMenuLabel>This file</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => setLast("rename")}>
						Rename
						<DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setLast("duplicate")}>
						Duplicate
						<DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem disabled>Archive</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Arrange</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem onClick={() => setLast("bring-to-front")}>
								Bring to front
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setLast("bring-forward")}>
								Bring forward
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setLast("send-backward")}>
								Send backward
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setLast("send-to-back")}>
								Send to back
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
					<DropdownMenuSeparator />
					<DropdownMenuItem destructive onClick={() => setLast("delete")}>
						Delete
						<DropdownMenuShortcut>⌫</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{last ? <p className="text-muted-foreground text-xs">Selected: {last}</p> : null}
		</div>
	);
}

export function ContextMenuDemo(_: { props: Props }) {
	const [last, setLast] = useState("");
	const [grid, setGrid] = useState(true);
	const [sort, setSort] = useState("name");
	return (
		<div className="flex flex-col items-center gap-3">
			<ContextMenu>
				<ContextMenuTrigger>
					<div className="grid size-64 place-items-center rounded-xl border border-border border-dashed text-muted-foreground text-sm">
						Right-click anywhere here
					</div>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem onClick={() => setLast("open")}>
						Open in editor
						<ContextMenuShortcut>⏎</ContextMenuShortcut>
					</ContextMenuItem>
					<ContextMenuItem onClick={() => setLast("copy")}>
						Copy path
						<ContextMenuShortcut>⌘C</ContextMenuShortcut>
					</ContextMenuItem>
					<ContextMenuSeparator />
					<ContextMenuSub>
						<ContextMenuSubTrigger>Arrange</ContextMenuSubTrigger>
						<ContextMenuSubContent>
							<ContextMenuItem onClick={() => setLast("bring-to-front")}>
								Bring to front
							</ContextMenuItem>
							<ContextMenuItem onClick={() => setLast("bring-forward")}>
								Bring forward
							</ContextMenuItem>
							<ContextMenuItem onClick={() => setLast("send-backward")}>
								Send backward
							</ContextMenuItem>
							<ContextMenuItem onClick={() => setLast("send-to-back")}>
								Send to back
							</ContextMenuItem>
						</ContextMenuSubContent>
					</ContextMenuSub>
					<ContextMenuSeparator />
					<ContextMenuCheckboxItem checked={grid} onCheckedChange={setGrid}>
						Show grid
					</ContextMenuCheckboxItem>
					<ContextMenuLabel inset>Sort by</ContextMenuLabel>
					<ContextMenuRadioGroup value={sort} onValueChange={setSort}>
						<ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
						<ContextMenuRadioItem value="date">Date modified</ContextMenuRadioItem>
					</ContextMenuRadioGroup>
					<ContextMenuSeparator />
					<ContextMenuItem variant="destructive" onClick={() => setLast("delete")}>
						Delete
						<ContextMenuShortcut>⌫</ContextMenuShortcut>
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
			{last ? <p className="text-muted-foreground text-xs">Selected: {last}</p> : null}
		</div>
	);
}

export function HoverCardDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof HoverCard>>(props);
	const pContent = controlProps<ComponentProps<typeof HoverCardContent>>(props);
	return (
		<HoverCard
			openDelay={Number(p.openDelay ?? 300)}
			closeDelay={Number(p.closeDelay ?? 150)}
		>
			<HoverCardTrigger>
				<button
					type="button"
					className="font-medium text-foreground text-sm underline underline-offset-4"
				>
					@kanakkholwal
				</button>
			</HoverCardTrigger>
			<HoverCardContent side={pContent.side ?? "bottom"}>
				<div className="flex items-start gap-3">
					<Avatar size="sm">
						<AvatarFallback>KK</AvatarFallback>
						<AvatarImage src="https://github.com/kanakkholwal.png" alt="Kanak Kholwal" />
					</Avatar>
					<div>
						<p className="font-medium text-foreground">Kanak Kholwal</p>
						<p className="mt-1 text-muted-foreground text-xs">
							Building docvia and this registry. Move the pointer onto this card: it stays
							open.
						</p>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}

const RUNTIMES = [
	{ value: "edge", label: "Edge runtime" },
	{ value: "node", label: "Node runtime" },
	{ value: "static", label: "Static export" },
	{ value: "hybrid", label: "Hybrid", disabled: true },
];

export function SelectDemo({ props }: { props: Props }) {
	const pValue = controlProps<ComponentProps<typeof SelectValue>>(props);
	const pContent = controlProps<ComponentProps<typeof SelectContent>>(props);
	const pTrigger = controlProps<ComponentProps<typeof SelectTrigger>>(props);
	const [value, setValue] = useState("edge");
	return (
		<div className="w-64">
			<Select value={value} onValueChange={setValue} items={RUNTIMES}>
				<SelectTrigger
					aria-label="Runtime"
					variant={pTrigger.variant}
					size={pTrigger.size}
				>
					<SelectValue placeholder={pValue.placeholder || "Select an option"} />
				</SelectTrigger>
				<SelectContent side={pContent.side ?? "bottom"} size={pTrigger.size}>
					{RUNTIMES.map((runtime) => (
						<SelectItem
							key={runtime.value}
							value={runtime.value}
							disabled={runtime.disabled}
						>
							{runtime.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

const REGIONS = [
	{ value: "ams", label: "Amsterdam" },
	{ value: "blr", label: "Bengaluru" },
	{ value: "fra", label: "Frankfurt" },
	{ value: "iad", label: "Washington DC" },
	{ value: "nrt", label: "Tokyo" },
	{ value: "syd", label: "Sydney" },
];

export function ComboboxDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ComboboxTrigger>>(props);
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
	const selected = REGIONS.find((r) => r.value === value);
	const size = p.size ?? "default";

	return (
		<Combobox open={open} onOpenChange={setOpen}>
			<ComboboxTrigger size={size}>
				{selected?.label ?? "Search regions…"}
				<svg
					viewBox="0 0 16 16"
					fill="none"
					aria-hidden
					className="size-3.5 shrink-0 text-muted-foreground"
				>
					<path
						d="m4 6 4 4 4-4"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</ComboboxTrigger>
			<ComboboxContent size={size}>
				<ComboboxInput placeholder="Search regions…" />
				<ComboboxList>
					<ComboboxEmpty>No matches</ComboboxEmpty>
					<ComboboxGroup>
						{REGIONS.map((region) => (
							<ComboboxItem
								key={region.value}
								value={region.value}
								keywords={region.label}
								onSelect={() => {
									setValue(region.value === value ? "" : region.value);
									setOpen(false);
								}}
							>
								{region.label}
								{region.value === value ? (
									<svg
										viewBox="0 0 14 14"
										fill="none"
										aria-hidden
										className="size-3.5 shrink-0"
									>
										<path
											d="M3 7.4 5.6 10 11 4.2"
											stroke="currentColor"
											strokeWidth="1.6"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								) : null}
							</ComboboxItem>
						))}
					</ComboboxGroup>
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
