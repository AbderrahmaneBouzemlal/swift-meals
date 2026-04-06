<script>
	let {
		draft = $bindable(),
		errors = {},
		action = 'create',
		oncancel,
		isSubmitting = false
	} = $props();
</script>

<input type="hidden" name="id" value={draft.id} />

<input
	name="name"
	placeholder="Item name *"
	bind:value={draft.name}
	class="h-10 w-full rounded-lg border bg-white px-3 font-abeezee
         text-sm text-brand-dark italic outline-none focus:border-brand-yellow
         {errors.name
		? 'border-red-400 ring-1 ring-red-400'
		: 'border-gray-200'}"
/>
{#if errors.name}
	<p class="text-[10px] text-red-500 italic">{errors.name}</p>
{/if}

<textarea
	name="description"
	placeholder="Short description"
	bind:value={draft.description}
	class="min-h-16 w-full rounded-lg border border-gray-200 bg-white p-3
         font-abeezee text-sm text-brand-dark italic outline-none
         focus:border-brand-yellow"
></textarea>

<!-- price + availability row -->
<div class="flex gap-3">
	<div class="flex flex-1 flex-col gap-1">
		<label class="text-xs text-brand-gray italic">Price (RM) *</label>
		<input
			name="price"
			type="number"
			step="0.01"
			min="0"
			placeholder="0.00"
			bind:value={draft.price}
			class="h-10 w-full rounded-lg border bg-white px-3 font-abeezee
             text-sm text-brand-dark italic outline-none focus:border-brand-yellow
             {errors.price
				? 'border-red-400 ring-1 ring-red-400'
				: 'border-gray-200'}"
		/>
		{#if errors.price}
			<p class="text-[10px] text-red-500 italic">{errors.price}</p>
		{/if}
	</div>

	<div class="flex items-end gap-2 pb-1">
		<button
			type="button"
			onclick={() => (draft.is_available = !draft.is_available)}
			class="flex h-6 w-10 items-center rounded-full transition-colors
             {draft.is_available ? 'bg-brand-yellow' : 'bg-gray-200'}"
			aria-pressed={draft.is_available}
			aria-label="Toggle availability"
		>
			<span
				class="h-4 w-4 rounded-full bg-white shadow transition-transform
               {draft.is_available ? 'translate-x-5' : 'translate-x-1'}"
			></span>
		</button>
		<span class="text-xs text-brand-gray italic">Available</span>
		<input type="hidden" name="is_available" value={draft.is_available} />
	</div>
</div>

<!-- image upload -->
<div class="flex flex-col gap-1">
	<label class="text-xs text-brand-gray italic" for="item-image">
		Item image
	</label>
	<input
		id="item-image"
		type="file"
		name="image"
		accept="image/*"
		class="text-xs text-brand-gray italic file:mr-3 file:rounded-full
           file:border-0 file:bg-brand-yellow/10 file:px-3 file:py-1
           file:text-xs file:text-brand-yellow file:italic"
	/>
</div>

<!-- actions -->
<div class="flex justify-end gap-2 pt-2">
	<button
		type="button"
		onclick={oncancel}
		class="rounded-full border border-gray-200 px-4 py-1.5 text-xs
           text-brand-gray italic hover:bg-gray-100"
	>
		Cancel
	</button>
	<button
		type="submit"
		disabled={isSubmitting}
		class="rounded-full bg-brand-yellow px-4 py-1.5 text-xs text-white
           italic shadow-sm disabled:opacity-50"
	>
		{isSubmitting
			? 'Saving...'
			: action === 'create'
				? 'Add Item'
				: 'Save Item'}
	</button>
</div>
