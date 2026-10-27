"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	ALERT_ICON,
	Alert,
	AlertDescription,
	AlertTitle,
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
	Badge,
	Button,
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Checkbox,
	Field,
	FieldDescription,
	FieldLabel,
	Input,
	Label,
	Progress,
	Skeleton,
	Switch,
	Textarea,
	TextareaCount,
} from "@baby-ui/react";
import { type ComponentProps, useEffect, useId, useState } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const SERVICES = [
	{ name: "image-resizer", tone: "warning", state: "Degraded" },
	{ name: "legacy-billing", tone: "destructive", state: "Down" },
] as const;

export function BadgeDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Badge>>(props);
	const size = p.size ?? "default";
	return (
		<div className="flex w-full max-w-72 flex-col gap-3 text-sm">
			<div className="flex items-center justify-between gap-4">
				<span className="text-muted-foreground">api-gateway</span>
				<Badge variant={p.variant ?? "success"} size={size} dot={p.dot !== false}>
					Healthy
				</Badge>
			</div>
			{SERVICES.map((service) => (
				<div key={service.name} className="flex items-center justify-between gap-4">
					<span className="text-muted-foreground">{service.name}</span>
					<Badge variant={service.tone} dot>
						{service.state}
					</Badge>
				</div>
			))}
		</div>
	);
}

export function AvatarDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Avatar>>(props);
	const pImage = controlProps<ComponentProps<typeof AvatarImage>>(props);
	const name = typeof props.name === "string" ? props.name : "Kanak Kholwal";
	const initials = name
		.trim()
		.split(/\s+/)
		.map((word) => word[0] ?? "")
		.slice(0, 2)
		.join("")
		.toUpperCase();
	const [team, setTeam] = useState(3);
	return (
		<div className="grid justify-items-start gap-5">
			<div className="flex items-center gap-3">
				<Avatar size={p.size ?? "default"} shape={p.shape ?? "circle"}>
					<AvatarFallback>{initials}</AvatarFallback>
					<AvatarImage
						src={pImage.src || "https://github.com/kanakkholwal.png"}
						alt={name}
					/>
					<AvatarBadge className="bg-success" aria-label="Online" />
				</Avatar>
				<div className="text-sm">
					<p className="font-medium text-foreground">{name}</p>
					<p className="text-muted-foreground text-xs">
						Fallback shows until an image loads
					</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<AvatarGroup aria-label="Team">
					{TEAM.slice(0, team).map((member) => (
						<Avatar key={member} size={p.size ?? "default"} shape={p.shape ?? "circle"}>
							<AvatarFallback>{member}</AvatarFallback>
						</Avatar>
					))}
					<AvatarGroupCount size={p.size ?? "default"} shape={p.shape ?? "circle"}>
						+{12 - team}
					</AvatarGroupCount>
				</AvatarGroup>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setTeam(team === TEAM.length ? 2 : team + 1)}
				>
					{team === TEAM.length ? "Reset" : "Add member"}
				</Button>
			</div>
		</div>
	);
}

const TEAM = ["AP", "MW", "PN", "JB", "LO"];

export function CardDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Card>>(props);
	return (
		<Card
			interactive={p.interactive !== false}
			variant={p.variant ?? "default"}
			className="w-full max-w-md"
		>
			<CardHeader>
				<CardTitle className="text-base">baby-ui</CardTitle>
				<CardDescription>baby-ui.nexonauts.com</CardDescription>
				<CardAction>
					<Badge variant="secondary">Next.js</Badge>
				</CardAction>
			</CardHeader>
			<CardContent className="flex flex-col gap-3 text-sm">
				<div className="flex items-center gap-2">
					<span className="size-2 rounded-full bg-success" aria-hidden />
					<span className="font-medium text-foreground">Ready</span>
					<span className="ml-auto text-muted-foreground">Production</span>
					<span className="text-muted-foreground">Deployed 2h ago</span>
				</div>
				<div className="flex items-center gap-2 rounded-lg bg-foreground/[0.04] px-3 py-2">
					<svg
						viewBox="0 0 16 16"
						fill="none"
						aria-hidden
						className="size-4 shrink-0 text-muted-foreground"
					>
						<path
							d="M5 3v10M5 6a3 3 0 0 0 6 0"
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
						/>
						<circle cx="5" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.4" />
						<circle cx="11" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.4" />
						<circle cx="5" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.4" />
					</svg>
					<span className="font-medium text-foreground">main</span>
					<span className="truncate text-muted-foreground">
						feat(select): unfold from the trigger edge
					</span>
					<span className="ml-auto shrink-0 font-mono text-muted-foreground text-xs">
						20a9de6
					</span>
				</div>
			</CardContent>
			<CardFooter className="justify-end">
				<Button size="sm" variant="outline">
					Visit
				</Button>
				<Button size="sm">View deployment</Button>
			</CardFooter>
		</Card>
	);
}

export function InputDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Input>>(props);
	const id = useId();
	const [value, setValue] = useState("");
	return (
		<div className="flex w-full max-w-72 flex-col gap-1.5">
			<Label htmlFor={id} required>
				Workspace name
			</Label>
			<Input
				id={id}
				value={value}
				onChange={(e) => setValue(e.currentTarget.value)}
				size={p.size ?? "default"}
				invalid={p.invalid ?? false}
				disabled={p.disabled ?? false}
				placeholder={p.placeholder || "Enter a value"}
			/>
			{p.invalid ? (
				<p className="text-destructive-strong text-xs">That name is already taken.</p>
			) : null}
		</div>
	);
}

export function LabelDemo({ props }: { props: Props }) {
	const id = useId();
	return (
		<div className="flex w-full max-w-72 flex-col gap-1.5">
			<Label
				htmlFor={id}
				required={Boolean(props.required)}
				disabled={Boolean(props.disabled)}
			>
				Email address
			</Label>
			<Input id={id} placeholder="you@example.com" disabled={Boolean(props.disabled)} />
		</div>
	);
}

export function TextareaDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Textarea>>(props);
	const id = useId();
	const [value, setValue] = useState(
		"Same field tokens as Input, so labels and focus rings stay consistent.",
	);
	return (
		<Field className="w-full max-w-md">
			<FieldLabel htmlFor={id}>Message</FieldLabel>
			<Textarea
				id={id}
				value={value}
				onChange={(e) => setValue(e.currentTarget.value)}
				aria-describedby={`${id}-description`}
				size={p.size ?? "default"}
				variant={p.variant ?? "outline"}
				rows={p.rows ?? 4}
				autoGrow={p.autoGrow ?? false}
				maxRows={p.maxRows ?? 10}
				maxLength={280}
				invalid={p.invalid ?? false}
				disabled={p.disabled ?? false}
			/>
			<div className="flex items-start justify-between gap-3">
				<FieldDescription id={`${id}-description`}>
					Markdown is supported.
				</FieldDescription>
				<TextareaCount value={value.length} max={280} />
			</div>
		</Field>
	);
}

const SCOPES = ["Read repositories", "Write issues", "Manage webhooks"];

export function CheckboxDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Checkbox>>(props);
	const [checked, setChecked] = useState(false);
	const [scopes, setScopes] = useState([true, false, false]);
	useEffect(() => setChecked(Boolean(props.checked)), [props.checked]);
	const granted = scopes.filter(Boolean).length;

	return (
		<div className="flex w-full max-w-72 flex-col gap-3">
			<Checkbox
				checked={granted === SCOPES.length}
				indeterminate={granted > 0 && granted < SCOPES.length}
				onCheckedChange={(next) => setScopes(SCOPES.map(() => next))}
				label="All permissions"
			/>
			<div className="flex flex-col gap-3 border-border border-l pl-4">
				{SCOPES.map((scope, i) => (
					<Checkbox
						key={scope}
						checked={scopes[i]}
						onCheckedChange={(next) =>
							setScopes(scopes.map((on, j) => (i === j ? next : on)))
						}
						label={scope}
					/>
				))}
			</div>
			<Checkbox
				checked={checked}
				onCheckedChange={setChecked}
				disabled={p.disabled ?? false}
				indeterminate={p.indeterminate ?? false}
				size={p.size ?? "default"}
				label={p.label || "Remember this grant"}
				description={p.description || "Skips the prompt for the next 30 days."}
			/>
		</div>
	);
}

// Switch renders its own label; reversing the row puts the text first without a second one.
const SWITCH_ROW = "flex w-full flex-row-reverse items-center justify-between gap-6";

export function SwitchDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Switch>>(props);
	const [checked, setChecked] = useState(false);
	const [digest, setDigest] = useState(true);
	useEffect(() => setChecked(Boolean(props.checked)), [props.checked]);
	const size = p.size ?? "default";

	return (
		<div className="flex w-full max-w-72 flex-col divide-y divide-border rounded-xl border border-border">
			<div className="px-4 py-3">
				<Switch
					checked={checked}
					onCheckedChange={setChecked}
					disabled={p.disabled ?? false}
					size={size}
					label={p.label || "Push notifications"}
					className={SWITCH_ROW}
				/>
			</div>
			<div className="px-4 py-3">
				<Switch
					checked={digest}
					onCheckedChange={setDigest}
					label="Weekly digest"
					className={SWITCH_ROW}
				/>
			</div>
			<div className="px-4 py-3">
				<Switch checked={false} disabled label="SMS alerts" className={SWITCH_ROW} />
			</div>
		</div>
	);
}

export function ProgressDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Progress>>(props);
	const value = Number(p.value ?? 68);
	const indeterminate = p.indeterminate ?? false;
	return (
		<div className="flex w-full max-w-72 flex-col items-center gap-2">
			<Progress
				value={value}
				indeterminate={indeterminate}
				size={p.size ?? "default"}
				tone={p.tone ?? "default"}
				variant={p.variant ?? "linear"}
				showValue={p.showValue === true}
				label={p.label || "design-system.zip"}
				helper={p.helper || "12.4 MB of 18.2 MB, 6s remaining"}
				indeterminateLabel="Preparing"
			/>
		</div>
	);
}

export function SkeletonDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Skeleton>>(props);
	const shape = p.shape ?? "line";
	const [loading, setLoading] = useState(true);
	return (
		<div className="grid w-full max-w-72 gap-6">
			<div className="flex items-center gap-3">
				<Skeleton width="2.5rem" height="2.5rem" shape="circle" />
				<div className="flex flex-1 flex-col gap-2">
					<Skeleton width={p.width || "100%"} height={p.height || "1rem"} shape={shape} />
					<Skeleton width="60%" height="0.75rem" />
				</div>
			</div>
			<div className="grid gap-2">
				<Skeleton loading={loading} shape="block">
					<p className="text-muted-foreground text-sm leading-relaxed">
						The placeholder takes this paragraph's shape, then crossfades into it.
					</p>
				</Skeleton>
				<Button
					size="sm"
					variant="outline"
					className="justify-self-start"
					onClick={() => setLoading((v) => !v)}
				>
					{loading ? "Finish loading" : "Load again"}
				</Button>
			</div>
		</div>
	);
}

export function AlertDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Alert>>(props);
	const variant = p.variant ?? "info";
	return (
		<div className="w-full max-w-md">
			<Alert
				key={`${variant}-${String(p.dismissible)}`}
				variant={variant}
				dismissible={p.dismissible ?? false}
			>
				<svg viewBox="0 0 16 16" fill="none" aria-hidden>
					<circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.3" />
					<path
						d={ALERT_ICON[variant]}
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				<AlertTitle>Deployment finished</AlertTitle>
				<AlertDescription>
					Your last deploy finished 4 minutes ago and is serving traffic.
				</AlertDescription>
			</Alert>
		</div>
	);
}

const ACCORDION_ITEMS = [
	{
		id: "install",
		title: "How do I install a component?",
		content:
			"Run the CLI command on the Install tab. It copies the source into your project.",
	},
	{
		id: "own",
		title: "Do I own the code?",
		content:
			"Yes. Nothing is imported from a package at runtime, so you can edit any file freely.",
	},
	{
		id: "update",
		title: "How do updates work?",
		content: "Re-run the add command. The CLI will show you a diff before overwriting.",
	},
];

export function AccordionDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Accordion>>(props);
	const type = p.type ?? "single";
	const [value, setValue] = useState<string | string[]>("install");
	// Switching modes changes the value's shape, so it is reseeded rather than coerced.
	useEffect(() => setValue(type === "multiple" ? ["install"] : "install"), [type]);
	return (
		<div className="w-full max-w-md">
			<Accordion
				type={type}
				motion={p.motion}
				collapsible={p.collapsible !== false}
				value={value}
				onValueChange={setValue}
			>
				{ACCORDION_ITEMS.map((item) => (
					<AccordionItem key={item.id} value={item.id}>
						<AccordionTrigger>{item.title}</AccordionTrigger>
						<AccordionContent>{item.content}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
