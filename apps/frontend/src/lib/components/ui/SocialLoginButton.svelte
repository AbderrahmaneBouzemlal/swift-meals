<script>
	import Icon from './Icon.svelte';
	export let provider;
	export let ariaLabel = `Sign in with ${provider}`;
</script>

<button
	class="flex h-12.25 w-12.25 cursor-pointer items-center justify-center rounded-full border-none bg-gray-100
	transition-all duration-200 hover:scale-105 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
	aria-label={ariaLabel}
>
	<div class="flex items-center justify-center">
		<Icon name="google" width="24" height="24" />
	</div>
</button>
