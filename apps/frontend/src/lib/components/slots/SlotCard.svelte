<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import Icon from '$lib/components/ui/Icon.svelte';
	import SlotForm from './SlotForm.svelte';
	import { formatTime, formatDays } from '$lib/utils/helpers.js';

	let { slot, formErrors = {}, activeSlotId = $bindable() } = $props();

	// svelte-ignore state_referenced_locally
	let draft = $state(toDraft(slot));
	let isSubmitting = $state(false);
	let isDeleting = $state(false);
	let confirmDelete = $state(false);

	const isExpanded = $derived(activeSlotId === slot.id);
	const isDirty = $derived(JSON.stringify(draft) !== JSON.stringify(toDraft(slot)));

	function toDraft(s) {
		return {
			name: s.name,
			start_time: s.start_time,
			end_time: s.end_time,
			repeat: s.repeat,
			days: [...(s.days ?? [])].sort((a, b) => a - b),
			max_orders: s.max_orders ?? '',
			order_cutoff: s.order_cutoff ?? 30,
			is_active: s.is_active
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
	function toggle() {
		isExpanded ? close() : open();
	}

	$effect(() => {
		if (!isExpanded) {
			draft = toDraft(slot);
		}
	});
</script>

<div
	class="overflow-hidden rounded-xl border transition-all duration-200
         {isExpanded
		? 'border-brand-yellow shadow-sm'
		: 'border-gray-100 bg-gray-50'}"
>
	<div class="flex items-center gap-3 px-4 py-3">
		<div
			class="h-2 w-2 shrink-0 rounded-full
             {slot.is_active ? 'bg-green-400' : 'bg-gray-300'}"
		></div>

		<button
			type="button"
			onclick={toggle}
			class="flex flex-1 flex-col gap-0.5 text-left"
		>
			<p class="text-[14px] text-brand-dark italic">{slot.name}</p>
			<p class="text-sm text-brand-gray italic">
				{formatTime(slot.start_time)} – {formatTime(slot.end_time)}
				· {formatDays(slot.days, slot.repeat)}
				{#if slot.max_orders}· max {slot.max_orders}{/if}
			</p>
		</button>

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

		<button
			type="button"
			onclick={toggle}
			class="shrink-0 text-brand-gray transition-transform duration-200
             {isExpanded ? 'rotate-180' : ''}"
		>
			<Icon name="chevron-down" width="12" height="12" color="currentColor" />
		</button>
	</div>

	<!-- ── inline edit form ─────────────────────────────────── -->
	{#if isExpanded}
		<div transition:slide={{ duration: 200 }} class="border-t border-gray-100">
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
				/>
			</form>

			<div class="border-t border-gray-100 px-4 pb-4">
				{#if confirmDelete}
					<div
						transition:slide={{ duration: 150 }}
						class="flex items-center gap-2 rounded-lg border
                   border-red-200 bg-red-50 px-3 py-2"
					>
						<p class="flex-1 text-[11px] text-red-600 italic">
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
						Delete this slot
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>
