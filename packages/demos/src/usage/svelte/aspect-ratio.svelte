<script lang="ts">
import { AspectRatio, AspectRatioImage } from "@baby-ui/svelte";
</script>

<AspectRatio ratio={16 / 9} class="rounded-xl bg-muted">
	<AspectRatioImage src="/harbour.jpg" alt="Harbour at dusk" width={1200} height={800} />
</AspectRatio>
