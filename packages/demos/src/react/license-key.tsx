"use client";

import {
	envLine,
	formatDate,
	installCommand,
	type LicenseFramework,
	LicenseKey,
	LicenseKeyBrand,
	LicenseKeyCode,
	LicenseKeyConfirm,
	LicenseKeyDescription,
	LicenseKeyHeader,
	LicenseKeyHeading,
	LicenseKeyMeta,
	LicenseKeyMetaItem,
	LicenseKeyPass,
	LicenseKeyPassHeader,
	LicenseKeyPlan,
	LicenseKeyRotate,
	LicenseKeySeats,
	LicenseKeySetup,
	type LicenseKeyStatus,
	LicenseKeyStep,
	LicenseKeyTitle,
	LicenseKeyValue,
	maskKey,
	registrySnippet,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@baby-ui/react";
import { useEffect, useRef, useState } from "react";
import {
	demoKey,
	LICENSE_ENV,
	LICENSE_REGISTRY,
	LICENSE_REGISTRY_NAME,
	LICENSE_SAMPLE,
	ROTATE_DELAY_MS,
} from "../data/license-key";

const FRAMEWORKS: LicenseFramework[] = ["react", "svelte"];

export function LicenseKeyDemo({ props }: { props: Record<string, unknown> }) {
	const [status, setStatus] = useState<LicenseKeyStatus>("idle");
	const [licenseKey, setLicenseKey] = useState(LICENSE_SAMPLE.licenseKey);
	const [createdAt, setCreatedAt] = useState<string | number>(LICENSE_SAMPLE.createdAt);
	const [lastUsedAt, setLastUsedAt] = useState<string | null>(LICENSE_SAMPLE.lastUsedAt);
	const [revealed, setRevealed] = useState(false);
	const [framework, setFramework] = useState("react");
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const variant = props.variant === "inline" ? "inline" : "card";
	const forcedStatus = props.status as LicenseKeyStatus | undefined;
	const forcedRevealed = props.revealed as boolean | undefined;
	const shownKey = revealed ? licenseKey : maskKey(licenseKey);

	useEffect(() => () => clearTimeout(timer.current), []);

	// The status and revealed controls preview a state directly.
	useEffect(() => {
		if (!forcedStatus) return;
		clearTimeout(timer.current);
		setStatus(forcedStatus);
	}, [forcedStatus]);
	useEffect(() => {
		if (forcedRevealed !== undefined) setRevealed(forcedRevealed);
	}, [forcedRevealed]);

	function rotate() {
		setStatus("rotating");
		clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			setLicenseKey(demoKey());
			setCreatedAt(Date.now());
			setLastUsedAt(null);
			setRevealed(true);
			setStatus("idle");
		}, ROTATE_DELAY_MS);
	}

	return (
		<div className="w-full max-w-2xl">
			<LicenseKey
				licenseKey={licenseKey}
				status={status}
				onStatusChange={setStatus}
				revealed={revealed}
				onRevealedChange={setRevealed}
				onRotate={rotate}
				variant={variant}
			>
				<LicenseKeyHeader>
					<LicenseKeyHeading>
						<LicenseKeyTitle>License key</LicenseKeyTitle>
						<LicenseKeyDescription>
							Authenticates the Pro registry for the shadcn CLI. Treat it like a password.
						</LicenseKeyDescription>
					</LicenseKeyHeading>
				</LicenseKeyHeader>

				<LicenseKeyPass>
					<LicenseKeyPassHeader>
						<span className="flex min-w-0 items-center gap-3">
							<LicenseKeyBrand>{LICENSE_REGISTRY_NAME}</LicenseKeyBrand>
							<LicenseKeyPlan>{LICENSE_SAMPLE.plan}</LicenseKeyPlan>
						</span>
						<LicenseKeyRotate />
					</LicenseKeyPassHeader>
					<div>
						<LicenseKeyValue />
						<LicenseKeyConfirm
							description={`The current key stops working immediately. Update ${LICENSE_ENV} wherever it's set.`}
							error="Couldn't reach the license server. Your current key still works."
						/>
					</div>
					<LicenseKeyMeta>
						<LicenseKeySeats
							used={LICENSE_SAMPLE.seats.used}
							total={LICENSE_SAMPLE.seats.total}
						/>
						<LicenseKeyMetaItem label="Issued">
							{formatDate(createdAt)}
						</LicenseKeyMetaItem>
						<LicenseKeyMetaItem label="Last used">
							{formatDate(lastUsedAt, "Never used")}
						</LicenseKeyMetaItem>
					</LicenseKeyMeta>
				</LicenseKeyPass>

				<Tabs
					value={framework}
					onValueChange={setFramework}
					variant="segment"
					size="sm"
					className="gap-5"
				>
					<div className="flex flex-col gap-3">
						<p className="font-medium text-sm">Setup</p>
						<TabsList aria-label="Framework">
							<TabsTrigger value="react">shadcn</TabsTrigger>
							<TabsTrigger value="svelte">shadcn-svelte</TabsTrigger>
						</TabsList>
					</div>
					{FRAMEWORKS.map((f) => (
						<TabsContent key={f} value={f} className="mt-0">
							<LicenseKeySetup>
								<LicenseKeyStep title="Add the registry to components.json">
									<LicenseKeyCode
										text={registrySnippet(
											LICENSE_REGISTRY_NAME,
											LICENSE_REGISTRY[f] ?? "",
											LICENSE_ENV,
										)}
									/>
								</LicenseKeyStep>
								<LicenseKeyStep title="Put the key in .env, next to components.json">
									<LicenseKeyCode
										text={envLine(LICENSE_ENV, shownKey)}
										copyText={envLine(LICENSE_ENV, licenseKey)}
									/>
								</LicenseKeyStep>
								<LicenseKeyStep title="Install your first component">
									<LicenseKeyCode
										text={installCommand(
											f,
											LICENSE_REGISTRY_NAME,
											LICENSE_SAMPLE.exampleItem,
										)}
									/>
								</LicenseKeyStep>
							</LicenseKeySetup>
						</TabsContent>
					))}
				</Tabs>
			</LicenseKey>
		</div>
	);
}
