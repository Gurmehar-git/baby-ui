import { createContext } from "svelte";
import type { LicenseKeyStatus } from "../license-core";
import type { licenseKey } from "../variants";

export type LicenseKeyContext = {
	readonly licenseKey: string;
	readonly status: LicenseKeyStatus;
	setStatus: (status: LicenseKeyStatus) => void;
	onRotate: () => void;
	readonly revealed: boolean;
	setRevealed: (revealed: boolean) => void;
	readonly styles: ReturnType<typeof licenseKey>;
	readonly confirmId: string;
	readonly triggerId: string;
	readonly cancelId: string;
};

export const [getLicenseKey, setLicenseKey] = createContext<LicenseKeyContext>();
