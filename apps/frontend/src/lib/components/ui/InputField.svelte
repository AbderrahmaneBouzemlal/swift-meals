<script>
	import Icon from './Icon.svelte';

	export let type = 'text';
	export let placeholder = '';
	export let value = '';
	export let icon = null; // Optional left icon
</script>

<div class="relative w-full">
	<input
		{type}
		{placeholder}
		bind:value
		class="box-border h-13 w-full rounded-lg border border-brand-gray-light bg-gray-50 pr-11 pl-4 font-abeezee text-[16px] text-brand-dark italic transition-colors duration-200 outline-none placeholder:text-brand-gray focus:border-brand-yellow focus:bg-white {icon
			? 'pl-4'
			: ''}"
	/>
	{#if icon}
		<div
			class="pointer-events-none absolute top-1/2 right-3.5 flex -translate-y-1/2 items-center"
		>
			<Icon name={icon} width="18" height="14" />
		</div>
	{/if}
</div>
