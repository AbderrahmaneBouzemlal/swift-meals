<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Icon from '$lib/components/ui/Icon.svelte';
	import InlineCard from '$lib/components/listing/InlineCard.svelte';
	import MenuItemForm from './MenuItemForm.svelte';

	let { item, formErrors = {}, activeItemId = $bindable() } = $props();

	const isExpanded = $derived(activeItemId === item.id);

	let draft = $state(blankDraft());
	let isSubmitting = $state(false);
	let isDeleting = $state(false);
	let confirmDelete = $state(false);

	function blankDraft() {
		return {
			id: null,
			name: '',
			description: '',
			price: '',
			is_available: true,
			image: null
		};
	}

	function toDraft(i) {
		return {
			id: i.id,
			name: i.name,
			description: i.description ?? '',
			price: i.price,
			is_available: i.is_available,
			image: null
		};
	}

	$effect(() => {
		if (!isExpanded) draft = toDraft(item);
	});

	function open() {
		activeItemId = item.id;
		draft = toDraft(item);
	}
	function close() {
		activeItemId = null;
		confirmDelete = false;
	}
</script>

<InlineCard
	title={item.name}
	subtitle="RM {item.price} · {item.is_available ? 'Available' : 'Unavailable'}"
	statusDot={item.is_available ? 'green' : 'gray'}
	{isExpanded}
	onExpand={() => (isExpanded ? close() : open())}
>
	{#snippet rightSlot()}
		<div class="flex items-center gap-2">
			{#if item.image_url}
				<img
					src={item.image_url}
					alt={item.name}
					class="h-10 w-10 rounded-lg object-cover ring-1 ring-black/5"
				/>
			{/if}

			<!-- quick availability toggle -->
			<form
				method="POST"
				action="?/toggleItem"
				use:enhance={() =>
					async ({ result }) => {
						if (result.type === 'success') await invalidateAll();
					}}
			>
				<input type="hidden" name="id" value={item.id} />
				<input type="hidden" name="is_available" value={item.is_available} />
				<button
					type="submit"
					title={item.is_available ? 'Mark unavailable' : 'Mark available'}
					class="flex h-6 w-10 shrink-0 items-center rounded-full transition-colors
               {item.is_available ? 'bg-green-400' : 'bg-gray-200'}"
				>
					<span
						class="h-4 w-4 rounded-full bg-white shadow transition-transform
                 {item.is_available ? 'translate-x-5' : 'translate-x-1'}"
					></span>
				</button>
			</form>
		</div>
	{/snippet}

	{#snippet expandedContent()}
		<!-- image preview -->
		{#if item.image_url}
			<div class="px-4 pt-3">
				<img
					src={item.image_url}
					alt={item.name}
					class="h-32 w-full rounded-lg object-cover"
				/>
			</div>
		{/if}

		<!-- edit form -->
		<form
			method="POST"
			action="?/upsertItem"
			enctype="multipart/form-data"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result }) => {
					isSubmitting = false;
					if (result.type === 'success') {
						close();
						await invalidateAll();
					}
				};
			}}
			class="flex flex-col gap-3 p-4"
		>
			<MenuItemForm
				bind:draft
				errors={formErrors}
				action="update"
				oncancel={close}
				{isSubmitting}
				currentImageUrl={item.image_url}
			/>
		</form>

		<!-- delete section -->
		<div class="border-t border-gray-100 px-4 pb-4">
			{#if confirmDelete}
				<div
					class="flex items-center gap-2 rounded-lg border border-red-200
                    bg-red-50 px-3 py-2"
				>
					<p class="flex-1 text-[11px] text-red-600 italic">
						Delete "{item.name}"? This cannot be undone.
					</p>
					<form
						method="POST"
						action="?/deleteItem"
						use:enhance={() => {
							isDeleting = true;
							return async ({ result }) => {
								isDeleting = false;
								if (result.type === 'success') {
									close();
									await invalidateAll();
								}
							};
						}}
					>
						<input type="hidden" name="id" value={item.id} />
						<button
							type="submit"
							disabled={isDeleting}
							class="rounded-full bg-red-500 px-3 py-1 text-[11px]
                     text-white italic hover:bg-red-600 disabled:opacity-50"
						>
							{isDeleting ? 'Deleting…' : 'Delete'}
						</button>
					</form>
					<button
						type="button"
						onclick={() => (confirmDelete = false)}
						class="rounded-full border border-gray-200 px-3 py-1 text-[11px]
                   text-brand-gray italic hover:bg-gray-100"
					>
						Cancel
					</button>
				</div>
			{:else}
				<button
					type="button"
					onclick={() => (confirmDelete = true)}
					class="mt-1 text-[11px] text-brand-gray italic
                 hover:text-red-400 hover:underline"
				>
					Delete this item
				</button>
			{/if}
		</div>
	{/snippet}
</InlineCard>
