<!-- src/lib/components/listing/InlineCard.svelte -->
<script>
	import { slide } from 'svelte/transition';
	import Icon from '$lib/components/ui/Icon.svelte';

	let {
		title,
		subtitle = '',
		isExpanded = $bindable(false),
		statusDot = null, // 'green' | 'gray' | null
		rightSlot, // snippet: rendered right of title (e.g. toggle switch)
		expandedContent // snippet: shown when expanded
	} = $props();
</script>

<div
	class="overflow-hidden rounded-xl border transition-all duration-200
         {isExpanded
		? 'border-brand-yellow shadow-sm'
		: 'border-gray-100 bg-gray-50'}"
>
	<!-- header row -->
	<div class="flex items-center gap-3 px-4 py-3">
		{#if statusDot}
			<div
				class="h-2 w-2 shrink-0 rounded-full
               {statusDot === 'green' ? 'bg-green-400' : 'bg-gray-300'}"
			></div>
		{/if}

		<!-- title area — tap to expand -->
		<button
			type="button"
			onclick={() => (isExpanded = !isExpanded)}
			class="flex flex-1 flex-col gap-0.5 text-left"
		>
			<p class="text-[14px] text-brand-dark italic">{title}</p>
			{#if subtitle}
				<p class="text-sm text-brand-gray italic">{subtitle}</p>
			{/if}
		</button>

		<!-- right slot: toggle, badge, actions -->
		{#if rightSlot}
			{@render rightSlot()}
		{/if}

		<!-- chevron -->
		<button
			type="button"
			onclick={() => (isExpanded = !isExpanded)}
			class="shrink-0 text-brand-gray transition-transform duration-200
             {isExpanded ? 'rotate-180' : ''}"
		>
			<Icon name="chevron-down" width="12" height="12" color="currentColor" />
		</button>
	</div>

	<!-- expanded content -->
	{#if isExpanded && expandedContent}
		<div transition:slide={{ duration: 200 }} class="border-t border-gray-100">
			{@render expandedContent()}
		</div>
	{/if}
</div>
