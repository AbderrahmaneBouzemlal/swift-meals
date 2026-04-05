<script>
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import Header from '$lib/components/Header.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { ROUTES } from '$lib/utils/routes.js';
	import { resolve } from '$app/paths';

	let { data, form } = $props();

	const menus = $derived(data.menus ?? []);
	let showNewForm = $state(false);
	let isSubmitting = $state(false);

	let newDraft = $state({
		name: '',
		description: '',
		is_active: true
	});

	function openNew() {
		newDraft = { name: '', description: '', is_active: true };
		showNewForm = true;
	}

	function closeNew() {
		showNewForm = false;
	}

	$effect(() => {
		if (form?.success && form?.action === 'create') closeNew();
	});
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full flex-col overflow-hidden bg-white
         font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:max-w-md sm:rounded-phone lg:w-full lg:max-w-full lg:rounded-none lg:shadow-none"
>
	<div class="lg:hidden">
		<Header backUrl={ROUTES.account} />
	</div>

	<!-- header -->
	<div class="flex shrink-0 items-center justify-between px-8 pt-1.5 pb-4">
		<div>
			<Title size="medium">Menus</Title>
			<p class="mt-0.5 text-sm text-brand-gray italic">
				Manage your different food menus
			</p>
		</div>
		<p class="text-brand-red text-sm text-white italic">
			showNewForm: {showNewForm.toString()}
		</p>
		{#if !showNewForm}
			<button
				type="button"
				onclick={openNew}
				class="flex items-center gap-1.5 rounded-full bg-brand-yellow
               px-4 py-2 text-sm text-white italic shadow-sm
               transition hover:bg-yellow-400"
			>
				<Icon name="plus" width="10" height="10" color="white" />
				New
			</button>
		{/if}
	</div>

	<div class="flex flex-1 flex-col gap-4 overflow-y-auto px-8 pb-8">
		<!-- new menu form -->
		{#if showNewForm}
			<div
				transition:slide={{ duration: 250 }}
				class="overflow-hidden rounded-xl border-2 border-brand-yellow bg-white shadow-sm"
			>
				<div
					class="flex items-center justify-between border-b border-brand-yellow/30
                    bg-brand-yellow/5 px-4 py-3"
				>
					<p class="text-sm font-semibold text-brand-dark italic">New Menu</p>
					<button
						type="button"
						onclick={closeNew}
						class="text-brand-gray italic hover:text-brand-dark"
					>
						<Icon name="close" width="12" height="12" color="currentColor" />
					</button>
				</div>

				<form
					method="POST"
					action="?/create"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							isSubmitting = false;
							await update();
						};
					}}
					class="flex flex-col gap-4 p-4"
				>
					<div class="flex flex-col gap-1">
						<label class="text-sm text-brand-gray italic" for="menu-name"
							>Menu name</label
						>
						<input
							id="menu-name"
							name="name"
							placeholder="e.g. Regular Lunch"
							bind:value={newDraft.name}
							class="text-md h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3
                   font-abeezee text-brand-dark italic outline-none focus:border-brand-yellow focus:bg-white"
						/>
					</div>

					<div class="flex flex-col gap-1">
						<label class="text-sm text-brand-gray italic" for="menu-desc"
							>Description (optional)</label
						>
						<textarea
							id="menu-desc"
							name="description"
							placeholder="What's this menu about?"
							bind:value={newDraft.description}
							class="text-md min-h-20 w-full rounded-lg border border-gray-200 bg-gray-50 p-3
                   font-abeezee text-brand-dark italic outline-none focus:border-brand-yellow focus:bg-white"
						></textarea>
					</div>

					<div class="flex items-center justify-between">
						<span class="text-sm text-brand-dark italic">Active Menu</span>
						<button
							type="button"
							onclick={() => (newDraft.is_active = !newDraft.is_active)}
							class="flex h-7 w-12 items-center rounded-full transition-colors
                     {newDraft.is_active ? 'bg-brand-yellow' : 'bg-gray-200'}"
							aria-label="Toggle active status"
						>
							<span
								class="h-5 w-5 rounded-full bg-white shadow transition-transform
                       {newDraft.is_active ? 'translate-x-6' : 'translate-x-1'}"
							></span>
						</button>
						<input type="hidden" name="is_active" value={newDraft.is_active} />
					</div>

					<div class="flex justify-end gap-2 pt-2">
						<button
							type="button"
							onclick={closeNew}
							class="rounded-full border border-gray-200 px-4 py-2 text-sm italic"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							class="rounded-full bg-brand-yellow px-5 py-2 text-sm text-white italic shadow-sm"
						>
							{isSubmitting ? 'Creating...' : 'Create Menu'}
						</button>
					</div>
					<div>
						{#if form?.error}
							<p class="mt-2 text-sm text-red-600">{form.error}</p>
						{/if}
					</div>
				</form>
			</div>
		{/if}

		<!-- menus list -->
		{#if menus.length}
			<div class="flex flex-col gap-3">
				{#each menus as menu (menu.id)}
					<a
						href={resolve(ROUTES.dashboard.menu.byId(menu.id))}
						class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
					>
						<div>
							<p class="font-semibold text-brand-dark italic">{menu.name}</p>
							<p class="text-sm text-brand-gray italic">
								{menu.items_count} items · {menu.is_active
									? 'Active'
									: 'Inactive'}
							</p>
						</div>
						<Icon name="arrow-right" width="16" height="16" color="#BDBDBD" />
					</a>
				{/each}
			</div>
		{:else if !showNewForm}
			<div
				class="flex flex-col items-center gap-3 rounded-xl border-2
                  border-dashed border-gray-200 px-6 py-12 text-center"
			>
				<Icon name="order" width="32" height="32" color="#BDBDBD" />
				<p class="text-sm text-brand-gray italic">No menus yet</p>
				<button
					type="button"
					onclick={openNew}
					class="rounded-full bg-brand-yellow px-5 py-2 text-sm
                 text-white italic shadow-sm md:hidden"
				>
					Create your first menu
				</button>
			</div>
		{/if}
	</div>
</div>
