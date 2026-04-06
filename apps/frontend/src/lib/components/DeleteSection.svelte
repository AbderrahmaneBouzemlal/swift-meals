<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import Icon from '$lib/components/ui/Icon.svelte';
	let { id, name, onclose = null } = $props();
	let isDeleting = $state(false);
	let confirmDelete = $state(false);
</script>

<div class="border-t border-gray-100 px-4 pb-4">
	{#if confirmDelete}
		<div
			transition:slide={{ duration: 150 }}
			class="flex items-center gap-2 rounded-lg border border-red-200
                 bg-red-50 px-3 py-2"
		>
			<p class="flex-1 text-xs text-red-600 italic">
				Delete "{name}"? This cannot be undone.
			</p>
			<form
				method="POST"
				action="?/delete"
				use:enhance={() => {
					isDeleting = true;
					return async ({ result }) => {
						isDeleting = false;
						if (result.type === 'success') {
							onclose?.();
							await invalidateAll();
						}
					};
				}}
			>
				<input type="hidden" name="id" value={id} />
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
		<div class="flex justify-between">
			<button
				type="button"
				onclick={() => (confirmDelete = true)}
				class="mt-1 text-xs text-brand-gray italic
                 hover:text-red-400 hover:underline"
			>
				Delete this {name.toLowerCase()}
			</button>
			<button
				type="button"
				onclick={onclose}
				class="rounded-full border border-gray-200 px-3 py-1 text-xs
                   text-brand-gray italic hover:bg-gray-100"
			>
				Cancel
			</button>
		</div>
	{/if}
</div>
