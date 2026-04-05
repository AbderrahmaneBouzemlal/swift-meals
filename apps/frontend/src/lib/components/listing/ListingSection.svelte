<!-- src/lib/components/listing/ListingSection.svelte -->
<script>
	let { label, count = null, children } = $props();
</script>

{#if count !== 0}
	<div>
		<p class="mb-2 text-sm text-brand-gray italic">
			{label}{count !== null ? ` (${count})` : ''}
		</p>
		<div class="flex flex-col gap-3">
			{@render children()}
		</div>
	</div>
{/if}
