<script lang="ts">
import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
	Button,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof Avatar>>(props));
const pImage = $derived(controlProps<ComponentProps<typeof AvatarImage>>(props));

const name = $derived(typeof props.name === "string" ? props.name : "Kanak Kholwal");
const initials = $derived(
	name
		.trim()
		.split(/\s+/)
		.map((word) => word[0] ?? "")
		.slice(0, 2)
		.join("")
		.toUpperCase(),
);
const TEAM = ["AP", "MW", "PN", "JB", "LO"];
let team = $state(3);
</script>

<div class="grid justify-items-start gap-5">
	<div class="flex items-center gap-3">
		<Avatar size={p.size ?? "default"} shape={p.shape ?? "circle"}>
			<AvatarFallback>{initials}</AvatarFallback>
			<AvatarImage src={pImage.src || "https://github.com/kanakkholwal.png"} alt={name} />
			<AvatarBadge class="bg-success" aria-label="Online" />
		</Avatar>
		<div class="text-sm">
			<p class="font-medium text-foreground">{name}</p>
			<p class="text-muted-foreground text-xs">Fallback shows until an image loads</p>
		</div>
	</div>
	<div class="flex items-center gap-3">
		<AvatarGroup aria-label="Team">
			{#each TEAM.slice(0, team) as member (member)}
				<Avatar size={p.size ?? "default"} shape={p.shape ?? "circle"}>
					<AvatarFallback>{member}</AvatarFallback>
				</Avatar>
			{/each}
			<AvatarGroupCount size={p.size ?? "default"} shape={p.shape ?? "circle"}>+{12 - team}</AvatarGroupCount>
		</AvatarGroup>
		<Button variant="outline" size="sm" onclick={() => (team = team === TEAM.length ? 2 : team + 1)}
			>{team === TEAM.length ? "Reset" : "Add member"}</Button
		>
	</div>
</div>
