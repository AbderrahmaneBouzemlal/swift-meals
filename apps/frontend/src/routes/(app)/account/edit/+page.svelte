<script>
	import { registration } from '$lib/stores/registration.svelte.js';
	import { enhance } from '$app/forms';
	import Header from '$lib/components/Header.svelte';
	import InputField from '$lib/components/ui/InputField.svelte';
	import PrimaryButton from '$lib/components/ui/PrimaryButton.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import TagInput from '$lib/components/ui/TagInput.svelte';
	import { ROUTES } from '$lib/utils/routes.js';

	let { data, form } = $props();

	const user = data.user;
	const isBusiness = user?.role?.toLowerCase() === 'business';
	const customerProfile = user?.customer_profile ?? {};
	const businessProfile = user?.business_profile ?? {};

	Object.assign(registration, isBusiness ? businessProfile : customerProfile);

	let cuisineInput = $state('');
	let pickupInput = $state('');

	let cuisineTags = $derived(
		registration.cuisine_type
			? registration.cuisine_type.split(',').map((c) => c.trim())
			: []
	);
	let pickupTags = $derived(
		registration.pickup_locations
			? registration.pickup_locations.split(',').map((p) => p.trim())
			: []
	);

	const errors = $derived(form?.errors ?? {});
	let isSubmitting = $state(false);

	const genderOptions = ['Male', 'Female'];

	const cuisineSuggestions = [
		'Malay',
		'Chinese',
		'Indian',
		'Western',
		'Japanese',
		'Korean',
		'Thai',
		'Fast Food'
	];

	const pickupSuggestions = [
		'Hostel A',
		'Hostel B',
		'Library',
		'Student Centre',
		'Main Gate'
	];
</script>

<div class="flex h-full flex-col bg-white">
	<Header backUrl={ROUTES.account} />

	<div class="shrink-0 px-8 pt-1.5 pb-4">
		<Title size="medium">Edit Profile</Title>
		<span
			class="mt-1 inline-block rounded-full px-3 py-0.5 text-xs text-white italic
             {isBusiness ? 'bg-brand-dark' : 'bg-brand-yellow'}"
		>
			{isBusiness ? 'Business Account' : 'Customer Account'}
		</span>
	</div>

	<form
		method="POST"
		use:enhance={() => {
			isSubmitting = true;
			return ({ update }) => {
				isSubmitting = false;
				update();
			};
		}}
		class="flex flex-1 flex-col overflow-y-auto px-8 pb-4"
	>
		{#if isBusiness}
			<div class="flex flex-col gap-2.5">
				<p class="text-sm text-brand-gray italic">Restaurant name *</p>
				<InputField
					name="restaurant_name"
					placeholder="Restaurant name"
					bind:value={registration.restaurant_name}
					error={errors.restaurant_name}
				/>

				<p class="text-sm text-brand-gray italic">Location *</p>
				<InputField
					name="location"
					placeholder="e.g. Block C, Ground Floor"
					bind:value={registration.location}
					error={errors.location}
				/>

				<p class="text-sm text-brand-gray italic">Phone number</p>
				<InputField
					name="phone_number"
					type="tel"
					placeholder="e.g. 0123456789"
					bind:value={registration.phone_number}
					error={errors.phone_number}
				/>

				<p class="text-sm text-brand-gray italic">Cuisine type</p>
				<TagInput
					name="cuisine_type"
					bind:tags={cuisineTags}
					bind:tagInput={cuisineInput}
					suggestions={cuisineSuggestions}
				/>
				<input
					type="hidden"
					name="cuisine_type"
					value={registration.cuisine_type}
				/>

				<p class="text-sm text-brand-gray italic">SSM registration</p>
				<InputField
					name="ssm_registration"
					placeholder="SSM number (optional)"
					bind:value={registration.ssm_registration}
					error={errors.ssm_registration}
				/>

				<p class="text-sm text-brand-gray italic">Description</p>
				<div class="relative">
					<textarea
						name="description"
						placeholder="Tell customers about your restaurant..."
						maxlength="500"
						bind:value={registration.description}
						class="box-border h-24 w-full resize-none rounded-lg border
                   border-brand-gray-light bg-gray-50 px-4 py-3 font-abeezee
                   text-[16px] text-brand-dark italic outline-none
                   placeholder:text-brand-gray focus:border-brand-yellow
                   focus:bg-white"
					></textarea>
					<span
						class="absolute right-3 bottom-2 text-[10px] text-brand-gray italic"
					>
						{registration.description.length}/500
					</span>
				</div>

				<p class="text-sm text-brand-gray italic">Pickup locations</p>
				<TagInput
					name="pickup_locations"
					tags={pickupTags}
					bind:tagInput={pickupInput}
					suggestions={pickupSuggestions}
				/>
				<input
					type="hidden"
					name="pickup_locations"
					value={registration.pickup_locations}
				/>
			</div>
		{:else}
			<div class="flex flex-col gap-2.5">
				<p class="text-sm text-brand-gray italic">Phone number</p>
				<InputField
					name="phone_number"
					type="tel"
					placeholder="e.g. 0123456789"
					bind:value={registration.phone_number}
					error={errors.phone_number}
				/>

				<p class="text-sm text-brand-gray italic">Gender</p>
				<div class="relative">
					<select
						name="gender"
						bind:value={registration.gender}
						class="box-border h-13 w-full appearance-none rounded-lg border
                   border-brand-gray-light bg-gray-50 px-4 font-abeezee
                   text-[16px] text-brand-dark italic outline-none
                   focus:border-brand-yellow focus:bg-white"
					>
						<option value="">Select gender</option>
						{#each genderOptions as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
					<div
						class="pointer-events-none absolute top-1/2 right-3.5
                      -translate-y-1/2"
					>
						<svg width="10" height="6" viewBox="0 0 10 6" fill="none">
							<path
								d="M1 1L5 5L9 1"
								stroke="#BDBDBD"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				</div>

				<p class="text-sm text-brand-gray italic">Default pickup location</p>
				<InputField
					name="default_pickup_location"
					placeholder="e.g. Hostel A lobby"
					bind:value={registration.default_pickup_location}
					error={errors.default_pickup_location}
				/>
			</div>
		{/if}

		{#if errors.server}
			<div class="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
				<p class="text-xs text-red-500 italic">{errors.server}</p>
			</div>
		{/if}

		<div class="mt-6">
			<PrimaryButton
				type="submit"
				text={isSubmitting ? 'Saving...' : 'Save Changes'}
				loading={isSubmitting}
			/>
		</div>
	</form>
</div>
