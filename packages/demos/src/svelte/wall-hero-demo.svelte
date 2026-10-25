<script lang="ts">
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	Badge,
	Button,
	MessageActions,
	MessageActionsBar,
	MessageActionsCopy,
	MessageActionsFeedback,
	MessageActionsRegenerate,
	Progress,
	ReactionBar,
	ReactionBarCount,
	ReactionBarIcon,
	ReactionBarItem,
	Switch,
	WallHero,
	WallHeroActions,
	WallHeroBrand,
	WallHeroCard,
	WallHeroColumn,
	WallHeroCommand,
	WallHeroContent,
	WallHeroDescription,
	WallHeroTitle,
	WallHeroWall,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { REACTION_BAR_ITEMS } from "../data/reaction-bar";
import {
	WALL_HERO_COMMAND,
	WALL_HERO_SETTINGS,
	WALL_HERO_TAGS,
	WALL_HERO_TEAM,
} from "../data/wall-hero";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof WallHero>>(props));
</script>

<WallHero variant={p.variant}>
	<WallHeroContent>
		<WallHeroBrand>
			<svg viewBox="0 0 28 28" aria-hidden="true" class="text-foreground">
				<rect x="3" y="9" width="12" height="16" rx="3" fill="currentColor" />
				<rect x="13" y="3" width="12" height="12" rx="3" fill="currentColor" opacity="0.45" />
			</svg>
			Baby UI
		</WallHeroBrand>
		<WallHeroTitle>Components with calm motion</WallHeroTitle>
		<WallHeroDescription>
			Composable parts for React and Svelte. Install one with the shadcn CLI and own the source.
		</WallHeroDescription>
		<WallHeroCommand command={WALL_HERO_COMMAND} />
		<WallHeroActions>
			<Button href="#components">Browse components</Button>
			<Button href="#docs" variant="outline">Read the docs</Button>
		</WallHeroActions>
	</WallHeroContent>
	<WallHeroWall>
		<WallHeroColumn duration="70s">
			<WallHeroCard>
				<Progress label="Profile setup" value={60} showValue />
			</WallHeroCard>
			<WallHeroCard>
				<ReactionBar value={["like"]}>
					{#each REACTION_BAR_ITEMS.slice(0, 3) as item (item.value)}
						<ReactionBarItem value={item.value} label={item.label} count={item.count} tone={item.tone}>
							<ReactionBarIcon icon={item.value} />
							<ReactionBarCount />
						</ReactionBarItem>
					{/each}
				</ReactionBar>
			</WallHeroCard>
			<WallHeroCard class="grid gap-3">
				{#each WALL_HERO_SETTINGS as s (s.label)}
					<Switch label={s.label} checked={s.checked} size="sm" />
				{/each}
			</WallHeroCard>
		</WallHeroColumn>
		<WallHeroColumn direction="down" duration="85s">
			<WallHeroCard class="grid gap-2">
				<p class="m-0 text-sm">Lisbon in May is mild, about 22°C by day.</p>
				<MessageActions variant="solid">
					<MessageActionsBar>
						<MessageActionsCopy text="Lisbon in May is mild." />
						<MessageActionsRegenerate />
						<MessageActionsFeedback />
					</MessageActionsBar>
				</MessageActions>
			</WallHeroCard>
			<WallHeroCard class="flex items-center justify-between gap-3">
				<AvatarGroup>
					{#each WALL_HERO_TEAM as initials (initials)}
						<Avatar><AvatarFallback>{initials}</AvatarFallback></Avatar>
					{/each}
				</AvatarGroup>
				<Badge variant="success">4 online</Badge>
			</WallHeroCard>
			<WallHeroCard>
				<Progress label="Storage" value={82} tone="info" showValue />
			</WallHeroCard>
		</WallHeroColumn>
		<WallHeroColumn duration="78s">
			<WallHeroCard class="flex flex-wrap gap-1.5">
				{#each WALL_HERO_TAGS as tag (tag)}
					<Badge variant="secondary">{tag}</Badge>
				{/each}
			</WallHeroCard>
			<WallHeroCard class="grid gap-1">
				<span class="text-muted-foreground text-xs">Revenue</span>
				<span class="flex items-baseline gap-2 font-medium text-2xl tabular-nums">
					$96.4k
					<Badge variant="success">+7.9%</Badge>
				</span>
			</WallHeroCard>
			<WallHeroCard>
				<Progress label="Onboarding" value={40} showValue />
			</WallHeroCard>
		</WallHeroColumn>
	</WallHeroWall>
</WallHero>
