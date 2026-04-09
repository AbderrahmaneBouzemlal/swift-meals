<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Icon from '$lib/components/ui/Icon.svelte';
	import InlineCard from '$lib/components/listing/InlineCard.svelte';
	import SlotForm from '$lib/components/slots/SlotForm.svelte';
	import DeleteSection from '$lib/components/DeleteSection.svelte';
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

	const isExpanded = $derived(activeSlotId === slot.id);
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
			max_orders: s.max_orders ?? null,
			order_cutoff: s.order_cutoff ?? 30,
			is_active: s.is_active,
			menu_id: s.menu_id ?? null
		};
	}

	function open() {
		activeSlotId = slot.id;
		draft = toDraft(slot);
	}
	function close() {
		activeSlotId = null;
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
	{isExpanded}
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

		<DeleteSection id={slot.id} name={slot.name} onclose={close} />
	{/snippet}
</InlineCard>
