<script>
	import { toastStore } from '$lib/stores/toasts.svelte.js';
	import { fly } from 'svelte/transition';
	import Icon from '$lib/components/ui/Icon.svelte';
	const icons = {
		success: 'success',
		error: 'fail',
		warning: 'warning'
	};

	const colors = {
		success: 'bg-green-500',
		error: 'bg-red-500',
		warning: 'bg-brand-yellow'
	};
</script>

<div
	class="pointer-events-none fixed bottom-20 left-1/2 z-50 flex
            w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4"
>
	{#each toastStore.list as toast (toast.id)}
		<div
			transition:fly={{ y: 20, duration: 250 }}
			class="pointer-events-auto flex items-center gap-3 rounded-xl
             {colors[toast.type]} px-4 py-3 shadow-lg"
		>
			<span class="text-sm font-bold text-white"
				><Icon name={icons[toast.type]} width="24" height="24" /></span
			>
			<p class="flex-1 text-sm text-white italic">{toast.message}</p>
			<button
				onclick={() => toastStore.dismiss(toast.id)}
				class="text-white/70 hover:text-white"
				aria-label="Dismiss"
			>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path
						d="M1 1L11 11M11 1L1 11"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</div>
	{/each}
</div>
