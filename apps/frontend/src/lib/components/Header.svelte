<script>
	import Icon from './ui/Icon.svelte';
	import { goto } from '$app/navigation';
	export let backUrl = '/';
</script>

<div class="shrink-0 px-8 pt-2">
	<button
		class="flex cursor-pointer items-center border-none bg-transparent py-5 transition-transform duration-200
		hover:-translate-x-1"
		onclick={() => goto(backUrl)}
		aria-label="Go back"
	>
		<Icon name="back-arrow" width="24" height="20" />
	</button>
</div>
