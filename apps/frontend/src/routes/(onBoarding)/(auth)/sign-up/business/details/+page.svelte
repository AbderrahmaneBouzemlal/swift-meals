<script>
	import { BUSINESS_TYPE } from '$lib/utils/constants.js';
	import InputField from '$lib/components/ui/InputField.svelte';
	import PrimaryButton from '$lib/components/ui/PrimaryButton.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { goto } from '$app/navigation';
	import { registration } from '$lib/stores/registration.svelte.js';
	import { BUSINESS_SIGNUP_STEPS } from '$lib/utils/constants';
	import StepTracker from '$lib/components/StepTracker.svelte';
	import { businessDetailsSchema } from '$lib/utils/schemas';
	import { useFormValidation } from '$lib/utils/useFormValidation.svelte';
	import { ROUTES } from '$lib/utils/routes.js';
	import { toastStore } from '$lib/stores/toasts.svelte.js';
	import { onMount } from 'svelte';
	import SelectField from '$lib/components/ui/SelectField.svelte';
	import TagInput from '$lib/components/ui/TagInput.svelte';

	onMount(() => {
		if (registration.role !== 'business') {
			toastStore.error('Please start sign-up and choose your role first.');
			goto(ROUTES.signUp.chooseRole);
		}
	});

	//TODO:
	// cuisine_type is a comma-separated string in Django
	// update the backend to store it as an array and return as an array to avoid this hacky splitting/joining

	let cuisineTags = $state(
		registration.cuisine_type
			? registration.cuisine_type.split(',').map((c) => c.trim())
			: []
	);
	let cuisineInput = $state('');

	const form = useFormValidation(businessDetailsSchema, () => ({
		restaurant_name: registration.restaurant_name,
		location: registration.location,
		phone_number: registration.phone_number,
		cuisine_type: cuisineTags.join(', '),
		ssm_registration: registration.ssm_registration,
		business_type: registration.business_type
	}));

	const cuisineSuggestions = [
		'Malay',
		'Chinese',
		'Indian',
		'Western',
		'Japanese',
		'Korean',
		'Thai',
		'Vegetarian',
		'Fast Food'
	];

	function handleSubmit() {
		if (
			!form.submitValidate([
				'restaurant_name',
				'location',
				'phone_number',
				'ssm_registration',
				'business_type'
			])
		)
			return;

		goto(ROUTES.signUp.business.setup);
	}
</script>

<div class="flex h-full flex-col bg-white">
	<!-- Title -->
	<div class="shrink-0 px-8 pt-6 pb-3">
		<Title size="medium">Business Details</Title>
		<span
			class="mt-1 inline-block rounded-full bg-brand-dark px-3 py-0.5 text-xs text-white italic"
		>
			Business
		</span>
	</div>

	<!-- Step indicator — 3 steps for business -->
	<StepTracker steps={BUSINESS_SIGNUP_STEPS} currentStep={1} />

	<!-- Form -->
	<div class="flex shrink-0 flex-col gap-2.5 px-8">
		<!-- Restaurant name -->
		<InputField
			placeholder="Restaurant name"
			bind:value={registration.restaurant_name}
			error={form.errors.restaurant_name}
			onblur={() => form.touch('restaurant_name')}
		/>

		<SelectField
			bind:value={registration.business_type}
			options={BUSINESS_TYPE}
			placeholder="Business type"
			error={form.errors.business_type}
		/>

		<!-- Location -->
		<div>
			<InputField
				placeholder="Campus or nearby address"
				bind:value={registration.location}
				error={form.errors.location}
				onblur={() => form.touch('location')}
			/>
			<p class="mt-1 px-1 text-[11px] text-brand-gray italic">
				e.g. Block C Cafeteria, Near Library Gate
			</p>
		</div>

		<!-- Phone -->
		<InputField
			type="tel"
			placeholder="Phone number (optional)"
			bind:value={registration.phone_number}
			error={form.errors.phone_number}
			onblur={() => form.touch('phone_number')}
		/>

		<!-- Cuisine type — tag input -->
		<TagInput
			name="cuisine_type"
			bind:tags={cuisineTags}
			bind:tagInput={cuisineInput}
			suggestions={cuisineSuggestions}
		/>
		<!-- SSM registration -->
		<div>
			<InputField
				placeholder="SSM registration number (optional)"
				bind:value={registration.ssm_registration}
				error={form.errors.ssm_registration}
				onblur={() => form.touch('ssm_registration')}
			/>
			<p class="mt-1 px-1 text-[11px] text-brand-gray italic">
				Business registration number if applicable
			</p>
		</div>
	</div>

	<!-- CTA -->
	<div class="shrink-0 px-8 pt-6">
		<PrimaryButton text="Continue" onclick={handleSubmit} />
	</div>
</div>
