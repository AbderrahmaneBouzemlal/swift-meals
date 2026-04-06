<script>
	import InlineCard from '$lib/components/listing/InlineCard.svelte';
	import MenuForm from '$lib/components/menu/MenuForm.svelte';
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import Header from '$lib/components/Header.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { ROUTES } from '$lib/utils/routes.js';
	import { resolve } from '$app/paths';
	import ListingPage from '$lib/components/listing/ListingPage.svelte';
	import { is } from 'zod/locales';
	import NewFormHeader from '$lib/components/listing/NewFormHeader.svelte';
	import ListingSection from '$lib/components/listing/ListingSection.svelte';

	let { data, form } = $props();

	const menus = $derived(data.menus ?? []);
	let showNewForm = $state(false);
	let isSubmitting = $state(false);

	let newDraft = $state({
		name: '',
		description: '',
		is_active: true
	});

	let activeMenus = $derived(menus.filter((m) => m.is_active));
	let inactiveMenus = $derived(menus.filter((m) => !m.is_active));

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

<ListingPage
	title="Menus"
	backUrl={ROUTES.account}
	bind:showNewForm
	onOpenNew={openNew}
	serverError={form?.errors?.server}
	isEmpty={!menus.length}
	emptyMessage="No menus yet. Start by creating your first menu."
>
	{#snippet newFormContent()}
		<NewFormHeader title="Create New Menu" onCancel={closeNew} />
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
			<MenuForm {newDraft} {isSubmitting} {closeNew} />
		</form>
	{/snippet}
	<ListingSection label="Active" count={activeMenus.length}>
		<div class="flex flex-col gap-3">
			{#each menus as menu (menu.id)}
				<a href={resolve(ROUTES.dashboard.menu.byId(menu.id))}>
					<div
						in:fly={{ y: -20, duration: 250, delay: 150 }}
						out:fly={{ y: 20, duration: 200 }}
					>
						<InlineCard
							title={menu.name}
							subtitle="{menu.items_count} items · {menu.is_active
								? 'Active'
								: 'Inactive'}"
							statusDot={menu.is_active ? 'green' : 'grey'}
						/>
					</div>
				</a>
			{/each}
		</div>
	</ListingSection>
</ListingPage>
