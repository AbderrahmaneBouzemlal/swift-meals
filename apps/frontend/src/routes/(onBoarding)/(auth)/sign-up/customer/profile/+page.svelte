<script>
	import InputField from '$lib/components/ui/InputField.svelte';
	import PrimaryButton from '$lib/components/ui/PrimaryButton.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { goto } from '$app/navigation';
	import { registration } from '$lib/stores/registration.svelte.js';
	import { CUSTOMER_SIGNUP_STEPS, GENDER_OPTIONS } from '$lib/utils/constants';
	import StepTracker from '$lib/components/StepTracker.svelte';
	import { customerProfileSchema } from '$lib/utils/schemas';
	import { useFormValidation } from '$lib/utils/useFormValidation.svelte.js';
	import { ROUTES } from '$lib/utils/routes.js';
	import { toastStore } from '$lib/stores/toasts.svelte.js';
	import LogoPreview from '$lib/components/LogoPreview.svelte';
	import DropZone from '$lib/components/DropZone.svelte';
	import SelectField from '$lib/components/ui/SelectField.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		if (registration.role !== 'customer') {
			toastStore.error('Please start sign-up and choose your role first.');
			goto(ROUTES.signUp.chooseRole);
		}
	});

	const form = useFormValidation(customerProfileSchema, () => ({
		phone_number: registration.phone_number,
		gender: registration.gender,
		default_pickup_location: registration.default_pickup_location
	}));

	let fileInput = $state(null);

	let previewUrl = $derived(
		registration.profile_picture
			? URL.createObjectURL(registration.profile_picture)
			: null
	);

	function handleFileSelect(file) {
		if (!file || !file.type.startsWith('image/')) return;
		registration.profile_picture = file;
	}

	function handleInputChange(e) {
		handleFileSelect(e.target.files?.[0]);
	}

	function handleSubmit() {
		if (
			!form.submitValidate([
				'phone_number',
				'gender',
				'default_pickup_location'
			])
		)
			return;

		goto(ROUTES.signUp.review);
	}
</script>

<div class="flex h-full flex-col bg-white">
	<div class="shrink-0 px-8 pt-6 pb-3">
		<Title size="medium">Your Profile</Title>
		<span
			class="mt-1 inline-block rounded-full bg-brand-yellow px-3 py-0.5 text-xs text-white italic"
		>
			Customer
		</span>
	</div>

	<StepTracker steps={CUSTOMER_SIGNUP_STEPS} currentStep={1} />

	<div class="flex shrink-0 flex-col gap-2.5 px-8">
		<!-- Profile picture -->
		<div>
			<p class="mb-1.5 text-sm text-brand-dark italic">Profile Picture</p>

			{#if registration.profile_picture}
				<LogoPreview {previewUrl} {fileInput} />
			{:else}
				<DropZone {handleFileSelect} {fileInput} />
			{/if}
			{#if form.errors.profile_picture}
				<p class="mt-1 text-xs text-red-500 italic">
					{form.errors.profile_picture}
				</p>
			{/if}

			<input
				bind:this={fileInput}
				type="file"
				accept="image/*"
				class="hidden"
				onchange={handleInputChange}
			/>
		</div>
		<!-- Phone -->
		<InputField
			type="tel"
			placeholder="Phone number (optional)"
			bind:value={registration.phone_number}
			error={form.errors.phone_number}
			onblur={() => form.touch('phone_number')}
		/>

		<!-- Gender -->
		<div class="relative w-full">
			<SelectField
				bind:value={registration.gender}
				options={GENDER_OPTIONS}
				placeholder="Gender (optional)"
				error={form.errors.gender}
			/>

			<div
				class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
			>
				<svg width="12" height="8" viewBox="0 0 12 8" fill="none">
					<path
						d="M1 1L6 6L11 1"
						stroke="#BDBDBD"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
		</div>

		<!-- Pickup location -->
		<div class="relative w-full">
			<InputField
				placeholder="Default pickup location (optional)"
				bind:value={registration.default_pickup_location}
				error={form.errors.default_pickup_location}
				onblur={() => form.touch('default_pickup_location')}
			/>
			<!-- helper -->
			<p class="mt-1 px-1 text-[11px] text-brand-gray italic">
				e.g. Hostel A Lobby, Library Entrance
			</p>
		</div>
	</div>

	<!-- CTA -->
	<div class="shrink-0 px-8 pt-6">
		<PrimaryButton text="Continue" onclick={handleSubmit} />
	</div>
</div>
