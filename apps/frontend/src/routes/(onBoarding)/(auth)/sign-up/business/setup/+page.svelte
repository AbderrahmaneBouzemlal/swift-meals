<script>
	import Header from '$lib/components/Header.svelte';
	import ChatButton from '$lib/components/ui/ChatButton.svelte';
	import PrimaryButton from '$lib/components/ui/PrimaryButton.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { goto } from '$app/navigation';
	import { registration } from '$lib/stores/registration.svelte.js';
	import { BUSINESS_SIGNUP_STEPS } from '$lib/utils/constants';
	import StepTracker from '$lib/components/StepTracker.svelte';
	import { validate } from '$lib/utils/validate';
	import { businessSetupSchema } from '$lib/utils/schemas';
	import { useFormValidation } from '$lib/utils/useFormValidation.svelte';

	let errors = $state({});

	let pickupTags = $state(
		registration.pickup_locations
			? registration.pickup_locations.split(',').map((p) => p.trim())
			: []
	);
	let pickupInput = $state('');

	const form = useFormValidation(businessSetupSchema, () => ({
		description: registration.description,
		pickup_locations: registration.pickup_locations,
		logo: registration.logo
	}));

	const pickupSuggestions = [
		'Hostel A Lobby',
		'Hostel B Lobby',
		'Library Entrance',
		'Main Cafeteria',
		'Sports Complex',
		'Faculty of Engineering',
		'Admin Block'
	];

	function addPickup(tag) {
		const clean = tag.trim();
		if (!clean || pickupTags.includes(clean)) return;
		pickupTags = [...pickupTags, clean];
		pickupInput = '';
		sync();
	}

	function removePickup(tag) {
		pickupTags = pickupTags.filter((p) => p !== tag);
		sync();
	}

	function handlePickupKeydown(e) {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			addPickup(pickupInput);
		}
		if (e.key === 'Backspace' && !pickupInput && pickupTags.length) {
			removePickup(pickupTags.at(-1));
		}
	}

	function sync() {
		registration.pickup_locations = pickupTags.join(', ');
	}

	// ── Logo upload ───────────────────────────────────────────────
	let previewUrl = $state(null);
	let isDragging = $state(false);
	let fileInput;

	function handleFileSelect(file) {
		if (!file || !file.type.startsWith('image/')) return;
		registration.logo = file;
		previewUrl = URL.createObjectURL(file);
	}

	function handleInputChange(e) {
		handleFileSelect(e.target.files?.[0]);
	}

	function handleDrop(e) {
		e.preventDefault();
		isDragging = false;
		handleFileSelect(e.dataTransfer.files?.[0]);
	}

	function removeLogo() {
		registration.logo = null;
		previewUrl = null;
		if (fileInput) fileInput.value = '';
	}

	function handleSubmit() {
		if (!form.submitValidate(['Description', 'Pickup locations', 'Logo']))
			return;

		goto('/sign-up/review');
	}
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden
         bg-white font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:rounded-phone"
>
	<Header backUrl="/sign-up/business/details" />

	<!-- Title -->
	<div class="shrink-0 px-8 pt-1.5 pb-3">
		<Title size="medium">Restaurant Setup</Title>
		<span
			class="mt-1 inline-block rounded-full bg-brand-dark px-3 py-0.5
                 text-xs text-white italic"
		>
			Business
		</span>
	</div>

	<!-- Step indicator -->
	<StepTracker steps={BUSINESS_SIGNUP_STEPS} currentStep={2} />

	<!-- Form -->
	<div class="flex shrink-0 flex-col gap-4 px-8">
		<!-- Logo upload -->
		<div>
			<p class="mb-1.5 text-sm text-brand-dark italic">Restaurant Logo</p>

			{#if previewUrl}
				<!-- Preview -->
				<div class="relative w-full">
					<div
						class="flex items-center gap-4 rounded-lg border border-brand-yellow
                      bg-[#FFFBEF] p-3"
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
					</div>
				</div>
			{:else}
				<!-- Drop zone -->
				<button
					type="button"
					class="flex w-full flex-col items-center justify-center gap-2 rounded-lg
                 border-2 border-dashed py-7 transition-colors duration-200
                 {isDragging
						? 'border-brand-yellow bg-[#FFFBEF]'
						: 'border-[#E8E8E8] bg-[#F6F6F6] hover:border-brand-yellow hover:bg-[#FFFBEF]'}"
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
					<p class="text-sm text-brand-gray italic">
						Tap to upload or drag & drop
					</p>
					<p class="text-xs text-brand-gray italic opacity-60">
						PNG, JPG up to 5MB
					</p>
				</button>
			{/if}

			<!-- hidden file input -->
			<input
				bind:this={fileInput}
				type="file"
				accept="image/*"
				class="hidden"
				onchange={handleInputChange}
			/>
		</div>

		<!-- Description -->
		<div>
			<p class="mb-1.5 text-sm text-brand-dark italic">Description</p>
			<div class="relative">
				<textarea
					bind:value={registration.description}
					placeholder="Tell customers about your restaurant, specialties, opening hours..."
					rows="4"
					maxlength="500"
					class="w-full resize-none rounded-lg border border-[#E8E8E8] bg-[#F6F6F6]
                 px-4 py-3 font-abeezee text-base text-brand-dark italic transition-colors
                 duration-200 outline-none placeholder:text-brand-gray
                 focus:border-brand-yellow focus:bg-white"
				></textarea>
				<p class="mt-0.5 px-1 text-right text-[11px] text-brand-gray italic">
					{registration.description?.length ?? 0}/500
				</p>
			</div>
		</div>

		<!-- Pickup locations -->
		<div>
			<p class="mb-1.5 text-sm text-brand-dark italic">Pickup Locations</p>

			<!-- tag input -->
			<div
				class="flex min-h-13 w-full flex-wrap items-center gap-1.5 rounded-lg
               border border-[#E8E8E8] bg-[#F6F6F6] px-3 py-2 transition-colors
               duration-200 focus-within:border-brand-yellow focus-within:bg-white"
			>
				{#each pickupTags as tag}
					<span
						class="flex items-center gap-1 rounded-full bg-brand-dark
                       px-2.5 py-0.5 text-xs text-white italic"
					>
						{tag}
						<button
							type="button"
							class="ml-0.5 opacity-70 hover:opacity-100"
							onclick={() => removePickup(tag)}
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

				<input
					class="min-w-30 flex-1 bg-transparent font-abeezee text-base
                 text-brand-dark italic outline-none placeholder:text-brand-gray"
					placeholder={pickupTags.length
						? 'Add location...'
						: 'Type and press Enter'}
					bind:value={pickupInput}
					onkeydown={handlePickupKeydown}
				/>
			</div>

			<!-- suggestions -->
			{#if pickupSuggestions.filter((s) => !pickupTags.includes(s)).length}
				<div class="mt-2 flex flex-wrap gap-1.5 px-1">
					{#each pickupSuggestions.filter((s) => !pickupTags.includes(s)) as suggestion}
						<button
							type="button"
							class="rounded-full border border-brand-gray px-2.5 py-0.5
                     text-xs text-brand-gray italic transition-colors
                     hover:border-brand-yellow hover:text-brand-yellow"
							onclick={() => addPickup(suggestion)}
						>
							+ {suggestion}
						</button>
					{/each}
				</div>
			{/if}

			<p class="mt-1 px-1 text-[11px] text-brand-gray italic">
				Where customers can collect their orders
			</p>
		</div>
	</div>

	<!-- CTAs -->
	<div class="shrink-0 px-8 pt-6">
		<PrimaryButton text="Continue" onclick={handleSubmit} />
	</div>

	<div class="shrink-0 px-8 pt-2 text-center">
		<button
			class="text-sm text-brand-gray italic underline-offset-2 hover:underline"
			onclick={() => goto('/sign-up/review')}
		>
			Skip for now
		</button>
	</div>

	<div class="flex flex-1 items-end">
		<ChatButton />
	</div>
</div>
