<script>
	import Icon from './Icon.svelte';

	let {
		name = null,
		value = $bindable(),
		error = null,
		type = 'text',
		placeholder = '',
		icon = null,
		onblur
	} = $props();
</script>

<div class="relative w-full">
	<input
		{name}
		{type}
		{placeholder}
		{onblur}
		bind:value
		class="box-border h-13 w-full rounded-lg border border-brand-gray-light
			{error ? 'ring-2 ring-red-400' : 'border border-transparent'}
			bg-gray-50 pr-11 pl-4 font-abeezee text-[16px] text-brand-dark italic transition-colors duration-200 outline-none
			placeholder:text-brand-gray focus:border-brand-yellow focus:bg-white
			{icon ? 'pl-4' : ''}"
	/>
	{#if error}
		<p class="mt-1 text-xs text-red-500 italic">{error}</p>
	{/if}
	{#if icon}
		<div
			class="pointer-events-none absolute top-1/2 right-3.5 flex -translate-y-1/2 items-center"
		>
			<Icon name={icon} width="18" height="14" />
		</div>
	{/if}
</div>
