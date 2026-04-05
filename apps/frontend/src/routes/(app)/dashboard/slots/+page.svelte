<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import Header from '$lib/components/Header.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import SlotCard from '$lib/components/slots/SlotCard.svelte';
	import SlotForm from '$lib/components/slots/SlotForm.svelte';
	import { ROUTES } from '$lib/utils/routes.js';

	let { data, form } = $props();

	const slots = $derived(data.slots?.results ?? []);
	const activeSlots = $derived(slots.filter((s) => s.is_active));
	const inactiveSlots = $derived(slots.filter((s) => !s.is_active));

	let activeSlotId = $state(null);
	let showNewForm = $state(false);
	let isSubmitting = $state(false);

	let newDraft = $state(blankSlot());

	function blankSlot() {
		return {
			name: '',
			start_time: '12:00',
			end_time: '14:00',
			repeat: 'weekly',
			days: [0, 1, 2, 3, 4],
			max_orders: '',
			order_cutoff: 30,
			is_active: true,
			menu_id: null
		};
	}

	function openNew() {
		activeSlotId = null; // close any open card
		newDraft = blankSlot();
		showNewForm = true;
	}

	function closeNew() {
		showNewForm = false;
		newDraft = blankSlot();
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
			<Title size="medium">Meal Slots</Title>
			<p class="mt-0.5 text-sm text-brand-gray italic">
				{activeSlots.length} active · {inactiveSlots.length} inactive
			</p>
		</div>
		{#if !showNewForm}
			<button
				type="button"
				onclick={openNew}
				class="flex items-center gap-1.5 rounded-full bg-brand-yellow
               px-4 py-2 text-sm text-white italic shadow-sm
               transition hover:bg-yellow-400"
			>
				<Icon name="plus" width="10" height="10" color="white" />
				Add Slot
			</button>
		{/if}
	</div>

	<div class="flex flex-1 flex-col gap-4 overflow-y-auto px-8 pb-8">
		<!-- new slot form -->
		{#if showNewForm}
			<div
				transition:slide={{ duration: 250 }}
				class="overflow-hidden rounded-xl border-2 border-brand-yellow bg-white shadow-sm"
			>
				<div
					class="flex items-center justify-between border-b border-brand-yellow/30
                    bg-brand-yellow/5 px-4 py-3"
				>
					<p class="text-sm font-semibold text-brand-dark italic">New Slot</p>
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
						return async ({ result }) => {
							isSubmitting = false;
							if (result.type === 'success') {
								closeNew();
								await invalidateAll();
							}
						};
					}}
					class="flex flex-col gap-4 p-4"
				>
					<SlotForm
						bind:draft={newDraft}
						errors={form?.errors ?? {}}
						action="create"
						oncancel={closeNew}
						{isSubmitting}
						menus={data.menus?.results || []}
					/>
				</form>
			</div>
		{/if}

		<!-- active -->
		{#if activeSlots.length}
			<div>
				<p class="mb-2 text-sm text-brand-gray italic">Active</p>
				<div class="flex flex-col gap-3">
					{#each activeSlots as slot (slot.id)}
						<SlotCard
							{slot}
							formErrors={form?.errors ?? {}}
							bind:activeSlotId
							menus={data.menus?.results || []}
						/>
					{/each}
				</div>
			</div>
		{/if}

		<!-- inactive -->
		{#if inactiveSlots.length}
			<div>
				<p class="mb-2 text-sm text-brand-gray italic">Inactive</p>
				<div class="flex flex-col gap-3">
					{#each inactiveSlots as slot (slot.id)}
						<SlotCard
							{slot}
							formErrors={form?.errors ?? {}}
							bind:activeSlotId
							menus={data.menus?.results || []}
						/>
					{/each}
				</div>
			</div>
		{/if}

		<!-- empty state -->
		{#if !slots.length && !showNewForm}
			<div
				class="flex flex-col items-center gap-3 rounded-xl border-2
                  border-dashed border-gray-200 px-6 py-12 text-center"
			>
				<Icon name="order" width="32" height="32" color="#BDBDBD" />
				<p class="text-sm text-brand-gray italic">No meal slots yet</p>
				<button
					type="button"
					onclick={openNew}
					class="rounded-full bg-brand-yellow px-5 py-2 text-sm
                 text-white italic shadow-sm"
				>
					Create your first slot
				</button>
			</div>
		{/if}

		{#if form?.errors?.server}
			<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
				<p class="text-xs text-red-500 italic">{form.errors.server}</p>
			</div>
		{/if}
	</div>
</div>
