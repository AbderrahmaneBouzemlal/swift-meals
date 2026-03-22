<!-- +page.svelte -->
<script>
	import { enhance } from '$app/forms';
	import Header from '$lib/components/Header.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import PrimaryButton from '$lib/components/ui/PrimaryButton.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { ROUTES } from '$lib/utils/routes.js';

	let { data, form } = $props();

	const user = $derived(data.user);
	const isBusiness = $derived(user?.role?.toLowerCase() === 'business');

	const currentUrl = $derived(
		isBusiness
			? (user?.business_profile?.logo_url ?? null)
			: (user?.customer_profile?.profile_picture_url ?? null)
	);

	const errors = $derived(form?.errors ?? {});

	// local preview before submitting
	let previewUrl = $derived(currentUrl);
	let selectedFile = $state(null);
	let fileInput = $state(null);
	let isDragging = $state(false);
	let isUploading = $state(false);
	let isRemoving = $state(false);

	function handleFileSelect(file) {
		if (!file) return;
		selectedFile = file;
		previewUrl = URL.createObjectURL(file);
	}

	function onInputChange(e) {
		handleFileSelect(e.target.files[0]);
	}

	function onDrop(e) {
		e.preventDefault();
		isDragging = false;
		handleFileSelect(e.dataTransfer.files[0]);
	}

	function clearSelection() {
		selectedFile = null;
		previewUrl = currentUrl;
		if (fileInput) fileInput.value = '';
	}

	// inject selected file before form submits
	function injectFile() {
		if (!selectedFile || !fileInput) return;
		const dt = new DataTransfer();
		dt.items.add(selectedFile);
		fileInput.files = dt.files;
	}
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden
         bg-white font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:rounded-phone"
>
	<Header backUrl={ROUTES.account} />

	<div class="shrink-0 px-8 pt-1.5 pb-4">
		<Title size="medium">
			{isBusiness ? 'Restaurant Logo' : 'Profile Photo'}
		</Title>
		<p class="mt-1 text-[12px] text-brand-gray italic">
			JPG, PNG or WebP — max 5MB
		</p>
	</div>

	<div class="flex flex-1 flex-col gap-6 overflow-y-auto px-8 pb-8">
		<!-- ── current / preview ──────────────────────────────── -->
		<div class="flex flex-col items-center gap-3">
			<div
				class="relative flex h-32 w-32 items-center justify-center
               overflow-hidden rounded-full bg-gray-100 shadow-md"
			>
				{#if previewUrl}
					<img
						src={previewUrl}
						alt="preview"
						class="h-full w-full object-cover"
					/>
				{:else}
					<Icon name="profile" width="48" height="56" />
				{/if}

				<!-- overlay on hover -->
				<button
					type="button"
					onclick={() => fileInput?.click()}
					class="absolute inset-0 flex flex-col items-center justify-center
                 gap-1 rounded-full bg-black/40 opacity-0 transition-opacity
                 hover:opacity-100"
				>
					<Icon name="camera" width="20" height="20" color="white" />
					<span class="text-[10px] text-white italic">Change</span>
				</button>
			</div>

			{#if selectedFile}
				<div
					class="flex items-center gap-2 rounded-full bg-green-50
                    px-3 py-1 text-[11px] text-green-600 italic"
				>
					<Icon name="check" width="10" height="10" color="#16a34a" />
					{selectedFile.name}
					<button
						type="button"
						onclick={clearSelection}
						class="text-green-400 hover:text-green-600">✕</button
					>
				</div>
			{/if}
		</div>

		<!-- ── drop zone ──────────────────────────────────────── -->
		<button
			type="button"
			onclick={() => fileInput?.click()}
			ondragover={(e) => {
				e.preventDefault();
				isDragging = true;
			}}
			ondragleave={() => (isDragging = false)}
			ondrop={onDrop}
			class="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed
             px-6 py-8 transition-colors
             {isDragging
				? 'border-brand-yellow bg-brand-yellow/5'
				: 'border-gray-200 bg-gray-50 hover:border-brand-yellow hover:bg-brand-yellow/5'}"
		>
			<Icon name="upload" width="28" height="28" color="#BDBDBD" />
			<p class="text-[13px] text-brand-gray italic">
				Drag & drop or <span class="text-brand-yellow">browse</span>
			</p>
			<p class="text-[11px] text-brand-gray italic">JPG, PNG, WebP up to 5MB</p>
		</button>

		{#if errors.picture}
			<p class="text-xs text-red-500 italic">{errors.picture}</p>
		{/if}

		{#if errors.server}
			<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
				<p class="text-xs text-red-500 italic">{errors.server}</p>
			</div>
		{/if}

		<!-- ── upload form ────────────────────────────────────── -->
		<form
			method="POST"
			action="?/upload"
			enctype="multipart/form-data"
			use:enhance={() => {
				injectFile();
				isUploading = true;
				return ({ update }) => {
					isUploading = false;
					update();
				};
			}}
		>
			<input
				type="file"
				name="picture"
				accept="image/jpeg,image/png,image/webp"
				bind:this={fileInput}
				onchange={onInputChange}
				class="hidden"
			/>

			<PrimaryButton
				type="submit"
				text={isUploading ? 'Uploading...' : 'Save Photo'}
				loading={isUploading}
				disabled={!selectedFile || isUploading}
			/>
		</form>

		<!-- ── remove form (only if photo exists) ─────────────── -->
		{#if currentUrl}
			<form
				method="POST"
				action="?/remove"
				use:enhance={() => {
					isRemoving = true;
					return ({ update }) => {
						isRemoving = false;
						update();
					};
				}}
			>
				<button
					type="submit"
					disabled={isRemoving}
					class="w-full rounded-full border border-red-200 py-3 text-sm
                 text-red-400 italic transition-colors hover:border-red-400
                 hover:bg-red-50 disabled:opacity-50"
				>
					{isRemoving ? 'Removing...' : 'Remove photo'}
				</button>
			</form>
		{/if}
	</div>
</div>
