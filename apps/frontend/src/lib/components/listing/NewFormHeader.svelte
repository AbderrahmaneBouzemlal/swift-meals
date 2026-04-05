<script>
	import Icon from '$lib/components/ui/Icon.svelte';

	let { label = 'New', onclose } = $props();
</script>

<div
	class="flex items-center justify-between border-b border-brand-yellow/30
         bg-brand-yellow/5 px-4 py-3"
>
	<p class="text-sm font-semibold text-brand-dark italic">{label}</p>
	<button
		type="button"
		onclick={onclose}
		class="text-brand-gray italic hover:text-brand-dark"
	>
		<Icon name="close" width="12" height="12" color="currentColor" />
	</button>
</div>
