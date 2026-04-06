<script>
	import { slide } from 'svelte/transition';
	let {
		newDraft = $bindable(),
		errors = {},
		isSubmitting,
		closeNew = null
	} = $props();
</script>

<div class="flex flex-col gap-1">
	<label class="text-sm text-brand-gray italic" for="menu-name">Menu name</label
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
	{#if errors?.server}
		<p class="mt-2 text-sm text-red-600">{errors.server}</p>
	{/if}
</div>
