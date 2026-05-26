<script>
	import Icon from './Icon.svelte';
	import InputField from './InputField.svelte';

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
	<InputField
		type={showPassword ? 'text' : 'password'}
		{placeholder}
		bind:value
		{name}
		{onblur}
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
