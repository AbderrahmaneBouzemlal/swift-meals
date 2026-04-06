<script>
	import { slide, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import ListingPage from '$lib/components/listing/ListingPage.svelte';
	import ListingSection from '$lib/components/listing/ListingSection.svelte';
	import NewFormHeader from '$lib/components/listing/NewFormHeader.svelte';
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
			is_active: true
		};
	}

	function openNew() {
		activeSlotId = null;
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

<ListingPage
	title="Meal Slots"
	backUrl={ROUTES.account}
	stats="{activeSlots.length} active · {inactiveSlots.length} inactive"
	bind:showNewForm
	onOpenNew={openNew}
	serverError={form?.errors?.server}
	isEmpty={!slots.length}
	emptyMessage="No meal slots yet"
>
	{#snippet newFormContent()}
		<NewFormHeader label="New Slot" onclose={closeNew} />
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
			/>
		</form>
	{/snippet}

	<ListingSection label="Active" count={activeSlots.length}>
		{#each activeSlots as slot (slot.id)}
			<div
				animate:flip={{ duration: 300 }}
				in:fly={{ y: -20, duration: 250, delay: 150 }}
				out:fly={{ y: 20, duration: 200 }}
			>
				<SlotCard {slot} formErrors={form?.errors ?? {}} bind:activeSlotId />
			</div>
		{/each}
	</ListingSection>

	<ListingSection label="Inactive" count={inactiveSlots.length}>
		{#each inactiveSlots as slot (slot.id)}
			<!--
      			out: fly downward when leaving inactive (going back up to active)
      			in:  fly in from below when arriving in inactive
   	 		-->
			<div
				animate:flip={{ duration: 300 }}
				in:fly={{ y: 20, duration: 250, delay: 150 }}
				out:fly={{ y: -20, duration: 200 }}
			>
				<SlotCard {slot} formErrors={form?.errors ?? {}} bind:activeSlotId />
			</div>
		{/each}
	</ListingSection>
</ListingPage>
