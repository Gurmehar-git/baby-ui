import {
	LicenseKey,
	LicenseKeyConfirm,
	LicenseKeyHeader,
	LicenseKeyPass,
	LicenseKeyRotate,
	type LicenseKeyStatus,
	LicenseKeyTitle,
	LicenseKeyValue,
} from "@baby-ui/react";
import { useState } from "react";

export function Example({ licenseKey: initialKey }: { licenseKey: string }) {
	const [licenseKey, setLicenseKey] = useState(initialKey);
	const [status, setStatus] = useState<LicenseKeyStatus>("idle");
	const [error, setError] = useState<string>();

	async function rotate() {
		setStatus("rotating");
		const res = await fetch("/api/license/rotate", { method: "POST" });
		if (!res.ok) {
			setError("Couldn't regenerate the key. The current one still works.");
			setStatus("error");
			return;
		}
		setLicenseKey((await res.json()).key);
		setStatus("idle");
	}

	return (
		<LicenseKey
			licenseKey={licenseKey}
			status={status}
			onStatusChange={setStatus}
			onRotate={rotate}
		>
			<LicenseKeyHeader>
				<LicenseKeyTitle>License key</LicenseKeyTitle>
				<LicenseKeyRotate />
			</LicenseKeyHeader>
			<div>
				<LicenseKeyPass>
					<LicenseKeyValue />
				</LicenseKeyPass>
				<LicenseKeyConfirm
					description="The current key stops working immediately."
					error={error}
				/>
			</div>
		</LicenseKey>
	);
}
