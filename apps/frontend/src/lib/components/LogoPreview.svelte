<script>
	import { goto } from '$app/navigation';
	import { businessDetailsSchema } from '$lib/utils/schemas';
	import { useFormValidation } from '$lib/utils/useFormValidation.svelte';
	import { registration } from '../stores/registration.svelte.js';

	let { previewUrl, Deleteable = true, fileInput = null } = $props();

	function removeLogo() {
		registration.logo = null;
		if (fileInput) fileInput.value = '';
	}
</script>

<div class="relative w-full">
	<div
		class="flex items-center gap-4 rounded-lg border border-brand-yellow
                      bg-brand-yellow-lighter p-3"
	>
		<img
			src={previewUrl}
			alt="Logo preview"
			class="h-16 w-16 rounded-lg object-cover shadow-sm"
		/>
		<div class="flex-1 overflow-hidden">
			<p class="truncate text-sm text-brand-dark italic">
				{registration.logo?.name}
			</p>
			<p class="text-xs text-brand-gray italic">
				{(registration.logo?.size / 1024).toFixed(0)} KB
			</p>
		</div>
		{#if Deleteable}
			<button
				type="button"
				onclick={removeLogo}
				class="flex h-7 w-7 shrink-0 items-center justify-center
                     rounded-full bg-white shadow-sm transition-opacity hover:opacity-70"
				aria-label="Remove logo"
			>
				<svg width="10" height="10" viewBox="0 0 10 10" fill="none">
					<path
						d="M1 1L9 9M9 1L1 9"
						stroke="#595454"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		{/if}
	</div>
</div>
