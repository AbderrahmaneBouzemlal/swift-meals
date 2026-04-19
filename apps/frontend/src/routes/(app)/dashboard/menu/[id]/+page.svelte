<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import ListingComponent from '$lib/components/listing/ListingComponent.svelte';
	import ListingSection from '$lib/components/listing/ListingSection.svelte';
	import NewFormHeader from '$lib/components/listing/NewFormHeader.svelte';
	import MenuEditForm from '$lib/components/menu/MenuEditForm.svelte';
	import MenuItemCard from '$lib/components/menu/MenuItemCard.svelte';
	import MenuItemForm from '$lib/components/menu/MenuItemForm.svelte';
	import { ROUTES } from '$lib/utils/routes.js';

	let { data, form } = $props();

	let menu = $derived(data.menu ?? {});
	let items = $derived(data.items ?? []);

	const availableItems = $derived(items.filter((i) => i.is_available));
	const unavailableItems = $derived(items.filter((i) => !i.is_available));

	let activeItemId = $state(null);
	let showNewForm = $state(false);
	let isSubmitting = $state(false);

	let newDraft = $state(blankItem());

	function blankItem() {
		return {
			id: null,
			name: '',
			description: '',
			price: '',
			is_available: true,
			image: null
		};
	}

	function openNew() {
		activeItemId = null;
		newDraft = blankItem();
		showNewForm = true;
	}

	function closeNew() {
		showNewForm = false;
		newDraft = blankItem();
	}

	$effect(() => {
		if (form?.success && form?.action === 'upsertItem') closeNew();
	});
</script>

<ListingComponent
	title={menu.name}
	backUrl={ROUTES.dashboard.menu.list}
	stats="{items.length} items · {availableItems.length} available · {unavailableItems.length} unavailable"
	bind:showNewForm
	onOpenNew={openNew}
	serverError={form?.errors?.server}
	isEmpty={!items.length}
	emptyMessage="No items in this menu yet"
	emptyIcon="order"
>
	<!-- menu detail editor sits above the items list -->
	{#snippet newFormContent()}
		<NewFormHeader label="New Item" onclose={closeNew} />
		<form
			method="POST"
			action="?/upsertItem"
			enctype="multipart/form-data"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result }) => {
					isSubmitting = false;
					if (result.type === 'success') {
						closeNew();
						await invalidateAll();
					}
				};
			}}
			class="flex flex-col gap-3 p-4"
		>
			<MenuItemForm
				bind:draft={newDraft}
				errors={form?.errors ?? {}}
				action="create"
				oncancel={closeNew}
				{isSubmitting}
			/>
		</form>
	{/snippet}

	<div class=" rounded-xl border border-gray-100 bg-gray-50 p-4">
		<div class="mb-3 flex items-center gap-1 text-brand-gray-dark italic">
			<Icon name="settings" width="16" height="16" color="currentColor" />
			<p class="text-bold text-lg tracking-wide uppercase italic">
				Menu settings
			</p>
		</div>

		<MenuEditForm {menu} {isSubmitting} />
	</div>

	<ListingSection label="Available" count={availableItems.length}>
		{#each availableItems as item (item.id)}
			<MenuItemCard {item} formErrors={form?.errors ?? {}} bind:activeItemId />
		{/each}
	</ListingSection>

	<ListingSection label="Unavailable" count={unavailableItems.length}>
		{#each unavailableItems as item (item.id)}
			<MenuItemCard {item} formErrors={form?.errors ?? {}} bind:activeItemId />
		{/each}
	</ListingSection>
</ListingComponent>
