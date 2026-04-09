<script>
	import { slide } from 'svelte/transition';
	import Icon from '$lib/components/ui/Icon.svelte';
	import DeleteSection from '../DeleteSection.svelte';
	import { ROUTES } from '$lib/utils/routes.js';

	let {
		id = null,
		title,
		image = null,
		subtitle = '',
		isExpanded = $bindable(false),
		statusDot = null,
		onExpand = null,
		deletable = false,
		isDeleting = false,
		rightSlot,
		expandedContent
	} = $props();

	let showDelete = $state(false);

	function handleToggle() {
		if (onExpand) onExpand();
		else isExpanded = !isExpanded;
	}
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
		{#if image}
			<div class="px-4 pt-3">
				<img
					src={image}
					alt={title}
					class="h-32 w-full rounded-lg object-cover"
				/>
			</div>
		{/if}

		<!-- title area — tap to expand -->
		<button
			type="button"
			onclick={handleToggle}
			class="flex flex-1 flex-col gap-0.5 text-left"
		>
			<p class="text-md text-brand-dark italic">{title}</p>
			{#if subtitle}
				<p class="text-sm text-brand-gray italic">{subtitle}</p>
			{/if}
		</button>

		{#if rightSlot}
			{@render rightSlot()}
		{/if}
		{#if deletable}
			<button
				type="button"
				class="shrink-0 text-red-400 hover:text-red-600"
				onclick={() => (showDelete = true)}
			>
				<Icon name="trash" width="14" height="14" color="currentColor" />
			</button>
		{:else}
			<button
				type="button"
				onclick={handleToggle}
				class="shrink-0 text-brand-gray transition-transform duration-200
             {isExpanded ? 'rotate-180' : ''}"
			>
				<Icon name="chevron-down" width="12" height="12" color="currentColor" />
			</button>
		{/if}
	</div>
	{#if showDelete}
		<DeleteSection {id} name={title} onclose={() => (isDeleting = true)} />
	{/if}

	<!-- expanded content -->
	{#if isExpanded && expandedContent}
		<div transition:slide={{ duration: 200 }} class="border-t border-gray-100">
			{@render expandedContent()}
		</div>
	{/if}
</div>
