<script>
	import Icon from './Icon.svelte';

	export let time = '9:41';
	export let showWifi = true;
</script>

<div class="flex h-[44px] shrink-0 items-center justify-between px-8 py-3 pt-4">
	<span class="text-[15px] font-semibold text-brand-dark">{time}</span>
	<div class="flex items-center gap-1.5">
		<Icon name="signal" width="17" height="12" />
		{#if showWifi}
			<Icon name="wifi" width="16" height="12" />
		{/if}
		<Icon name="battery" width="25" height="12" />
	</div>
</div>
