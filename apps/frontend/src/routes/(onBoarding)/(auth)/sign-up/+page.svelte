<script>
	import { applyAction, enhance } from '$app/forms';
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
	import { accountSchema } from '$lib/utils/schemas';
	import { ROUTES } from '$lib/utils/routes.js';
	import { toastStore } from '$lib/stores/toasts.svelte.js';
	import { onMount } from 'svelte';

	let { form } = $props();

	let password = $state('');
	let confirmPassword = $state('');
	let isSubmitting = $state(false);

	onMount(() => {
		if (!registration.role) {
			toastStore.error('Something went wrong. Please start again.');
			goto(ROUTES.chooseRole);
		}
	});
	const schemaForm = useFormValidation(accountSchema, () => ({
		name: registration.name,
		email: registration.email,
		password,
		confirmPassword
	}));

	const errors = $derived({ ...schemaForm.errors, ...form?.errors });

	const isBusiness = $derived(registration.role === 'business');

	const steps = $derived(
		isBusiness ? BUSINESS_SIGNUP_STEPS : CUSTOMER_SIGNUP_STEPS
	);

	function handleSignUp(event) {
		if (
			!schemaForm.submitValidate([
				'name',
				'email',
				'password',
				'confirmPassword'
			])
		) {
			event.cancel();
			return;
		}

		isSubmitting = true;

		return async ({ update, result }) => {
			isSubmitting = false;
			if (result.type === 'failure') {
				toastStore.error(
					result.data?.errors?.server || 'An error occurred. Please try again.'
				);
				console.error('Signup error:', result.data);
			}
			if (result.type === 'redirect') {
				await applyAction(result);
				return;
			}
			await update();
		};
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

	<form
		method="POST"
		use:enhance={handleSignUp}
		class="flex shrink-0 flex-col gap-2.5 px-8"
	>
		<input type="hidden" name="role" value={registration.role} />

		<InputField
			name="name"
			placeholder={isBusiness ? "Owner's full name" : 'Full name'}
			bind:value={registration.name}
			error={errors.name}
			onblur={() => schemaForm.touch('name')}
		/>

		<InputField
			name="email"
			type="email"
			placeholder="Email address"
			bind:value={registration.email}
			error={errors.email}
			onblur={() => schemaForm.touch('email')}
		/>

		<PasswordInput
			name="password"
			placeholder="Password"
			bind:value={password}
			error={errors.password}
			onblur={() => schemaForm.touch('password')}
		/>

		<PasswordInput
			name="confirmPassword"
			placeholder="Confirm Password"
			bind:value={confirmPassword}
			error={errors.confirmPassword}
			onblur={() => schemaForm.touch('confirmPassword')}
		/>

		{#if isBusiness}
			<p class="text-[11px] text-brand-gray italic">
				You'll add your restaurant details in the next step.
			</p>
		{/if}

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
			<PrimaryButton
				type="submit"
				text={isSubmitting ? 'Creating account...' : 'Create Account'}
				loading={isSubmitting}
			/>
		</div>
	</form>
</div>
