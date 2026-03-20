<script>
	import { clickOutside } from '$lib/utils/clickOutside.js';

	let {
		value = $bindable(),
		options = [],
		placeholder = 'Select...',
		error = null
	} = $props();

	let open = $state(false);

	const normalised = $derived(
		options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o))
	);

	const selectedLabel = $derived(
		normalised.find((o) => o.value === value)?.label ?? ''
	);

	function select(val) {
		value = val;
		open = false;
	}
</script>

<div class="relative w-full" use:clickOutside={() => (open = false)}>
	<button
		type="button"
		onclick={() => (open = !open)}
		class="flex w-full items-center justify-between rounded-lg border
           bg-[#F6F6F6] px-4 py-3.5 font-abeezee text-base italic
           transition-colors duration-200 outline-none
           {open ? 'border-brand-yellow bg-white' : 'border-[#E8E8E8]'}
           {error ? 'border-red-400 ring-2 ring-red-400' : ''}
           {value ? 'text-brand-dark' : 'text-brand-gray'}"
	>
		{selectedLabel || placeholder}
		<svg
			width="12"
			height="8"
			viewBox="0 0 12 8"
			fill="none"
			class="shrink-0 transition-transform duration-200 {open
				? 'rotate-180'
				: ''}"
		>
			<path
				d="M1 1L6 6L11 1"
				stroke="#BDBDBD"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>

	{#if open}
		<div
			class="absolute top-[calc(100%+4px)] left-0 z-50 w-full overflow-hidden
                rounded-lg border border-[#E8E8E8] bg-white shadow-lg"
		>
			{#each normalised as option}
				<button
					type="button"
					onclick={() => select(option.value)}
					class="flex w-full items-center justify-between px-4 py-3
                 font-abeezee text-base italic transition-colors
                 hover:bg-[#F6F6F6]
                 {value === option.value
						? 'text-brand-yellow'
						: 'text-brand-dark'}"
				>
					{option.label}
					{#if value === option.value}
						<svg width="14" height="11" viewBox="0 0 14 11" fill="none">
							<path
								d="M1 5.5L5 9.5L13 1.5"
								stroke="#FCBD0B"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

{#if error}
	<p class="mt-1 text-xs text-red-500 italic">{error}</p>
{/if}
