<script lang="ts">
import {
	GradientHero01,
	GradientHero01Action,
	GradientHero01Actions,
	GradientHero01Badge,
	GradientHero01Content,
	GradientHero01Description,
	GradientHero01Title,
} from "@baby-ui/svelte";
</script>

<GradientHero01>
	<GradientHero01Content>
		<GradientHero01Badge>New in 2.0</GradientHero01Badge>
		<GradientHero01Title>Ship the page, not the scaffolding</GradientHero01Title>
		<GradientHero01Description>Sections that look finished on the first pass.</GradientHero01Description>
		<GradientHero01Actions>
			<GradientHero01Action href="/docs">Get started</GradientHero01Action>
			<GradientHero01Action variant="outline" href="/pricing">Pricing</GradientHero01Action>
		</GradientHero01Actions>
	</GradientHero01Content>
</GradientHero01>
