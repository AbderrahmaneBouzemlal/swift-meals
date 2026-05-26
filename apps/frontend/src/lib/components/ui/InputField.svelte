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
	let showPassword = $state(false);
</script>

<div class="relative w-full">
	<input
		{name}
		type={showPassword ? 'text' : type}
		{placeholder}
		{onblur}
		bind:value
		class="box-border h-14 w-full rounded-lg border border-brand-gray-light ring-2
			{error ? 'ring-red-400' : 'ring-transparent'}
			text-md bg-gray-50 pr-11 pl-4 font-abeezee text-brand-dark italic transition-colors duration-200 outline-none
			placeholder:text-brand-gray focus:border-brand-yellow focus:bg-white
			{icon ? 'pl-4' : ''}"
	/>

	{#if icon}
		<div
			class="pointer-events-none absolute top-1/2 right-3.5 flex -translate-y-1/2 items-center"
		>
			<Icon name={icon} width="18" height="14" />
		</div>
	{/if}
	{#if type === 'password'}
		<button
			class="absolute top-1/2 right-3.5 flex -translate-y-1/2 cursor-pointer border-none bg-transparent p-0"
			aria-label={showPassword ? 'Hide password' : 'Show password'}
			type="button"
			onclick={(e) => {
				e.stopPropagation();
				showPassword = !showPassword;
			}}
		>
			<Icon
				name={showPassword ? 'eye-open' : 'eye-closed'}
				width="18"
				height={showPassword ? '14' : '16'}
				color="#BDBDBD"
			/>
		</button>
	{/if}
	<div class="h-1 pt-1 text-xs text-red-500">
		{error}
	</div>
</div>
