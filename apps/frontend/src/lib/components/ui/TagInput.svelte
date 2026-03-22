<script>
	import { registration } from '$lib/stores/registration.svelte.js';

	let {
		name = '',
		tags = $bindable(),
		tagInput = $bindable(''),
		suggestions = []
	} = $props();

	function removeTag(tag) {
		tags = tags.filter((c) => c !== tag);
		registration[name] = tags.join(', ');
	}
	function addTag(tag) {
		const clean = tag.trim();
		if (!clean || tags.includes(clean)) return;
		tags = [...tags, clean];
		tagInput = '';
		registration[name] = tags.join(', ');
	}
	function handleTagKeydown(e) {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			addTag(tagInput);
		}
		if (e.key === 'Backspace' && !tagInput && tags.length) {
			removeTag(tags.at(-1));
		}
	}
</script>

<div>
	<div
		class="flex min-h-13 w-full flex-wrap items-center gap-1.5 rounded-lg
               border border-[#E8E8E8] bg-[#F6F6F6] px-3 py-2 transition-colors
               duration-200 focus-within:border-brand-yellow focus-within:bg-white"
	>
		{#each tags as tag}
			<span
				class="flex items-center gap-1 rounded-full bg-brand-yellow px-2.5
                   py-0.5 text-xs text-white italic"
			>
				{tag}
				<button
					type="button"
					class="ml-0.5 opacity-70 hover:opacity-100"
					onclick={() => removeTag(tag)}
					aria-label="Remove {tag}"
				>
					<svg width="8" height="8" viewBox="0 0 8 8" fill="none">
						<path
							d="M1 1L7 7M7 1L1 7"
							stroke="white"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
				</button>
			</span>
		{/each}

		<!-- input -->
		<input
			class="min-w-25 flex-1 bg-transparent font-abeezee text-base
                 text-brand-dark italic outline-none placeholder:text-brand-gray"
			placeholder={tags.length ? 'Add more...' : 'Cuisine type (optional)'}
			bind:value={tagInput}
			onkeydown={handleTagKeydown}
		/>
	</div>

	{#if suggestions.filter((s) => !tags.includes(s)).length}
		<div class="mt-1.5 flex flex-wrap gap-1.5 px-1">
			{#each suggestions.filter((s) => !tags.includes(s)) as suggestion}
				<button
					type="button"
					class="rounded-full border border-brand-gray px-2.5 py-0.5
                     text-xs text-brand-gray italic transition-colors
                     hover:border-brand-yellow hover:text-brand-yellow"
					onclick={() => addTag(suggestion)}
				>
					+ {suggestion}
				</button>
			{/each}
		</div>
	{/if}
</div>
