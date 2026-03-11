<script>
	import { goto } from '$app/navigation';
	import Icon from './Icon.svelte';

	export let text = 'Continue';
	export let icon = null;
	export let variant = 'primary';
	export let onclick = () => goto('/login');
</script>

<button
	class="flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-none font-abeezee text-[18px] font-semibold italic transition-all duration-200 active:translate-y-px active:scale-[0.98] active:shadow-sm sm:max-w-md {variant ===
	'primary'
		? 'hover:bg-brand-yellow-light bg-brand-yellow text-amber-900 shadow-[0_4px_12px_rgba(252,189,11,0.25)] hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(252,189,11,0.35)]'
		: 'bg-brand-gray text-brand-dark shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-px hover:bg-brand-gray-light hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)]'}"
	{onclick}
>
	<span>{text}</span>
	{#if icon}
		<Icon
			name={icon}
			width="20"
			height="12"
			color={variant === 'primary' ? '#592c00' : '#595454'}
		/>
	{/if}
</button>
