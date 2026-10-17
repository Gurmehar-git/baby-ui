"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	Button,
	Command,
	CommandBar,
	CommandDialog,
	CommandEmpty,
	CommandFilter,
	CommandFilters,
	CommandFooter,
	CommandGroup,
	CommandHeader,
	CommandHint,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
	type CommandVariant,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	FullscreenNav,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Slider,
	Toaster,
	toast,
} from "@baby-ui/react";
import { type ComponentProps, useId, useState } from "react";
import { COMMAND_ALL, COMMAND_GROUPS } from "../data/command";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const BTN =
	"inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 font-medium text-foreground text-sm";

export function DialogDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Dialog>>(props);
	const [open, setOpen] = useState(false);
	const [domain, setDomain] = useState("");
	const id = useId();
	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
			size={p.size ?? "default"}
			variant={p.variant ?? "default"}
			dismissOnBackdrop={p.dismissOnBackdrop ?? true}
		>
			<DialogTrigger className={BTN}>Add domain</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						<svg viewBox="0 0 20 20" fill="none" aria-hidden>
							<circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
							<path
								d="M2.5 10h15M10 2.5c2.5 2.5 2.5 12.5 0 15M10 2.5c-2.5 2.5-2.5 12.5 0 15"
								stroke="currentColor"
								strokeWidth="1.5"
							/>
						</svg>
						Add a domain
					</DialogTitle>
					<DialogDescription>
						Add an existing domain to your baby-ui project.
					</DialogDescription>
				</DialogHeader>
				<DialogClose />
				<div className="mt-4 flex flex-col gap-1.5">
					<Label htmlFor={id}>Domain</Label>
					<Input
						id={id}
						value={domain}
						onChange={(e) => setDomain(e.currentTarget.value)}
						placeholder="example.com"
					/>
					<p className="text-muted-foreground text-sm">
						We'll guide you through DNS configuration next.
					</p>
				</div>
				<DialogFooter>
					<Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button size="sm" className="ml-auto" onClick={() => setOpen(false)}>
						Add
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function AlertDialogDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof AlertDialog>>(props);
	const pAction = controlProps<ComponentProps<typeof AlertDialogAction>>(props);
	const [done, setDone] = useState(false);
	return (
		<div className="flex flex-col items-center gap-3">
			<AlertDialog variant={p.variant ?? "default"}>
				<AlertDialogTrigger className={BTN}>Delete project</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete this project?</AlertDialogTitle>
						<AlertDialogDescription>
							This removes every deployment and cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							destructive={pAction.destructive ?? true}
							onClick={() => setDone(true)}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			{done ? <p className="text-muted-foreground text-xs">Confirmed</p> : null}
		</div>
	);
}

const REGIONS = [
	{ value: "fra", label: "Frankfurt" },
	{ value: "iad", label: "Washington DC" },
	{ value: "syd", label: "Sydney" },
];

export function SheetDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof SheetContent>>(props);
	const [region, setRegion] = useState("fra");
	const id = useId();
	return (
		<Sheet>
			<SheetTrigger className={BTN}>Open sheet</SheetTrigger>
			<SheetContent side={p.side ?? "right"} variant={p.variant ?? "default"}>
				<SheetHeader>
					<SheetTitle>Filters</SheetTitle>
					<SheetClose />
				</SheetHeader>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={id}>Region</Label>
					<Select value={region} onValueChange={setRegion} items={REGIONS}>
						<SelectTrigger id={id} aria-label="Region">
							<SelectValue placeholder="Pick a region" />
						</SelectTrigger>
						<SelectContent>
							{REGIONS.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<p className="text-muted-foreground text-sm">
					Escape closes the sheet and restores focus.
				</p>
			</SheetContent>
		</Sheet>
	);
}

// One example per toast tone.
const TOAST_EXAMPLES: { label: string; run: () => unknown }[] = [
	{ label: "Title only", run: () => toast.success("Saved") },
	{
		label: "Promise",
		run: () => {
			// A shared `description` on toast.promise() would show on every state; updating
			// the same id by hand gives loading and success their own.
			const id = toast.loading("Publishing component", {
				description: "Bundling source, preview, and registry metadata.",
			});
			setTimeout(() => {
				toast.success("Component published", {
					id,
					description: "Registry endpoint and raw source are available.",
				});
			}, 1800);
		},
	},
	{
		label: "Success",
		run: () =>
			toast.success("Component published", {
				description: "Registry endpoint and raw source are available.",
			}),
	},
	{
		label: "Error",
		run: () =>
			toast.error("Snapshot failed", {
				description: "Retry after the browser target settles.",
			}),
	},
	{
		label: "Warning",
		run: () =>
			toast.warning("Quota at 90%", {
				description: "Builds pause when the month's minutes run out.",
			}),
	},
	{
		label: "Info",
		run: () =>
			toast.info("New version available", { description: "Reload to pick up 0.4.2." }),
	},
	{
		label: "Action",
		run: () =>
			toast("Invite sent", {
				description: "mia@acme.dev can join the workspace.",
				action: { label: "Undo", onClick: () => toast("Invite withdrawn") },
			}),
	},
];

export function ToastDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Toaster>>(props);
	const position = p.position ?? "bottom-right";
	return (
		<div className="flex flex-col items-center gap-4">
			<div className="flex flex-wrap items-center justify-center gap-2">
				{TOAST_EXAMPLES.map((example) => (
					<Button
						key={example.label}
						variant="outline"
						size="sm"
						className="rounded-full"
						onClick={example.run}
					>
						{example.label}
					</Button>
				))}
				<Button
					variant="ghost"
					size="sm"
					className="rounded-full"
					onClick={() => toast.dismiss()}
				>
					Clear
				</Button>
			</div>
			<p className="max-w-sm text-center text-muted-foreground text-xs leading-5">
				Toasts render fixed on the screen. Change the position in the controls to open
				from another edge.
			</p>
			<Toaster
				position={position}
				expand={p.expand ?? true}
				closeButton={p.closeButton ?? true}
			/>
		</div>
	);
}

function CommandIcon({ d }: { d: string }) {
	return (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden>
			<path
				d={d}
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

const COMMAND_VARIANTS: CommandVariant[] = ["default", "framed", "launcher", "spotlight"];

export function CommandDemo({ props }: { props: Props }) {
	const [open, setOpen] = useState(false);
	const [last, setLast] = useState("");
	const [filter, setFilter] = useState("all");
	const variant = COMMAND_VARIANTS.find((v) => v === props.variant) ?? "default";
	const placeholder =
		typeof props.placeholder === "string" && props.placeholder
			? props.placeholder
			: variant === "spotlight"
				? "What are you searching for?"
				: "Type a command or search…";
	const groups =
		filter === "all" ? COMMAND_GROUPS : COMMAND_GROUPS.filter((g) => g.id === filter);

	function run(id: string) {
		setLast(id);
		setOpen(false);
	}

	return (
		<div className="flex flex-col items-center gap-3">
			<Button variant="outline" onClick={() => setOpen(true)}>
				Open palette
			</Button>
			{last ? <p className="text-muted-foreground text-xs">Ran: {last}</p> : null}
			<CommandDialog open={open} onOpenChange={setOpen} variant={variant}>
				<Command>
					{variant === "framed" ? <CommandHeader>Command</CommandHeader> : null}
					{variant === "launcher" ? (
						<CommandBar>
							<CommandInput placeholder={placeholder} hint="⌘K" />
							<CommandFilters value={filter} onValueChange={setFilter} label="Show">
								{[COMMAND_ALL, ...COMMAND_GROUPS].map((group) => (
									<CommandFilter key={group.id} value={group.id} label={group.heading}>
										<CommandIcon d={group.icon} />
									</CommandFilter>
								))}
							</CommandFilters>
						</CommandBar>
					) : variant === "spotlight" ? (
						<>
							<CommandFilters value={filter} onValueChange={setFilter} label="Scope">
								{[COMMAND_ALL, ...COMMAND_GROUPS].map((group) => (
									<CommandFilter key={group.id} value={group.id} label={group.heading}>
										{group.heading}
									</CommandFilter>
								))}
							</CommandFilters>
							<CommandInput placeholder={placeholder} hint="Esc" />
						</>
					) : (
						<CommandInput placeholder={placeholder} />
					)}
					<CommandList>
						<CommandEmpty>
							{typeof props.emptyLabel === "string" ? props.emptyLabel : "No results"}
						</CommandEmpty>
						{groups.map((group) => (
							<CommandGroup key={group.id} heading={group.heading}>
								{group.items.map((item) => (
									<CommandItem
										key={item.value}
										value={item.value}
										keywords={item.keywords}
										onClick={() => run(item.value)}
									>
										<CommandIcon d={group.icon} />
										<span className="min-w-0 flex-1 truncate">{item.value}</span>
										{"shortcut" in item && item.shortcut ? (
											<CommandShortcut>{item.shortcut}</CommandShortcut>
										) : null}
									</CommandItem>
								))}
							</CommandGroup>
						))}
					</CommandList>
					{variant === "launcher" ? (
						<CommandFooter>
							<span className="flex items-center gap-4">
								<CommandHint keys={["↑", "↓"]}>Move</CommandHint>
								<CommandHint keys={["↵"]}>Open</CommandHint>
							</span>
							<CommandHint keys={["Esc"]}>Close</CommandHint>
						</CommandFooter>
					) : null}
				</Command>
			</CommandDialog>
		</div>
	);
}

const FULLSCREEN_LINKS = [
	{ href: "#product", label: "Product", description: "What it does and who it is for" },
	{ href: "#pricing", label: "Pricing", description: "Plans for teams of every size" },
	{ href: "#docs", label: "Docs", description: "Guides and API reference" },
	{ href: "#blog", label: "Blog", description: "Release notes and stories" },
];

export function FullscreenNavDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof FullscreenNav>>(props);
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant="outline" onClick={() => setOpen(true)}>
				Open navigation
			</Button>
			<FullscreenNav
				links={FULLSCREEN_LINKS}
				open={open}
				onOpenChange={setOpen}
				current="#product"
				title={p.title || "Menu"}
				variant={p.variant ?? "fade"}
				align={p.align ?? "start"}
				size={p.size ?? "default"}
				numbered={p.numbered ?? false}
				footer={<span>hello@example.com</span>}
			/>
		</>
	);
}

export function DrawerDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Drawer>>(props);
	const pContent = controlProps<ComponentProps<typeof DrawerContent>>(props);
	const [open, setOpen] = useState(false);
	const [budget, setBudget] = useState(60);
	return (
		<Drawer
			open={open}
			onOpenChange={setOpen}
			direction={p.direction ?? "bottom"}
			dismissible={p.dismissible ?? true}
		>
			<DrawerTrigger className={BTN}>Set a budget</DrawerTrigger>
			<DrawerContent variant={pContent.variant ?? "default"}>
				<DrawerHeader>
					<DrawerTitle>Monthly budget</DrawerTitle>
					<DrawerDescription>
						Alerts go out when spend crosses this line.
					</DrawerDescription>
				</DrawerHeader>
				<DrawerClose />
				<div className="mt-6 flex flex-col gap-4">
					<div className="flex items-baseline justify-between">
						<span className="text-muted-foreground text-sm">Limit</span>
						<span className="font-semibold text-3xl text-foreground tabular-nums">
							${budget}
						</span>
					</div>
					<Slider
						value={budget}
						onValueChange={(next) =>
							setBudget(typeof next === "number" ? next : (next[0] ?? 10))
						}
						min={10}
						max={200}
						step={5}
						label="Monthly budget"
					/>
					<p className="text-muted-foreground text-xs">Spent so far this month: $42.</p>
				</div>
				<DrawerFooter>
					<DrawerClose className="inline-flex h-9 items-center justify-center rounded-lg px-3 font-medium text-foreground text-sm transition-colors hover:bg-foreground/[0.06]">
						Cancel
					</DrawerClose>
					<Button onClick={() => setOpen(false)}>Save budget</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
