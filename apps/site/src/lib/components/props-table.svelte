<script lang="ts">
import { IconChevronDown } from "@baby-ui/icons";
import type { PropSpec } from "@baby-ui/registry-schema";
import { Markdown } from "@baby-ui/svelte";
import { prefersReducedMotion } from "svelte/motion";
import { slide } from "svelte/transition";

let { props: specs }: { props: PropSpec[] } = $props();

let open = $state<Record<string, boolean>>({});
const duration = $derived(prefersReducedMotion.current ? 0 : 200);
</script>

{#if specs.length}
	<div class="relative overflow-hidden rounded-xl border border-border">
		<table class="w-full table-fixed border-collapse text-left">
			<thead>
				<tr class="border-border border-b">
					<th
						scope="col"
						class="w-[42%] px-4 py-2.5 font-medium text-muted-foreground text-xs sm:w-[30%]"
					>
						Prop
					</th>
					<th scope="col" class="px-4 py-2.5 font-medium text-muted-foreground text-xs">
						Type
					</th>
					<th scope="col" class="w-10"><span class="sr-only">Details</span></th>
				</tr>
			</thead>
			<tbody>
				{#each specs as prop (prop.name)}
					{@const expanded = Boolean(open[prop.name])}
					<tr class="border-border/60 border-b last:border-b-0">
						<td colspan="3" class="p-0">
							<button
								type="button"
								aria-expanded={expanded}
								onclick={() => (open[prop.name] = !expanded)}
								class="grid w-full grid-cols-[42%_minmax(0,1fr)_2.5rem] items-center text-left transition-colors hover:bg-foreground/[0.03] sm:grid-cols-[30%_minmax(0,1fr)_2.5rem]"
							>
								<span class="min-w-0 px-4 py-3 font-mono text-[13px] text-info-strong wrap-anywhere">
									{prop.name}{prop.required ? "" : "?"}
								</span>
								<span class="min-w-0 px-4 py-3 font-mono text-[13px] text-foreground wrap-anywhere">
									{prop.type}
								</span>
								<span class="flex justify-center px-2 text-muted-foreground">
									<IconChevronDown
										size={16}
										class="transition-[transform,scale,translate] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] motion-reduce:transition-none"
										style={expanded ? "transform: rotate(180deg)" : undefined}
									/>
								</span>
							</button>

							{#if expanded}
								<div transition:slide={{ duration }} class="overflow-hidden">
									<div class="border-border/60 border-t px-4 py-3">
										<Markdown content={prop.description} />
										<dl class="mt-3 grid grid-cols-[6rem_minmax(0,1fr)] items-baseline gap-y-1">
											<dt class="text-muted-foreground text-sm">Default</dt>
											<dd class="font-mono text-[13px] text-foreground wrap-anywhere">
												{prop.default === undefined ? "none" : String(prop.default)}
											</dd>
										</dl>
									</div>
								</div>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
