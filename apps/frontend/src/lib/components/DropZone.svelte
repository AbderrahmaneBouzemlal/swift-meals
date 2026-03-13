<script>
	let { handleFileSelect, fileInput = $bindable() } = $props();
	let isDragging = $state(false);

	function handleDrop(e) {
		e.preventDefault();
		isDragging = false;
		handleFileSelect(e.dataTransfer.files?.[0]);
	}
</script>

<button
	type="button"
	class="flex w-full flex-col items-center justify-center gap-2 rounded-lg
                 border-2 border-dashed py-7 transition-colors duration-200
                 {isDragging
		? 'border-brand-yellow bg-brand-yellow-lighter'
		: 'border-[#E8E8E8] bg-[#F6F6F6] hover:border-brand-yellow hover:bg-brand-yellow-lighter'}"
	onclick={() => fileInput?.click()}
	ondragover={(e) => {
		e.preventDefault();
		isDragging = true;
	}}
	ondragleave={() => (isDragging = false)}
	ondrop={handleDrop}
>
	<div
		class="flex h-10 w-10 items-center justify-center rounded-full
                      bg-white shadow-sm"
	>
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<path
				d="M10 13V4M10 4L7 7M10 4L13 7"
				stroke="#BDBDBD"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M3 14V16C3 16.6 3.4 17 4 17H16C16.6 17 17 16.6 17 16V14"
				stroke="#BDBDBD"
				stroke-width="1.5"
				stroke-linecap="round"
			/>
		</svg>
	</div>
	<p class="text-sm text-brand-gray italic">Tap to upload or drag & drop</p>
	<p class="text-xs text-brand-gray italic opacity-60">PNG, JPG up to 5MB</p>
</button>
