<script>
	import Header from '$lib/components/Header.svelte';
	import InputField from '$lib/components/ui/InputField.svelte';
	import PrimaryButton from '$lib/components/ui/PrimaryButton.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { goto } from '$app/navigation';
	import { registration } from '$lib/stores/registration.svelte.js';
	import { CUSTOMER_SIGNUP_STEPS, GENDER_OPTIONS } from '$lib/utils/constants';
	import StepTracker from '$lib/components/StepTracker.svelte';
	import { validate } from '$lib/utils/validate';
	import { customerProfileSchema } from '$lib/utils/schemas';
	import { useFormValidation } from '$lib/utils/useFormValidation.svelte.js';
	import { ROUTES } from '$lib/utils/routes.js';

	let errors = $state({});

	const form = useFormValidation(customerProfileSchema, () => ({
		student_id: registration.student_id,
		phone_number: registration.phone_number,
		gender: registration.gender,
		default_pickup_location: registration.default_pickup_location
	}));

	function handleSubmit() {
		if (
			!form.submitValidate([
				'student_id',
				'phone_number',
				'gender',
				'default_pickup_location'
			])
		)
			return;

		goto(ROUTES.signUp.review);
	}
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden
         bg-white font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:rounded-phone"
>
	<Header backUrl={ROUTES.signUp.account} />

	<div class="shrink-0 px-8 pt-1.5 pb-3">
		<Title size="medium">Your Profile</Title>
		<span
			class="mt-1 inline-block rounded-full bg-brand-yellow px-3 py-0.5 text-xs text-white italic"
		>
			Customer
		</span>
	</div>

	<StepTracker steps={CUSTOMER_SIGNUP_STEPS} currentStep={1} />

	<div class="flex shrink-0 flex-col gap-2.5 px-8">
		<!-- Student ID -->
		<InputField
			placeholder="Student / Matric ID"
			bind:value={registration.student_id}
			error={form.errors.student_id}
			onblur={() => form.touch('student_id')}
		/>

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
			<select
				bind:value={registration.gender}
				class="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#F6F6F6]
               px-4 py-3.5 font-abeezee text-base italic transition-colors duration-200
               outline-none focus:border-brand-yellow focus:bg-white
               {registration.gender ? 'text-brand-dark' : 'text-brand-gray'}"
			>
				<option value="" disabled selected hidden>Gender (optional)</option>
				{#each GENDER_OPTIONS as option}
					<option value={option}>{option}</option>
				{/each}
			</select>

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
