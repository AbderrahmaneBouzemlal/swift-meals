<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const { backUrl = null } = $props();

	function handleBack() {
		// Try browser history first for natural back button behavior
		if (window.history.length > 1) {
			window.history.back();
		} else if (backUrl) {
			// Fallback to provided back URL if history is unavailable
			goto(resolve(backUrl));
		} else {
			// Final fallback to home
			goto(resolve('/'));
		}
	}
</script>

<div class="shrink-0 px-8 pt-2">
	<button
		class="flex cursor-pointer items-center border-none bg-transparent py-5 transition-transform duration-200
		hover:-translate-x-1"
		onclick={handleBack}
		aria-label="Go back"
	>
		<Icon name="back-arrow" width="24" height="20" />
	</button>
</div>
