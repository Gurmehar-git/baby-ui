<script lang="ts">
import {
	Button,
	CtaBanner,
	CtaBannerActions,
	CtaBannerContent,
	CtaBannerDescription,
	CtaBannerTicker,
	CtaBannerTitle,
} from "@baby-ui/svelte";
</script>

<CtaBanner variant="ticker">
	<CtaBannerTicker word="Acme" angle={-38} />
	<CtaBannerContent>
		<CtaBannerTitle>Ready to get started?</CtaBannerTitle>
		<CtaBannerDescription>Put it on your own server in a few minutes.</CtaBannerDescription>
		<CtaBannerActions>
			<Button size="lg" variant="secondary">Install</Button>
			<Button size="lg" variant="dark">Try the demo</Button>
		</CtaBannerActions>
	</CtaBannerContent>
</CtaBanner>
