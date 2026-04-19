<script>
	import { slide } from 'svelte/transition';
	import Header from '$lib/components/Header.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	let {
		title,
		backUrl,
		stats = '',
		showNewForm = $bindable(false),
		onOpenNew = null,
		serverError = null,
		emptyIcon = 'order',
		emptyMessage = 'Nothing here yet',
		isEmpty = false,
		children,
		newFormContent
	} = $props();
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full flex-col overflow-hidden bg-white
         font-abeezee shadow-2xl sm:my-8 sm:max-w-md sm:rounded-phone
         lg:w-full lg:max-w-full lg:rounded-none lg:shadow-none"
>
	<div class="lg:hidden">
		<Header {backUrl} />
	</div>

	<!-- header -->
	<div class="flex shrink-0 items-center justify-between px-8 pt-1.5 pb-4">
		<div>
			<Title size="medium">{title}</Title>
			{#if stats}
				<p class="mt-0.5 text-sm text-brand-gray italic">{stats}</p>
			{/if}
		</div>

		{#if onOpenNew && !showNewForm}
			<button
				type="button"
				onclick={onOpenNew}
				class="flex items-center gap-1.5 rounded-full bg-brand-yellow
               px-4 py-2 text-sm text-white italic shadow-sm
               transition hover:bg-yellow-400"
			>
				<Icon name="plus" width="10" height="10" color="white" />
				Add
			</button>
		{/if}
	</div>

	<div class="flex flex-1 flex-col gap-4 overflow-y-auto px-8 pb-8">
		<!-- new form -->
		{#if showNewForm && newFormContent}
			<div
				transition:slide={{ duration: 250 }}
				class="overflow-hidden rounded-xl border-2 border-brand-yellow
               bg-white shadow-sm"
			>
				{@render newFormContent()}
			</div>
		{/if}

		<!-- list content -->
		{@render children()}

		<!-- empty state -->
		{#if isEmpty && !showNewForm}
			<div
				class="flex flex-col items-center gap-3 rounded-xl border-2
               border-dashed border-gray-200 px-6 py-12 text-center"
			>
				<Icon name={emptyIcon} width="32" height="32" color="#BDBDBD" />
				<p class="text-sm text-brand-gray italic">{emptyMessage}</p>
				{#if onOpenNew}
					<button
						type="button"
						onclick={onOpenNew}
						class="rounded-full bg-brand-yellow px-5 py-2 text-sm
                   text-white italic shadow-sm"
					>
						Create the first one
					</button>
				{/if}
			</div>
		{/if}

		<!-- server error -->
		{#if serverError}
			<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
				<p class="text-xs text-red-500 italic">{serverError}</p>
			</div>
		{/if}
	</div>
</div>
