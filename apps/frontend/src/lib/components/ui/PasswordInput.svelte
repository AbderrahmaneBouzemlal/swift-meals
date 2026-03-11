<script>
	import Icon from './Icon.svelte';

	export let placeholder = 'Password';
	export let value = '';

	let showPassword = false;
</script>

<div class="relative w-full">
	<input
		type={showPassword ? 'text' : 'password'}
		{placeholder}
		bind:value
		class="box-border h-13 w-full rounded-lg border border-brand-gray-light bg-gray-50 pr-11 pl-4 font-abeezee text-[16px] text-brand-dark italic transition-colors duration-200 outline-none placeholder:text-brand-gray focus:border-brand-yellow focus:bg-white"
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
</div>
