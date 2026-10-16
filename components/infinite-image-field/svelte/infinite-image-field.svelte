<script lang="ts">
import DriftField from "./drift-field.svelte";
import FisheyeField from "./fisheye-field.svelte";
import GalleryField from "./gallery-field.svelte";
import type { InfiniteImageFieldLabels } from "./labels";
import type {
	InfiniteImageFieldLayout,
	InfiniteImageFieldShape,
	InfiniteImageFieldSize,
	InfiniteImageFieldVariant,
	InfiniteImageItem,
} from "./variants";

let {
	variant = "drift",
	...rest
}: {
	/** Tiles repeat endlessly; each cell always shows the same item. */
	items: InfiniteImageItem[];
	variant?: InfiniteImageFieldVariant;
	size?: InfiniteImageFieldSize;
	/** Drift: tile corners. */
	shape?: InfiniteImageFieldShape;
	/** Drift: `staggered` offsets every other column by half a tile. */
	layout?: InfiniteImageFieldLayout;
	/** Drift and fisheye: tile size in CSS px (at the lens edge for fisheye). */
	imageWidth?: number;
	imageHeight?: number;
	/** Drift and fisheye: space between tiles in CSS px. */
	gap?: number;
	/** Drift: top speed in CSS px per frame at 60fps. */
	maxSpeed?: number;
	/** Drift: how quickly the drift follows the pointer, 0 to 1 per frame. */
	smoothing?: number;
	/** Fisheye and gallery: lens strength, 0 is flat. Defaults per variant. */
	lens?: number;
	/** Fisheye: momentum kept after a drag, 0 to 0.98. */
	inertia?: number;
	/** Fisheye: frame each image with a title and caption row. */
	captions?: boolean;
	/** Gallery: cell size in world units; the view is 2 units tall. */
	cellSize?: number;
	/** Gallery: how far the view pulls back while dragging; 1 disables it. */
	dragZoom?: number;
	/** Gallery: the "drag to explore" hint. */
	showHint?: boolean;
	labels?: Partial<InfiniteImageFieldLabels>;
	class?: string;
} = $props();
</script>

<!-- An endless image field: drifts toward the pointer, or pans by drag through a fisheye or WebGL lens. -->
{#if variant === "fisheye"}
	<FisheyeField {...rest} />
{:else if variant === "gallery"}
	<GalleryField {...rest} />
{:else}
	<DriftField {...rest} />
{/if}
