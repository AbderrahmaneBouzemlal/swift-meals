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
	image={item.image_url}
	statusDot={item.is_available ? 'green' : 'gray'}
	{isExpanded}
	onExpand={() => (isExpanded ? close() : open())}
>
	{#snippet expandedContent()}
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
