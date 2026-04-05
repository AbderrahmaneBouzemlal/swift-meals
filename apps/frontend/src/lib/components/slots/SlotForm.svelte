<script>
	import { slide } from 'svelte/transition';
	import { REPEAT_OPTIONS, DAYS } from '$lib/utils/constants.js';

	let {
		draft = $bindable(),
		errors = {},
		action = 'create',
		slotId = null,
		oncancel,
		isSubmitting = false,
		menus = []
	} = $props();

	function toggleDay(day) {
		draft.days = draft.days.includes(day)
			? draft.days.filter((d) => d !== day)
			: [...draft.days, day].sort((a, b) => a - b);
	}
</script>

{#if slotId}
	<input type="hidden" name="id" value={slotId} />
{/if}

<div class="flex flex-col gap-1">
	<label class="text-sm text-brand-gray italic" for="slot-name">
		Slot name *
	</label>
	<input
		id="slot-name"
		name="name"
		placeholder="e.g. Lunch, Dinner, Morning Snack"
		bind:value={draft.name}
		class="text-md h-11 w-full rounded-lg border bg-gray-50 px-3
           font-abeezee text-brand-dark italic outline-none
           focus:border-brand-yellow focus:bg-white
           {errors.name
			? 'border-red-400 ring-1 ring-red-400'
			: 'border-gray-200'}"
	/>
	{#if errors.name}
		<p class="text-xs text-red-500 italic">{errors.name}</p>
	{/if}
</div>

<div class="flex gap-3">
	{#each [{ id: 'slot-start-time', name: 'start_time', label: 'Start time *', key: 'start_time' }, { id: 'slot-end-time', name: 'end_time', label: 'End time *', key: 'end_time' }] as field (field.id)}
		<div class="flex flex-1 flex-col gap-1">
			<label class="text-sm text-brand-gray italic" for={field.id}>
				{field.label}
			</label>
			<input
				type="time"
				id={field.id}
				name={field.name}
				bind:value={draft[field.key]}
				class="text-md h-11 w-full rounded-lg border bg-gray-50 px-3
               font-abeezee text-brand-dark italic outline-none
               focus:border-brand-yellow focus:bg-white
               {errors[field.key]
					? 'border-red-400 ring-1 ring-red-400'
					: 'border-gray-200'}"
			/>
		</div>
	{/each}
</div>
{#if errors.end_time}
	<p class="-mt-2 text-xs text-red-500 italic">{errors.end_time}</p>
{/if}

<div class="flex flex-col gap-1">
	<label class="text-sm text-brand-gray italic" for="slot-repeat">
		Repeat
	</label>
	<div class="flex gap-2" id="slot-repeat">
		{#each REPEAT_OPTIONS as option (option.value)}
			<button
				type="button"
				onclick={() => (draft.repeat = option.value)}
				class="flex-1 rounded-lg border py-2 text-sm italic transition-colors
               {draft.repeat === option.value
					? 'border-brand-yellow bg-brand-yellow/10 text-brand-dark'
					: 'border-gray-200 bg-gray-50 text-brand-gray'}"
			>
				{option.label}
			</button>
		{/each}
	</div>
	<input type="hidden" name="repeat" value={draft.repeat} />
</div>

{#if draft.repeat === 'weekly'}
	<div class="flex flex-col gap-2" transition:slide={{ duration: 150 }}>
		<label class="text-sm text-brand-gray italic" for="slot-days">
			Days *
		</label>
		<div class="flex gap-1.5">
			{#each DAYS as day (day.value)}
				<button
					type="button"
					onclick={() => toggleDay(day.value)}
					class="flex h-9 flex-1 items-center justify-center rounded-lg
                 text-sm italic transition-colors
                 {draft.days.includes(day.value)
						? 'bg-brand-yellow text-white'
						: 'bg-gray-100 text-brand-gray hover:bg-gray-200'}"
				>
					{day.label}
				</button>
			{/each}
		</div>
		{#if errors.days}
			<p class="text-xs text-red-500 italic">{errors.days}</p>
		{/if}
	</div>
	<input type="hidden" name="days" value={JSON.stringify(draft.days)} />
{/if}

<div class="flex gap-3">
	{#each [{ id: 'slot-max-orders', name: 'max_orders', label: 'Max orders', placeholder: 'Unlimited', min: 1, key: 'max_orders' }, { id: 'slot-order-cutoff', name: 'order_cutoff', label: 'Order cutoff (mins)', placeholder: '30', min: 0, key: 'order_cutoff' }] as field (field.id)}
		<div class="flex flex-1 flex-col gap-1">
			<label class="text-sm text-brand-gray italic" for={field.id}>
				{field.label}
			</label>
			<input
				type="number"
				id={field.id}
				name={field.name}
				placeholder={field.placeholder}
				min={field.min}
				bind:value={draft[field.key]}
				class="text-md h-11 w-full rounded-lg border border-gray-200
               bg-gray-50 px-3 font-abeezee text-brand-dark italic
               outline-none focus:border-brand-yellow focus:bg-white"
			/>
		</div>
	{/each}
</div>

<div class="flex flex-col gap-1">
	<label class="text-sm text-brand-gray italic" for="slot-menu">
		Menu to serve *
	</label>
	<select
		id="slot-menu"
		name="menu_id"
		bind:value={draft.menu_id}
		class="text-md h-11 w-full rounded-lg border bg-gray-50 px-3
           font-abeezee text-brand-dark italic outline-none
           focus:border-brand-yellow focus:bg-white
           {errors.menu
			? 'border-red-400 ring-1 ring-red-400'
			: 'border-gray-200'}"
	>
		<option value={null} disabled>Select a menu</option>
		{#each menus as menu (menu.id)}
			<option value={menu.id}>{menu.name}</option>
		{/each}
	</select>
	{#if errors.menu}
		<p class="text-xs text-red-500 italic">{errors.menu}</p>
	{/if}
</div>

{#if action === 'create'}
	<div
		class="flex items-center justify-between rounded-lg border
              border-gray-100 bg-gray-50 px-4 py-3"
	>
		<span class="text-sm text-brand-dark italic">Make active immediately</span>
		<button
			type="button"
			onclick={() => (draft.is_active = !draft.is_active)}
			class="flex h-7 w-12 items-center rounded-full transition-colors
             {draft.is_active ? 'bg-brand-yellow' : 'bg-gray-200'}"
			aria-pressed={draft.is_active}
			aria-label="Toggle active status"
		>
			<span
				class="h-5 w-5 rounded-full bg-white shadow transition-transform
               {draft.is_active ? 'translate-x-6' : 'translate-x-1'}"
			></span>
		</button>
	</div>
{/if}
<input type="hidden" name="is_active" value={draft.is_active} />

<!-- actions -->
<div class="flex items-center justify-end gap-2 pt-1">
	<button
		type="button"
		onclick={oncancel}
		class="rounded-full border border-gray-200 px-4 py-2 text-sm
           text-brand-gray italic hover:bg-gray-100"
	>
		Cancel
	</button>
	<button
		type="submit"
		disabled={isSubmitting}
		class="rounded-full bg-brand-yellow px-5 py-2 text-sm text-white
           italic shadow-sm transition hover:bg-yellow-400 disabled:opacity-50"
	>
		{isSubmitting
			? 'Saving...'
			: action === 'create'
				? 'Create Slot'
				: 'Save Changes'}
	</button>
</div>
