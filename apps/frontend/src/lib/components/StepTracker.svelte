<script>
	export let steps = [];
	export let currentStep = 0;
</script>

<div class="flex shrink-0 items-center gap-2 px-8 pb-5">
	{#each steps as label, i}
		<div class="flex items-center gap-1.5">
			<div
				class="flex h-6 w-6 items-center justify-center rounded-full
                 {i === currentStep
					? 'bg-brand-yellow'
					: 'border border-brand-gray'}"
			>
				<span
					class="text-xs font-semibold
                   {i === currentStep ? 'text-white' : 'text-brand-gray'}"
				>
					{i + 1}
				</span>
			</div>
			<span
				class="text-xs italic
                 {i === currentStep
					? 'font-semibold text-brand-dark'
					: 'text-brand-gray'}"
			>
				{label}
			</span>
		</div>

		{#if i < steps.length - 1}
			<div class="h-px flex-1 bg-[#E8E8E8]"></div>
		{/if}
	{/each}
</div>
