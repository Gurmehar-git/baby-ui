<script lang="ts">
import {
	Avatar,
	AvatarFallback,
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Checkbox,
	Input,
	type InputSize,
	Label,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Progress,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Slider,
	Switch,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	ToggleGroup,
	ToggleGroupItem,
} from "@baby-ui/svelte";

let { size }: { size: InputSize } = $props();

// Preview copy only: a plausible product so every control shows in context.
const REGIONS = [
	{ value: "fra", label: "Frankfurt" },
	{ value: "iad", label: "Virginia" },
	{ value: "sin", label: "Singapore" },
];
const MEMBERS = [
	{ name: "Ari Chen", email: "ari@acme.dev", role: "Owner" },
	{ name: "Sana Holt", email: "sana@acme.dev", role: "Editor" },
	{ name: "Leo Park", email: "leo@acme.dev", role: "Viewer" },
];

let region = $state("fra");
let plan = $state("pro");
let analytics = $state(true);
let budget = $state(60);
let page = $state(2);
</script>

<div class="grid gap-4 lg:grid-cols-2">
	<Card>
		<CardHeader>
			<CardTitle>Create project</CardTitle>
			<CardDescription>Deploys from your main branch.</CardDescription>
		</CardHeader>
		<CardContent class="flex flex-col gap-4">
			<div class="flex flex-col gap-1.5">
				<Label for="create-name">Name</Label>
				<Input id="create-name" {size} value="acme-dashboard" />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label>Region</Label>
				<Select type="single" bind:value={region} items={REGIONS}>
					<SelectTrigger {size} aria-label="Region"><SelectValue /></SelectTrigger>
					<SelectContent {size}>
						{#each REGIONS as r (r.value)}
							<SelectItem value={r.value} label={r.label}>{r.label}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			</div>
			<div class="flex flex-col gap-1.5">
				<Label>Plan</Label>
				<ToggleGroup type="single" bind:value={plan} {size} label="Plan" class="w-fit">
					<ToggleGroupItem value="hobby">Hobby</ToggleGroupItem>
					<ToggleGroupItem value="pro">Pro</ToggleGroupItem>
					<ToggleGroupItem value="team">Team</ToggleGroupItem>
				</ToggleGroup>
			</div>
			<Switch bind:checked={analytics} label="Enable analytics" />
		</CardContent>
		<CardFooter class="justify-end gap-2">
			<Button variant="outline" {size}>Cancel</Button>
			<Button {size}>Create</Button>
		</CardFooter>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Members</CardTitle>
			<CardDescription>Three people can deploy.</CardDescription>
		</CardHeader>
		<CardContent class="flex flex-col gap-3">
			{#each MEMBERS as m (m.email)}
				<div class="flex items-center gap-3">
					<Avatar size="sm">
						<AvatarFallback>{m.name.split(" ").map((w) => w[0]).join("")}</AvatarFallback>
					</Avatar>
					<div class="min-w-0 flex-1">
						<p class="truncate font-medium text-foreground text-sm">{m.name}</p>
						<p class="truncate text-muted-foreground text-xs">{m.email}</p>
					</div>
					<Badge variant={m.role === "Owner" ? "default" : "secondary"}>{m.role}</Badge>
				</div>
			{/each}
		</CardContent>
		<CardFooter>
			<Button variant="secondary" {size} class="w-full">Invite member</Button>
		</CardFooter>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Usage</CardTitle>
			<CardDescription>Resets on the 1st.</CardDescription>
		</CardHeader>
		<CardContent class="flex flex-col gap-5">
			<Progress value={72} showValue label="Build minutes" />
			<div class="flex flex-col gap-2">
				<Label>Spend limit · ${budget}</Label>
				<Slider bind:value={budget} min={0} max={200} step={10} aria-label="Spend limit" />
			</div>
			<div class="flex flex-col gap-2.5">
				<Checkbox checked label="Email me at 80%" />
				<Checkbox label="Pause builds at the limit" />
			</div>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Activity</CardTitle>
			<CardDescription>Deploys and comments.</CardDescription>
		</CardHeader>
		<CardContent>
			<Tabs value="all" variant="segment" {size}>
				<TabsList>
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="deploys">Deploys</TabsTrigger>
					<TabsTrigger value="comments">Comments</TabsTrigger>
				</TabsList>
				<TabsContent value="all" class="pt-4 text-muted-foreground text-sm">
					Production deployed 4 minutes ago.
				</TabsContent>
				<TabsContent value="deploys" class="pt-4 text-muted-foreground text-sm">
					12 deploys this week.
				</TabsContent>
				<TabsContent value="comments" class="pt-4 text-muted-foreground text-sm">
					No new comments.
				</TabsContent>
			</Tabs>
		</CardContent>
		<CardFooter class="justify-center gap-1">
			<PaginationPrevious {size} disabled={page <= 1} onclick={() => (page = Math.max(1, page - 1))} />
			{#each [1, 2, 3] as n (n)}
				<PaginationLink {size} active={n === page} onclick={() => (page = n)}>{n}</PaginationLink>
			{/each}
			<PaginationNext {size} disabled={page >= 3} onclick={() => (page = Math.min(3, page + 1))} />
		</CardFooter>
	</Card>
</div>
