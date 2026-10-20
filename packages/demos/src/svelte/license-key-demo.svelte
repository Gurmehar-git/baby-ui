<script lang="ts">
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
	type LicenseKeyVariant,
	maskKey,
	registrySnippet,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@baby-ui/svelte";
import { untrack } from "svelte";
import {
	demoKey,
	LICENSE_ENV,
	LICENSE_REGISTRY,
	LICENSE_REGISTRY_NAME,
	LICENSE_SAMPLE,
	ROTATE_DELAY_MS,
} from "../data/license-key";

let { props = {} }: { props?: Record<string, unknown> } = $props();

let status = $state<LicenseKeyStatus>("idle");
let licenseKey = $state(LICENSE_SAMPLE.licenseKey);
let createdAt = $state<string | number>(LICENSE_SAMPLE.createdAt);
let lastUsedAt = $state<string | null>(LICENSE_SAMPLE.lastUsedAt);
let revealed = $state(false);
let framework = $state("react");
const FRAMEWORKS: LicenseFramework[] = ["react", "svelte"];
let timer: ReturnType<typeof setTimeout> | undefined;

const variant = $derived<LicenseKeyVariant>(
	props.variant === "inline" ? "inline" : "card",
);
const shownKey = $derived(revealed ? licenseKey : maskKey(licenseKey));

$effect(() => () => clearTimeout(timer));

// The status and revealed controls preview a state directly.
$effect(() => {
	const forced = props.status as LicenseKeyStatus | undefined;
	if (!forced) return;
	untrack(() => {
		clearTimeout(timer);
		status = forced;
	});
});
$effect(() => {
	const forced = props.revealed as boolean | undefined;
	if (forced === undefined) return;
	untrack(() => (revealed = forced));
});

function rotate() {
	status = "rotating";
	clearTimeout(timer);
	timer = setTimeout(() => {
		licenseKey = demoKey();
		createdAt = Date.now();
		lastUsedAt = null;
		revealed = true;
		status = "idle";
	}, ROTATE_DELAY_MS);
}
</script>

<div class="w-full max-w-2xl">
	<LicenseKey {licenseKey} bind:status bind:revealed onRotate={rotate} {variant}>
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
				<span class="flex min-w-0 items-center gap-3">
					<LicenseKeyBrand>{LICENSE_REGISTRY_NAME}</LicenseKeyBrand>
					<LicenseKeyPlan>{LICENSE_SAMPLE.plan}</LicenseKeyPlan>
				</span>
				<LicenseKeyRotate />
			</LicenseKeyPassHeader>
			<div>
				<LicenseKeyValue />
				<LicenseKeyConfirm
					description="The current key stops working immediately. Update {LICENSE_ENV} wherever it's set."
					error="Couldn't reach the license server. Your current key still works."
				/>
			</div>
			<LicenseKeyMeta>
				<LicenseKeySeats used={LICENSE_SAMPLE.seats.used} total={LICENSE_SAMPLE.seats.total} />
				<LicenseKeyMetaItem label="Issued">{formatDate(createdAt)}</LicenseKeyMetaItem>
				<LicenseKeyMetaItem label="Last used">
					{formatDate(lastUsedAt, "Never used")}
				</LicenseKeyMetaItem>
			</LicenseKeyMeta>
		</LicenseKeyPass>

		<Tabs bind:value={framework} variant="segment" size="sm" class="gap-5">
			<div class="flex flex-col gap-3">
				<p class="font-medium text-sm">Setup</p>
				<TabsList aria-label="Framework">
					<TabsTrigger value="react">shadcn</TabsTrigger>
					<TabsTrigger value="svelte">shadcn-svelte</TabsTrigger>
				</TabsList>
			</div>
			{#each FRAMEWORKS as f (f)}
				<TabsContent value={f} class="mt-0">
					<LicenseKeySetup>
						<LicenseKeyStep title="Add the registry to components.json">
							<LicenseKeyCode
								text={registrySnippet(LICENSE_REGISTRY_NAME, LICENSE_REGISTRY[f] ?? "", LICENSE_ENV)}
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
								text={installCommand(f, LICENSE_REGISTRY_NAME, LICENSE_SAMPLE.exampleItem)}
							/>
						</LicenseKeyStep>
					</LicenseKeySetup>
				</TabsContent>
			{/each}
		</Tabs>
	</LicenseKey>
</div>
