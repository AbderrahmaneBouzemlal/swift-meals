<!-- src/lib/components/slots/SlotCard.svelte -->
<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import Icon from '$lib/components/ui/Icon.svelte';
	import InlineCard from '$lib/components/listing/InlineCard.svelte';
	import SlotForm from '$lib/components/slots/SlotForm.svelte';
	import { formatTime, formatDays } from '$lib/utils/helpers.js';

	let {
		slot,
		formErrors = {},
		activeSlotId = $bindable(),
		menus = []
	} = $props();

	// svelte-ignore state_referenced_locally
	let draft = $state(toDraft(slot));
	let isSubmitting = $state(false);
	let isDeleting = $state(false);
	let confirmDelete = $state(false);

	let isExpanded = $derived(activeSlotId === slot.id);
	const isDirty = $derived(
		JSON.stringify(draft) !== JSON.stringify(toDraft(slot))
	);

	function toDraft(s) {
		return {
			name: s.name,
			start_time: s.start_time,
			end_time: s.end_time,
			repeat: s.repeat,
			days: [...(s.days ?? [])].sort((a, b) => a - b),
			max_orders: s.max_orders ?? '',
			order_cutoff: s.order_cutoff ?? 30,
			is_active: s.is_active,
			menu_id: s.menu_id ?? ''
		};
	}

	function open() {
		activeSlotId = slot.id;
		draft = toDraft(slot);
	}
	function close() {
		activeSlotId = null;
		confirmDelete = false;
	}

	$effect(() => {
		if (!isExpanded) draft = toDraft(slot);
	});
</script>

<InlineCard
	title={slot.name}
	subtitle="{formatTime(slot.start_time)} – {formatTime(slot.end_time)}
            · {formatDays(slot.days, slot.repeat)}
            {slot.max_orders ? `· max ${slot.max_orders}` : ''}"
	statusDot={slot.is_active ? 'green' : 'gray'}
	bind:isExpanded
	onExpand={() => (isExpanded ? close() : open())}
>
	{#snippet rightSlot()}
		<form
			method="POST"
			action="?/toggle"
			use:enhance={() =>
				async ({ result }) => {
					if (result.type === 'success') await invalidateAll();
				}}
		>
			<input type="hidden" name="id" value={slot.id} />
			<input type="hidden" name="is_active" value={slot.is_active} />
			<button
				type="submit"
				title={slot.is_active ? 'Deactivate' : 'Activate'}
				class="flex h-7 w-12 shrink-0 items-center rounded-full transition-colors
               {slot.is_active ? 'bg-green-400' : 'bg-gray-200'}"
			>
				<span
					class="h-5 w-5 rounded-full bg-white shadow transition-transform
                 {slot.is_active ? 'translate-x-6' : 'translate-x-1'}"
				></span>
			</button>
		</form>
	{/snippet}

	{#snippet expandedContent()}
		<!-- edit form -->
		<form
			method="POST"
			action="?/update"
			use:enhance={({ cancel }) => {
				if (!isDirty) {
					cancel();
					close();
					return;
				}
				isSubmitting = true;
				return async ({ result }) => {
					isSubmitting = false;
					if (result.type === 'success') {
						close();
						await invalidateAll();
					}
				};
			}}
			class="flex flex-col gap-4 p-4"
		>
			<SlotForm
				bind:draft
				errors={formErrors}
				action="update"
				slotId={slot.id}
				oncancel={close}
				{isSubmitting}
				{menus}
			/>
		</form>

		<!-- delete section -->
		<div class="border-t border-gray-100 px-4 pb-4">
			{#if confirmDelete}
				<div
					transition:slide={{ duration: 150 }}
					class="flex items-center gap-2 rounded-lg border border-red-200
                 bg-red-50 px-3 py-2"
				>
					<p class="flex-1 text-xs text-red-600 italic">
						Delete "{slot.name}"? This cannot be undone.
					</p>
					<form
						method="POST"
						action="?/delete"
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
						<input type="hidden" name="id" value={slot.id} />
						<button
							type="submit"
							disabled={isDeleting}
							class="rounded-full bg-red-500 px-3 py-1 text-xs text-white
                     italic hover:bg-red-600 disabled:opacity-50"
						>
							{isDeleting ? 'Deleting…' : 'Delete'}
						</button>
					</form>
					<button
						type="button"
						onclick={() => (confirmDelete = false)}
						class="rounded-full border border-gray-200 px-3 py-1 text-xs
                   text-brand-gray italic hover:bg-gray-100"
					>
						Cancel
					</button>
				</div>
			{:else}
				<button
					type="button"
					onclick={() => (confirmDelete = true)}
					class="mt-1 text-xs text-brand-gray italic
                 hover:text-red-400 hover:underline"
				>
					Delete this slot
				</button>
			{/if}
		</div>
	{/snippet}
</InlineCard>
