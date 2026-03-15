<script>
	import Header from '$lib/components/Header.svelte';
	import SocialLoginButton from '$lib/components/ui/SocialLoginButton.svelte';
	import InputField from '$lib/components/ui/InputField.svelte';
	import PasswordInput from '$lib/components/ui/PasswordInput.svelte';
	import PrimaryButton from '$lib/components/ui/PrimaryButton.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { goto } from '$app/navigation';
	import { registration } from '$lib/stores/registration.svelte.js';
	import { useFormValidation } from '$lib/utils/useFormValidation.svelte.js';
	import {
		BUSINESS_SIGNUP_STEPS,
		CUSTOMER_SIGNUP_STEPS
	} from '$lib/utils/constants';
	import StepTracker from '$lib/components/StepTracker.svelte';
	import { validate } from '$lib/utils/validate';
	import { accountSchema } from '$lib/utils/schemas';
	import { ROUTES } from '$lib/utils/routes.js';

	let password = $state('');
	let confirmPassword = $state('');
	let errors = $state({});

	const form = useFormValidation(accountSchema, () => ({
		name: registration.name,
		email: registration.email,
		password,
		confirmPassword
	}));

	const isBusiness = $derived(registration.role === 'business');

	const steps = $derived(
		isBusiness ? BUSINESS_SIGNUP_STEPS : CUSTOMER_SIGNUP_STEPS
	);

	const nextRoute = $derived(
		isBusiness ? ROUTES.signUp.business.details : ROUTES.signUp.customer.profile
	);

	function handleSignUp() {
		if (!form.submitValidate(['name', 'email', 'password', 'confirmPassword']))
			return;
		registration.password = password;
		goto(nextRoute);
	}
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden
         bg-white font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:rounded-phone"
>
	<Header backUrl={ROUTES.chooseRole} />

	<div class="shrink-0 px-8 pt-1.5 pb-3">
		<Title size="medium">Sign Up</Title>
		<span
			class="mt-1 inline-block rounded-full px-3 py-0.5 text-xs text-white italic
             {isBusiness ? 'bg-brand-dark' : 'bg-brand-yellow'}"
		>
			{isBusiness ? 'Business' : 'Customer'}
		</span>
	</div>

	<StepTracker {steps} currentStep={0} />

	<div class="flex shrink-0 flex-col gap-2.5 px-8">
		<InputField
			placeholder={isBusiness ? "Owner's full name" : 'Full name'}
			bind:value={registration.name}
			error={form.errors.name}
			onblur={() => form.touch('name')}
		/>

		<InputField
			type="email"
			placeholder="Email address"
			bind:value={registration.email}
			error={form.errors.email}
			onblur={() => form.touch('email')}
		/>

		<PasswordInput
			placeholder="Password"
			bind:value={password}
			error={form.errors.password}
			onblur={() => form.touch('password')}
		/>

		<PasswordInput
			placeholder="Confirm Password"
			bind:value={confirmPassword}
			error={form.errors.confirmPassword}
			onblur={() => form.touch('confirmPassword')}
		/>

		{#if isBusiness}
			<p class="text-[11px] text-brand-gray italic">
				You'll add your restaurant details in the next step.
			</p>
		{/if}
	</div>

	<div class="flex shrink-0 flex-col items-center gap-2.5 px-8 pt-3">
		<div class="flex w-full items-center gap-4">
			<div class="h-px flex-1 bg-brand-gray"></div>
			<span class="text-base text-brand-gray-dark italic">OR</span>
			<div class="h-px flex-1 bg-brand-gray"></div>
		</div>

		<p class="m-0 text-lg text-brand-gray-dark italic">Continue with</p>

		<div class="flex items-center gap-3.5">
			<SocialLoginButton provider="google" />
		</div>
	</div>

	<div class="shrink-0 px-8 pt-4">
		<PrimaryButton text="Create Account" onclick={handleSignUp} />
	</div>
</div>
