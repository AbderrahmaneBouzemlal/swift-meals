<script>
	import { goto } from '$app/navigation';
	import Icon from './Icon.svelte';
	import { ROUTES } from '$lib/utils/routes.js';

	let {
		text,
		onclick,
		disabled = false,
		loading = false,
		icon = null,
		variant = 'primary'
	} = $props();
</script>

<button
	class="flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-none font-abeezee text-lg font-semibold italic transition-all duration-200 active:translate-y-px active:scale-[0.98] active:shadow-sm {variant ===
	'primary'
		? 'hover:bg-brand-yellow-light bg-brand-yellow text-amber-900 shadow-[0_4px_12px_rgba(252,189,11,0.25)] hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(252,189,11,0.35)]'
		: 'bg-brand-gray text-brand-dark shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-px hover:bg-brand-gray-light hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)]'} 
		disabled:cursor-not-allowed disabled:opacity-50"
	{onclick}
	disabled={disabled || loading}
>
	{#if loading}
		<span class="flex items-center justify-center gap-2">
			<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				/>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
			</svg>
			{text}
		</span>
	{:else}
		<span class="flex items-center justify-center gap-3">
			{text}
			{#if icon}
				<Icon
					name={icon}
					width="20"
					height="12"
					color={variant === 'primary' ? 'currentColor' : '#595454'}
				/>
			{/if}
		</span>
	{/if}
</button>
