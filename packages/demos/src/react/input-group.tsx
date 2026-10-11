"use client";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
	Label,
} from "@baby-ui/react";
import { type ComponentProps, type ReactNode, useId, useState } from "react";
import {
	cardBrand,
	formatAmount,
	formatCard,
	formatPhone,
	passwordStrength,
} from "../data/input-group";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

function Icon({ children }: { children: ReactNode }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			{children}
		</svg>
	);
}

function Example({
	id,
	label,
	wide,
	children,
}: {
	id: string;
	label: string;
	wide?: boolean;
	children: ReactNode;
}) {
	return (
		<div
			className={wide ? "flex flex-col gap-1.5 sm:col-span-2" : "flex flex-col gap-1.5"}
		>
			<Label htmlFor={id}>{label}</Label>
			{children}
		</div>
	);
}

// Search, password, currency, phone and card fields are InputGroup recipes, not components.
export function InputGroupDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof InputGroup>>(props);
	const size = p.size ?? "default";
	const id = useId();
	const [domain, setDomain] = useState("");
	const [note, setNote] = useState("");
	const [copied, setCopied] = useState(false);
	const [query, setQuery] = useState("");
	const [password, setPassword] = useState("");
	const [revealed, setRevealed] = useState(false);
	const [amount, setAmount] = useState("");
	const [phone, setPhone] = useState("");
	const [card, setCard] = useState("");
	const brand = cardBrand(card);

	return (
		<div className="grid w-full max-w-2xl gap-x-4 gap-y-5 sm:grid-cols-2">
			<Example id={`${id}-domain`} label="Domain">
				<InputGroup size={size}>
					<InputGroupAddon>
						<InputGroupText>https://</InputGroupText>
					</InputGroupAddon>
					<InputGroupInput
						id={`${id}-domain`}
						placeholder="acme"
						value={domain}
						onChange={(e) => setDomain(e.currentTarget.value)}
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupText>.dev</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
			</Example>

			<Example id={`${id}-search`} label="Search">
				<InputGroup size={size}>
					<InputGroupAddon>
						<Icon>
							<path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4" />
						</Icon>
					</InputGroupAddon>
					<InputGroupInput
						id={`${id}-search`}
						type="search"
						placeholder="Search docs"
						value={query}
						onChange={(e) => setQuery(e.currentTarget.value)}
					/>
					{query ? (
						<InputGroupAddon align="inline-end">
							<InputGroupButton
								size="icon-xs"
								aria-label="Clear search"
								onClick={() => setQuery("")}
							>
								<Icon>
									<path d="M18 6 6 18M6 6l12 12" />
								</Icon>
							</InputGroupButton>
						</InputGroupAddon>
					) : null}
				</InputGroup>
			</Example>

			<Example id={`${id}-password`} label="Password">
				<InputGroup size={size}>
					<InputGroupInput
						id={`${id}-password`}
						type={revealed ? "text" : "password"}
						autoComplete="new-password"
						placeholder="8+ characters"
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
					/>
					<InputGroupAddon align="inline-end">
						{password ? (
							<InputGroupText aria-live="polite">
								{passwordStrength(password)}
							</InputGroupText>
						) : null}
						<InputGroupButton
							size="icon-xs"
							aria-label={revealed ? "Hide password" : "Show password"}
							aria-pressed={revealed}
							onClick={() => setRevealed((on) => !on)}
						>
							<Icon>
								<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
								<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
								{revealed ? <path d="m3 3 18 18" /> : null}
							</Icon>
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
			</Example>

			<Example id={`${id}-amount`} label="Amount">
				<InputGroup size={size}>
					<InputGroupAddon>
						<InputGroupText>$</InputGroupText>
					</InputGroupAddon>
					<InputGroupInput
						id={`${id}-amount`}
						inputMode="decimal"
						placeholder="0.00"
						className="tabular-nums"
						value={amount}
						onChange={(e) => setAmount(e.currentTarget.value)}
						onBlur={() => setAmount((raw) => formatAmount(raw))}
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupText>USD</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
			</Example>

			<Example id={`${id}-phone`} label="Phone">
				<InputGroup size={size}>
					<InputGroupAddon>
						<InputGroupText>+1</InputGroupText>
					</InputGroupAddon>
					<InputGroupInput
						id={`${id}-phone`}
						type="tel"
						autoComplete="tel-national"
						placeholder="(555) 123-4567"
						className="tabular-nums"
						value={phone}
						onChange={(e) => setPhone(formatPhone(e.currentTarget.value))}
					/>
				</InputGroup>
			</Example>

			<Example id={`${id}-card`} label="Card number">
				<InputGroup size={size}>
					<InputGroupAddon>
						<Icon>
							<path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M7 15h3" />
						</Icon>
					</InputGroupAddon>
					<InputGroupInput
						id={`${id}-card`}
						inputMode="numeric"
						autoComplete="cc-number"
						placeholder="1234 5678 9012 3456"
						className="tabular-nums"
						value={card}
						onChange={(e) => setCard(formatCard(e.currentTarget.value))}
					/>
					{brand ? (
						<InputGroupAddon align="inline-end">
							<InputGroupText>{brand}</InputGroupText>
						</InputGroupAddon>
					) : null}
				</InputGroup>
			</Example>

			<Example id={`${id}-invite`} label="Invite link">
				<InputGroup size={size}>
					<InputGroupInput
						id={`${id}-invite`}
						readOnly
						value="https://acme.dev/join/7fk2"
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupButton
							size="icon-xs"
							aria-label={copied ? "Copied" : "Copy link"}
							onClick={() => setCopied(true)}
						>
							<Icon>
								{copied ? (
									<path d="m5 12 5 5L20 7" />
								) : (
									<path d="M8 8h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2zM16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
								)}
							</Icon>
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
			</Example>

			<Example id={`${id}-note`} label="Release note" wide>
				<InputGroup>
					<InputGroupTextarea
						id={`${id}-note`}
						placeholder="What changed?"
						value={note}
						onChange={(e) => setNote(e.currentTarget.value)}
						rows={3}
					/>
					<InputGroupAddon align="block-end">
						<InputGroupText className="ml-auto tabular-nums">
							{note.length}/280
						</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
			</Example>
		</div>
	);
}
