<script>
	import LogoPreview from '$lib/components/LogoPreview.svelte';
	import DropZone from '$lib/components/DropZone.svelte';

	let {
		draft = $bindable(),
		errors = {},
		action = 'create',
		oncancel,
		isSubmitting = false,
		currentImageUrl = null
	} = $props();

	let fileInput = $state(null);
	let previewUrl = $state(null);

	$effect(() => {
		const file = draft.image;

		if (file instanceof File) {
			const objectUrl = URL.createObjectURL(file);
			previewUrl = objectUrl;

			return () => URL.revokeObjectURL(objectUrl);
		}

		previewUrl = currentImageUrl;
	});

	function handleFileSelect(file) {
		if (!file || !file.type.startsWith('image/')) return;
		draft.image = file;
	}

	function handleFileInputChange(event) {
		handleFileSelect(event.currentTarget.files?.[0]);
	}

	function clearImage() {
		draft.image = null;
		if (fileInput) fileInput.value = '';
	}
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
		<label class="text-xs text-brand-gray italic" for="item-price">
			Price (RM) *
		</label>
		<input
			id="item-price"
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
<div class="flex flex-col gap-2">
	<div class="flex items-end justify-between gap-3">
		<div>
			<p class="text-xs text-brand-gray italic">Item image</p>
			<p class="text-[11px] text-brand-gray/70 italic">
				Add or replace the cover image for the menu item.
			</p>
		</div>
		{#if draft.image instanceof File}
			<button
				type="button"
				onclick={clearImage}
				class="text-xs text-red-500 italic hover:underline"
			>
				Clear selected image
			</button>
		{/if}
	</div>

	{#if previewUrl}
		<LogoPreview {previewUrl} Deleteable={false} />
	{/if}

	<DropZone {handleFileSelect} {fileInput} />

	<input
		bind:this={fileInput}
		type="file"
		name="image"
		accept="image/*"
		class="hidden"
		onchange={handleFileInputChange}
	/>

	{#if errors.image}
		<p class="text-[10px] text-red-500 italic">{errors.image}</p>
	{/if}
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
