<script>
	import Header from '$lib/components/Header.svelte';
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
		ssm_registration: registration.ssm_registration
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

	function addCuisine(tag) {
		const clean = tag.trim();
		if (!clean || cuisineTags.includes(clean)) return;
		cuisineTags = [...cuisineTags, clean];
		cuisineInput = '';
		registration.cuisine_type = cuisineTags.join(', ');
	}

	function removeCuisine(tag) {
		cuisineTags = cuisineTags.filter((c) => c !== tag);
		registration.cuisine_type = cuisineTags.join(', ');
	}

	function handleCuisineKeydown(e) {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			addCuisine(cuisineInput);
		}
		if (e.key === 'Backspace' && !cuisineInput && cuisineTags.length) {
			removeCuisine(cuisineTags.at(-1));
		}
	}

	function handleSubmit() {
		if (
			!form.submitValidate([
				'restaurant_name',
				'location',
				'phone_number',
				'ssm_registration'
			])
		)
			return;

		goto(ROUTES.signUp.business.setup);
	}
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden
         bg-white font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:rounded-phone"
>
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
		<div>
			<div
				class="flex min-h-13 w-full flex-wrap items-center gap-1.5 rounded-lg
               border border-[#E8E8E8] bg-[#F6F6F6] px-3 py-2 transition-colors
               duration-200 focus-within:border-brand-yellow focus-within:bg-white"
			>
				<!-- existing tags -->
				{#each cuisineTags as tag}
					<span
						class="flex items-center gap-1 rounded-full bg-brand-yellow px-2.5
                   py-0.5 text-xs text-white italic"
					>
						{tag}
						<button
							type="button"
							class="ml-0.5 opacity-70 hover:opacity-100"
							onclick={() => removeCuisine(tag)}
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
					placeholder={cuisineTags.length
						? 'Add more...'
						: 'Cuisine type (optional)'}
					bind:value={cuisineInput}
					onkeydown={handleCuisineKeydown}
				/>
			</div>

			<!-- suggestions -->
			{#if cuisineSuggestions.filter((s) => !cuisineTags.includes(s)).length}
				<div class="mt-1.5 flex flex-wrap gap-1.5 px-1">
					{#each cuisineSuggestions.filter((s) => !cuisineTags.includes(s)) as suggestion}
						<button
							type="button"
							class="rounded-full border border-brand-gray px-2.5 py-0.5
                     text-xs text-brand-gray italic transition-colors
                     hover:border-brand-yellow hover:text-brand-yellow"
							onclick={() => addCuisine(suggestion)}
						>
							+ {suggestion}
						</button>
					{/each}
				</div>
			{/if}
		</div>

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
