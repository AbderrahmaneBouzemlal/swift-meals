<script>
	import Icon from './Icon.svelte';

	let {
		value = $bindable(),
		error = null,
		name = null,
		type = 'text',
		placeholder = '',
		icon = null,
		onblur
	} = $props();

	let showPassword = $state(false);
</script>

<div class="relative w-full">
	<input
		type={showPassword ? 'text' : 'password'}
		{placeholder}
		bind:value
		{name}
		{onblur}
		class="box-border h-13 w-full rounded-lg border border-brand-gray-light
		{error ? 'ring-2 ring-red-400' : 'border border-transparent'}
		bg-gray-50 pr-11 pl-4 font-abeezee text-[16px] text-brand-dark italic transition-colors duration-200 outline-none
		placeholder:text-brand-gray focus:border-brand-yellow focus:bg-white"
	/>
	<button
		class="absolute top-1/2 right-3.5 flex -translate-y-1/2 cursor-pointer items-center border-none bg-transparent p-0"
		aria-label={showPassword ? 'Hide password' : 'Show password'}
		onclick={() => (showPassword = !showPassword)}
	>
		<Icon
			name={showPassword ? 'eye-open' : 'eye-closed'}
			width="18"
			height={showPassword ? '14' : '16'}
			color="#BDBDBD"
		/>
	</button>
	<div class="mt-1 text-xs text-red-500">
		{error}
	</div>
</div>
