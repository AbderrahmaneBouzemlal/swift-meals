<script>
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import Header from '$lib/components/Header.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { ROUTES } from '$lib/utils/routes.js';

	let { data, form } = $props();

	let menu = $derived(data.menu);
	let items = $derived(data.items);

	let showItemForm = $state(false);
	let editingItem = $state(null);
	let isSubmitting = $state(false);
	let itemDraft = $state({
		id: null,
		name: '',
		description: '',
		price: '',
		is_available: true,
		image: null
	});

	function openAddItem() {
		editingItem = null;
		itemDraft = {
			id: null,
			name: '',
			description: '',
			price: '',
			is_available: true,
			image: null
		};
		showItemForm = true;
	}

	function openEditItem(item) {
		editingItem = item;
		itemDraft = { ...item, image: null };
		showItemForm = true;
	}

	function closeItemForm() {
		showItemForm = false;
		editingItem = null;
	}

	$effect(() => {
		if (form?.success && form?.action === 'upsertItem') closeItemForm();
	});
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full flex-col overflow-hidden bg-white
         font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:max-w-md sm:rounded-phone lg:w-full lg:max-w-full lg:rounded-none lg:shadow-none"
>
	<div class="lg:hidden">
		<Header backUrl={ROUTES.dashboard.menu.list} />
	</div>

	<!-- header -->
	<div class="flex shrink-0 items-center justify-between px-8 pt-1.5 pb-4">
		<div>
			<Title size="medium">{menu.name}</Title>
			<p class="mt-0.5 text-sm text-brand-gray italic">
				{items.length} items in this menu
			</p>
		</div>
	</div>

	<div class="flex flex-1 flex-col gap-6 overflow-y-auto px-8 pb-8">
		<!-- menu details form -->
		<section class="flex flex-col gap-4 border-b border-gray-100 py-2">
			<form
				method="POST"
				action="?/updateMenu"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
				class="flex flex-col gap-4"
			>
				<div class="flex flex-col gap-1">
					<label class="text-sm text-brand-gray italic" for="menu-name"
						>Menu Name</label
					>
					<input
						id="menu-name"
						name="name"
						bind:value={menu.name}
						class="text-md h-10 w-full rounded-lg border border-gray-100 bg-gray-50 px-3
               font-abeezee text-brand-dark italic outline-none focus:border-brand-yellow focus:bg-white"
					/>
				</div>

				<div class="flex flex-col gap-1">
					<label class="text-sm text-brand-gray italic" for="menu-desc"
						>Description</label
					>
					<textarea
						id="menu-desc"
						name="description"
						bind:value={menu.description}
						class="text-md min-h-16 w-full rounded-lg border border-gray-100 bg-gray-50 p-3
               font-abeezee text-brand-dark italic outline-none focus:border-brand-yellow focus:bg-white"
					></textarea>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<button
							type="button"
							onclick={() => (menu.is_active = !menu.is_active)}
							class="flex h-6 w-10 items-center rounded-full transition-colors
                     {menu.is_active ? 'bg-brand-yellow' : 'bg-gray-200'}"
							aria-label="Toggle menu active status"
						>
							<span
								class="h-4 w-4 rounded-full bg-white shadow transition-transform
                       {menu.is_active ? 'translate-x-5' : 'translate-x-1'}"
							></span>
						</button>
						<span class="text-sm text-brand-gray italic">Menu is Active</span>
						<input type="hidden" name="is_active" value={menu.is_active} />
					</div>

					<button
						type="submit"
						class="text-sm font-semibold text-brand-yellow italic transition-transform active:scale-95"
					>
						Update Menu
					</button>
				</div>
			</form>
		</section>

		<!-- items section -->
		<section class="flex flex-col gap-4">
			<div class="flex items-center justify-between">
				<p class="text-sm font-semibold text-brand-dark italic">Menu Items</p>
				<button
					type="button"
					onclick={openAddItem}
					class="flex items-center gap-1.5 text-sm text-brand-yellow italic"
				>
					<Icon name="plus" width="10" height="10" color="currentColor" />
					Add Item
				</button>
			</div>

			{#if showItemForm}
				<div
					transition:slide={{ duration: 250 }}
					class="rounded-xl border border-brand-yellow/30 bg-brand-yellow/5 p-4"
				>
					<p class="mb-4 text-sm font-semibold text-brand-dark italic">
						{editingItem ? 'Edit Item' : 'New Item'}
					</p>
					<form
						method="POST"
						action="?/upsertItem"
						enctype="multipart/form-data"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ update }) => {
								isSubmitting = false;
								await update();
							};
						}}
						class="flex flex-col gap-3"
					>
						<input type="hidden" name="id" value={itemDraft.id} />

						<input
							name="name"
							placeholder="Item name"
							bind:value={itemDraft.name}
							class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 font-abeezee
                   text-sm text-brand-dark italic outline-none focus:border-brand-yellow"
						/>

						<textarea
							name="description"
							placeholder="Short description"
							bind:value={itemDraft.description}
							class="min-h-16 w-full rounded-lg border border-gray-200 bg-white p-3 font-abeezee
                   text-sm text-brand-dark italic outline-none focus:border-brand-yellow"
						></textarea>

						<div class="flex gap-3">
							<input
								name="price"
								type="number"
								step="0.01"
								placeholder="Price"
								bind:value={itemDraft.price}
								class="h-10 flex-1 rounded-lg border border-gray-200 bg-white px-3 font-abeezee
                     text-sm text-brand-dark italic outline-none focus:border-brand-yellow"
							/>
							<div class="flex items-center gap-2 px-2">
								<button
									type="button"
									onclick={() =>
										(itemDraft.is_available = !itemDraft.is_available)}
									class="flex h-5 w-9 items-center rounded-full transition-colors
                           {itemDraft.is_available
										? 'bg-brand-yellow'
										: 'bg-gray-200'}"
									aria-label="Toggle item availability"
								>
									<span
										class="h-3.5 w-3.5 rounded-full bg-white transition-transform
                             {itemDraft.is_available
											? 'translate-x-5'
											: 'translate-x-0.5'}"
									></span>
								</button>
								<span class="text-xs text-brand-gray italic">Available</span>
								<input
									type="hidden"
									name="is_available"
									value={itemDraft.is_available}
								/>
							</div>
						</div>

						<div class="flex flex-col gap-1">
							<label class="text-xs text-brand-gray italic" for="item-image"
								>Item Image</label
							>
							<input
								id="item-image"
								type="file"
								name="image"
								accept="image/*"
								class="text-xs italic"
							/>
						</div>

						<div class="flex justify-end gap-2 pt-2">
							<button
								type="button"
								onclick={closeItemForm}
								class="text-xs text-brand-gray italic"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								class="rounded-full bg-brand-yellow px-4 py-1.5 text-xs text-white italic shadow-sm"
							>
								{isSubmitting
									? 'Saving...'
									: editingItem
										? 'Save Item'
										: 'Add Item'}
							</button>
						</div>
					</form>
				</div>
			{/if}

			{#if items.length}
				<div class="flex flex-col gap-3">
					{#each items as item (item.id)}
						<div
							class="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
						>
							{#if item.image_url}
								<img
									src={item.image_url}
									alt={item.name}
									class="h-16 w-16 rounded-lg object-cover"
								/>
							{:else}
								<div
									class="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200"
								>
									<Icon name="order" width="20" height="20" color="#BDBDBD" />
								</div>
							{/if}

							<div class="flex flex-1 flex-col justify-center">
								<div class="flex items-center justify-between">
									<p class="text-sm font-semibold text-brand-dark italic">
										{item.name}
									</p>
									<p class="text-xs font-bold text-brand-yellow italic">
										${item.price}
									</p>
								</div>
								<p class="mt-0.5 line-clamp-1 text-xs text-brand-gray italic">
									{item.description || 'No description'}
								</p>
								<div class="mt-2 flex items-center justify-between">
									<span
										class="rounded-full px-2 py-0.5 text-xs italic
                             {item.is_available
											? 'bg-green-100 text-green-600'
											: 'bg-red-100 text-red-600'}"
									>
										{item.is_available ? 'Available' : 'Unavailable'}
									</span>

									<div class="flex gap-3">
										<button
											onclick={() => openEditItem(item)}
											class="text-xs text-brand-gray italic hover:text-brand-yellow"
										>
											Edit
										</button>
										<form
											method="POST"
											action="?/deleteItem"
											use:enhance={() => {
												isSubmitting = true;
												return async ({ update }) => {
													isSubmitting = false;
													await update();
												};
											}}
										>
											<input type="hidden" name="id" value={item.id} />
											<button
												type="submit"
												class="text-xs text-brand-gray italic hover:text-red-500"
											>
												Delete
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else if !showItemForm}
				<div
					class="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-100 py-8 text-center"
				>
					<Icon name="order" width="24" height="24" color="#E0E0E0" />
					<p class="text-sm text-brand-gray italic">
						No items added to this menu yet
					</p>
					<button
						onclick={openAddItem}
						class="text-sm font-semibold text-brand-yellow italic"
					>
						Add your first item
					</button>
				</div>
			{/if}
		</section>
	</div>
</div>
